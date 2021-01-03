const tf = require('@tensorflow/tfjs')
import { randomItem } from '@/js/utils.js'

class DQNAgent {
  max_epsilon = 1.0 // Exploration probability at start
  min_epsilon = 0.01 // Minimum exploration probability
  decay_rate = 0.01 // Exponential decay rate for exploration prob
  learning_rate = 0.001
  gamma = 0.7 // Discounting rate
  decay_step = 0 // Count of episodes (i.e. games) played
  tau = 100 // update target network weights every tau steps (Fixed Q-targets)

  batch_size = 64
  experience_buffer_obj = {}
  experience_buffer_size = 50000
  training_steps = 0

  canUseReducedState = false // If we can use game state reduced (i.e without the walls)

  losses = []
  models = {}

  constructor(state_size, state_levels, actions, example_state) {
    this.state_size = state_size
    this.state_levels = state_levels
    this.actions = actions
    this.example_state = example_state
    this.reset()
    this.setupModels()
  }

  reset() {
    this.experience_buffer_obj = {}
    this.decay_step = 0
    this.training_step = 0
  }

  chooseAction(state) {
    const epsilon =
      this.min_epsilon +
      (this.max_epsilon - this.min_epsilon) *
        Math.exp(-this.decay_rate * this.decay_step)

    if (Math.random() > epsilon) {
      // Take best action
      let index = this.DQNEstimateBestActionIndex([state])[0]
      let action = this.actions[index]
      console.log('BEST action: ', action, ' | epsilon: ', epsilon)
      return action
    } else {
      // Take random action
      let action = randomItem(this.actions)
      console.log('RANDOM action: ', action, ' | epsilon: ', epsilon)
      return action
    }
  }

  addToMemory(experience) {
    let key = experience[0].map(x => [...x])
    key.push(experience[2])

    if (!(key in this.experience_buffer_obj)) {
      if (
        Object.keys(this.experience_buffer_obj).length ==
        this.experience_buffer_size
      ) {
        const key_to_remove = randomItem(
          Object.keys(this.experience_buffer_obj)
        )
        delete this.experience_buffer_obj[key_to_remove]
      }
      this.experience_buffer_obj[key] = experience
    }
  }

  sampleMemory(n) {
    let batch = []
    let keys = Object.keys(this.experience_buffer_obj)
    let randomIndex
    for (let i = 0; i < n; i++) {
      randomIndex = Math.floor(Math.random() * keys.length)
      batch.push(keys.splice(randomIndex, 1)[0])
    }
    return batch.map(k => this.experience_buffer_obj[k])
  }

  update(state, next_state, action, reward, game_over) {
    // add experience to memory
    this.addToMemory([state, next_state, action, reward, game_over])

    // check if we've got enough experience to start training
    if (Object.keys(this.experience_buffer_obj).length >= this.batch_size) {
      let batch = this.sampleMemory(this.batch_size)

      const states = batch.map(x => x[0])
      const next_states = batch.map(x => x[1])
      const actions = batch.map(x => x[2])

      if (this.training_steps % this.tau == 0) {
        this.copyModelWeights('dqn', 'target')
      }

      // Double Q network state estimation
      let Q_vals_next_state
      if (this.training_steps <= this.tau) {
        Q_vals_next_state = this.DQNEstimateBestActionVal(next_states)
      } else {
        Q_vals_next_state = this.doubleNetworkEstimateNextState(next_states)
      }

      const target_Qs = batch.map((b, i) => {
        if (b[4]) {
          return b[3]
        } else {
          return b[3] + this.gamma * Q_vals_next_state[i]
        }
      })

      this.DQNOptimise(states, actions, target_Qs)
      this.training_steps += 1

      let loss = tf.tidy(() =>
        this.DQNLoss(states, actions, target_Qs).dataSync()
      )[0]

      this.losses.push(loss)
      if (this.losses.length > 50) {
        this.losses.shift()
      }

      let min_loss = Math.min(...this.losses)
      let max_loss = Math.max(...this.losses)
      let mean_loss =
        this.losses.reduce((s, x) => s + x, 0) / this.losses.length

      console.log(
        `Buffer length: ${this.losses.length} | Loss: ${loss.toFixed(
          4
        )} | Max loss ${max_loss.toFixed(4)} | Min loss ${min_loss.toFixed(
          4
        )} | Avg loss ${mean_loss.toFixed(4)}`
      )
      //console.log(tf.memory())
    }
  }

  endGame() {
    this.decay_step = this.decay_step + 1
  }

  /* ------------------------------------------------
                     Model functions 
  ---------------------------------------------------
  */

  /* ------ Helpers ------- */
  oneHotEncode(input, levels) {
    return tf.tidy(() => {
      let input_tensor
      if (input.constructor.name == 'Tensor') {
        input_tensor = input
      } else {
        input_tensor = tf.tensor(input, null, 'int32')
      }
      const input_tensor_shape = input_tensor.shape
      input_tensor = input_tensor.flatten().as1D()
      input_tensor = tf.oneHot(input_tensor, levels)
      input_tensor = input_tensor.reshape([...input_tensor_shape, levels])
      return input_tensor
    })
  }

  encodeActions(actions) {
    return actions.map(a => this.actions.findIndex(x => x == a))
  }

  copyModelWeights(from, to) {
    Object.keys(this.models[from]['layers']).forEach(k => {
      console.log('Copying weights from: ', k)
      this.models[to]['layers'][k].setWeights(
        this.models[from]['layers'][k].getWeights()
      )
    })
  }

  setupModels() {
    this.createConvolutionModel('dqn')
    this.createConvolutionModel('target')

    this.setupEstimateQFunction('dqn')
    this.setupEstimateQFunction('target')

    const optimiser = tf.train.rmsprop(this.learning_rate)
    this.models['dqn']['optimiser'] = optimiser

    //this.models['dqn']['estimate_Q']([this.example_state])
  }

  createConvolutionModel(model_name) {
    /*
    Built based on the cryptic hint at the end this issue:
    https://github.com/tensorflow/tfjs/issues/793
    */

    // input shape [null, 10, 9, ]
    this.models[model_name] = {}
    this.models[model_name]['layers'] = {}
    this.models[model_name]['outputs'] = {}

    const input_shape = [null, ...this.state_size, this.state_levels]
    const conv1 = tf.layers.conv2d({
      kernelSize: 2,
      filters: 32,
      padding: 'same',
      stride: 1,
      dataFormat: 'channelsLast',
      activation: 'elu',
      name: 'conv1'
    })
    conv1.build(input_shape)
    const conv1_output_shape = conv1.computeOutputShape(input_shape)
    this.models[model_name]['layers']['conv1'] = conv1
    this.models[model_name]['outputs']['conv1'] = conv1_output_shape

    const conv1_batchnorm = tf.layers.batchNormalization()
    conv1_batchnorm.build(conv1_output_shape)
    const conv1_batchnorm_output_shape = conv1_batchnorm.computeOutputShape(
      conv1_output_shape
    )
    this.models[model_name]['layers']['conv1_batchnorm'] = conv1_batchnorm
    this.models[model_name]['outputs'][
      'conv1_batchnorm'
    ] = conv1_batchnorm_output_shape

    const conv2 = tf.layers.conv2d({
      kernelSize: 4,
      filters: 32,
      padding: 'valid',
      stride: 2,
      dataFormat: 'channelsLast',
      activation: 'elu',
      name: 'conv2'
    })
    conv2.build(conv1_batchnorm_output_shape)
    const conv2_output_shape = conv2.computeOutputShape(conv1_output_shape)
    this.models[model_name]['layers']['conv2'] = conv2
    this.models[model_name]['outputs'][
      'conv2_output_shape'
    ] = conv2_output_shape

    const conv2_batchnorm = tf.layers.batchNormalization()
    conv2_batchnorm.build(conv2_output_shape)
    const conv2_batchnorm_output_shape = conv2_batchnorm.computeOutputShape(
      conv2_output_shape
    )
    this.models[model_name]['layers']['conv2_batchnorm'] = conv2_batchnorm
    this.models[model_name]['outputs'][
      'conv2_batchnorm'
    ] = conv2_batchnorm_output_shape

    const flatten = tf.layers.flatten()
    const flatten_output_shape = flatten.computeOutputShape(
      conv2_batchnorm_output_shape
    )
    this.models[model_name]['layers']['flatten'] = flatten
    this.models[model_name]['outputs']['flatten'] = flatten_output_shape

    const fc1_value = tf.layers.dense({
      units: 64,
      activation: 'elu'
    })
    fc1_value.build(flatten_output_shape)
    const fc1_value_output_shape = fc1_value.computeOutputShape(
      flatten_output_shape
    )
    this.models[model_name]['layers']['fc1_value'] = fc1_value
    this.models[model_name]['outputs']['fc1_value'] = fc1_value_output_shape

    const fc2_value = tf.layers.dense({
      units: 1
    })
    fc2_value.build(fc1_value_output_shape)
    const fc2_value_output_shape = fc2_value.computeOutputShape(
      fc1_value_output_shape
    )
    this.models[model_name]['layers']['fc2_value'] = fc2_value
    this.models[model_name]['outputs']['fc2_value'] = fc2_value_output_shape

    const fc1_action = tf.layers.dense({
      units: 64,
      activation: 'elu'
    })
    fc1_action.build(flatten_output_shape)
    const fc1_action_output_shape = fc1_action.computeOutputShape(
      flatten_output_shape
    )
    this.models[model_name]['layers']['fc1_action'] = fc1_action
    this.models[model_name]['outputs']['fc1_action'] = fc1_action_output_shape

    const fc2_action = tf.layers.dense({
      units: this.actions.length
    })
    fc2_action.build(fc1_action_output_shape)
    const fc2_action_output_shape = fc2_action.computeOutputShape(
      fc1_action_output_shape
    )
    this.models[model_name]['layers']['fc2_action'] = fc2_action
    this.models[model_name]['outputs']['fc2_action'] = fc2_action_output_shape
  }

  setupEstimateQFunction(model_name) {
    const getLayer = layer_name => this.models[model_name]['layers'][layer_name]

    const estimate_Q = (states, training) =>
      tf.tidy(() => {
        const states_tensor = this.oneHotEncode(
          states,
          this.state_levels
        ).asType('float32')
        let x = getLayer('conv1').call(states_tensor)
        x = getLayer('conv1_batchnorm').call(x, {
          training: training
        })
        x = getLayer('conv2').call(x)
        x = getLayer('conv2_batchnorm').call(x, {
          training: training
        })
        x = getLayer('flatten').call(x)
        let v
        v = getLayer('fc1_value').call(x)
        v = getLayer('fc2_value').call(v)
        let a
        a = getLayer('fc1_action').call(x)
        a = getLayer('fc2_action').call(a)
        x = tf.add(v, tf.sub(a, tf.mean(a, 1, true)))
        return x
      })

    this.models[model_name]['estimate_Q'] = estimate_Q
  }

  DQNEstimateBestActionIndex(states) {
    /* Returns the index of the action with the highest Q val */
    const dqn_estimate_Q = this.models['dqn']['estimate_Q']
    return tf.tidy(() =>
      dqn_estimate_Q(states, false)
        .argMax(1)
        .dataSync()
    )
  }

  DQNEstimateBestActionVal(states) {
    /* Returns the value of the highest Q val */
    const dqn_estimate_Q = this.models['dqn']['estimate_Q']
    return tf.tidy(() =>
      dqn_estimate_Q(states, false)
        .max(1)
        .dataSync()
    )
  }

  doubleNetworkEstimateNextState(states) {
    /*
    Uses DQN network to estimate the best action for the states
    and uses the target network (which provides fixed Q-targets) to
    estimate the Q val for these actions and returns them

    See Double DQNs here:
    https://www.freecodecamp.org/news/improvements-in-deep-q-learning-dueling-double-dqn-prioritized-experience-replay-and-fixed-58b130cc5682/
    */
    const dqn_estimate_Q = this.models['dqn']['estimate_Q']
    const target_estimate_Q = this.models['target']['estimate_Q']

    return tf.tidy(() => {
      const dqn_action_indices = this.oneHotEncode(
        dqn_estimate_Q(states, false).argMax(1),
        this.actions.length
      )
      const target_q_vals = target_estimate_Q(states, false)
      return tf.sum(tf.mul(target_q_vals, dqn_action_indices), 1).dataSync()
    })
  }

  DQNLoss(states, actions, target_Q, training) {
    /* Returns the loss for the DQN network */
    const dqn_estimate_Q = this.models['dqn']['estimate_Q']

    return tf.tidy(() => {
      const target_Q_tensor = tf.tensor1d(target_Q)
      const Q = dqn_estimate_Q(states, training)
      const actions_tensor = this.oneHotEncode(
        this.encodeActions(actions),
        this.actions.length
      )
      const Q_action = tf.sum(tf.mul(Q, actions_tensor), 1)
      const loss = tf.mean(tf.square(tf.sub(target_Q, Q_action)))
      return loss
    })
  }

  DQNOptimise(states, actions, target_Q) {
    /* Runs one optimisation pass on the DQN network */
    const optimiser = this.models['dqn']['optimiser']
    tf.tidy(() =>
      optimiser.minimize(() => this.DQNLoss(states, actions, target_Q, true))
    )
  }

  /* ============================= OLD STUFF ============================= */

  setUpDQNEstimationFunctions() {
    const getLayer = layer_name => this.models['dqn']['layers'][layer_name]

    const estimate_Q = (states, training) =>
      tf.tidy(() => {
        const states_tensor = this.oneHotEncode(
          states,
          this.state_levels
        ).asType('float32')
        let x = getLayer('conv1').call(states_tensor)
        x = getLayer('conv1_batchnorm').call(x, {
          training: training
        })
        x = getLayer('conv2').call(x)
        x = getLayer('conv2_batchnorm').call(x, {
          training: training
        })
        x = getLayer('flatten').call(x)
        x = getLayer('fc1').call(x)
        x = getLayer('fc2').call(x)
        return x
      })

    const estimate_best_action_index = states =>
      tf.tidy(() =>
        estimate_Q(states, false)
          .argMax(1)
          .dataSync()
      )

    const estimate_best_action_val = states =>
      tf.tidy(() =>
        estimate_Q(states, false)
          .max(1)
          .dataSync()
      )

    this.models['dqn']['estimate_Q'] = estimate_Q
    this.models['dqn'][
      'estimate_best_action_index'
    ] = estimate_best_action_index
    this.models['dqn']['estimate_best_action_val'] = estimate_best_action_val
  }

  setUpEstimationFunctions(model_name) {
    const getLayer = layer_name => this.models[model_name]['layers'][layer_name]

    const estimate_Q = (states, training) =>
      tf.tidy(() => {
        const states_tensor = this.oneHotEncode(
          states,
          this.state_levels
        ).asType('float32')
        let x = getLayer('conv1').call(states_tensor)
        x = getLayer('conv1_batchnorm').call(x, {
          training: training
        })
        x = getLayer('conv2').call(x)
        x = getLayer('conv2_batchnorm').call(x, {
          training: training
        })
        x = getLayer('flatten').call(x)
        x = getLayer('fc1').call(x)
        x = getLayer('fc2').call(x)
        return x
      })

    const estimate_best_action_index = states =>
      tf.tidy(() =>
        estimate_Q(states, false)
          .argMax(1)
          .dataSync()
      )

    const estimate_best_action_val = states =>
      tf.tidy(() =>
        estimate_Q(states, false)
          .max(1)
          .dataSync()
      )

    this.models[model_name]['estimate_Q'] = estimate_Q
    this.models[model_name][
      'estimate_best_action_index'
    ] = estimate_best_action_index
    this.models[model_name][
      'estimate_best_action_val'
    ] = estimate_best_action_val
  }

  setupOptimisationFunctions(model_name) {
    const estimate_Q = this.models[model_name]['estimate_Q']

    const loss = (states, actions, target_Q, training) =>
      tf.tidy(() => {
        const target_Q_tensor = tf.tensor1d(target_Q)
        const Q = estimate_Q(states, training)
        const actions_tensor = this.oneHotEncode(
          this.encodeActions(actions),
          this.actions.length
        )
        const Q_action = tf.sum(tf.mul(Q, actions_tensor), 1)
        const loss = tf.mean(tf.square(tf.sub(target_Q, Q_action)))
        return loss
      })

    const optimiser = tf.train.rmsprop(this.learning_rate)

    const optimise = (states, actions, target_Q) =>
      tf.tidy(() =>
        optimiser.minimize(() => loss(states, actions, target_Q, true))
      )

    this.models[model_name]['loss'] = loss
    this.models[model_name]['optimise'] = optimise
  }
}

export { DQNAgent }
