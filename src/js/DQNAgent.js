const tf = require('@tensorflow/tfjs')
import { randomItem } from '@/js/utils.js'

class DQNAgent {
  max_epsilon = 1.0 // Exploration probability at start
  min_epsilon = 0.01 // Minimum exploration probability
  decay_rate = 0.01 // Exponential decay rate for exploration prob
  learning_rate = 0.0002
  gamma = 0.7 // Discounting rate
  decay_step = 0 // Count of episodes (i.e. games) played

  batch_size = 256
  experience_buffer = []
  experience_buffer_obj = {}
  experience_buffer_size = 50000

  canUseReducedState = false // If we can use game state reduced (i.e without the walls)

  constructor(state_size, state_levels, actions, example_state) {
    this.state_size = state_size
    this.state_levels = state_levels
    this.actions = actions
    this.example_state = example_state
    this.reset()
  }

  reset() {
    this.experience_buffer = []
    this.experience_buffer_obj = {}
    this.decay_step = 0
  }

  chooseAction(state) {
    const epsilon =
      this.min_epsilon +
      (this.max_epsilon - this.min_epsilon) *
        Math.exp(-this.decay_rate * this.decay_step)

    if (Math.random() > epsilon) {
      // Take best action
      let index = this.estimate_best_action_index([state])[0]
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
    /*this.experience_buffer.push([state, next_state, action, reward, game_over])
    if (this.experience_buffer.length > this.experience_buffer_size) {
      this.experience_buffer.shift()
    }*/
    this.addToMemory([state, next_state, action, reward, game_over])

    // check if we've got enough experience to start training
    if (Object.keys(this.experience_buffer_obj).length >= this.batch_size) {
      //debugger
      // randomly sample a batch
      /*let batch = []
      let randomIndex
      for (let i = 0; i < this.batch_size; i++) {
        randomIndex = Math.floor(Math.random() * this.experience_buffer.length)
        batch.push(this.experience_buffer.splice(randomIndex, 1)[0])
      }
      //debugger
      this.experience_buffer.push(...batch)*/

      let batch = this.sampleMemory(this.batch_size)

      const states = batch.map(x => x[0])
      const next_states = batch.map(x => x[1])
      const actions = batch.map(x => x[2])
      /*const Q_vals_next_state = this.estimate_best_action_val(
        next_states
      ).dataSync()*/
      const Q_vals_next_state = this.estimate_best_action_val(next_states)

      const target_Qs = batch.map((b, i) => {
        if (b[4]) {
          return b[3]
        } else {
          return b[3] + this.gamma * Q_vals_next_state[i]
        }
      })

      this.optimise(states, actions, target_Qs)

      console.log(
        'buffer_size: ',
        this.experience_buffer.length,
        ' | loss: ',
        tf.tidy(() => this.loss(states, actions, target_Qs).dataSync())
      )
      //console.log(tf.memory())
    }
  }

  endGame() {
    this.decay_step = this.decay_step + 1
  }

  createModel4() {
    /*
    Built based on the cryptic hint at the end this issue:
    https://github.com/tensorflow/tfjs/issues/793
    */

    const fc1 = tf.layers.dense({
      units: 128,
      activation: 'elu'
    })
    fc1.build([null, ...this.state_size, this.state_levels])
    const fc1_output_shape = fc1.computeOutputShape([
      null,
      ...this.state_size,
      this.state_levels
    ])

    const fc2 = tf.layers.dense({
      units: 64,
      activation: 'elu'
    })
    fc2.build(fc1_output_shape)
    const fc2_output_shape = fc2.computeOutputShape(fc1_output_shape)

    const fc3 = tf.layers.dense({
      units: 64,
      activation: 'elu'
    })
    fc3.build(fc2_output_shape)
    const fc3_output_shape = fc3.computeOutputShape(fc2_output_shape)

    const flatten = tf.layers.flatten()
    const flatten_output_shape = flatten.computeOutputShape(fc3_output_shape)

    const fc4 = tf.layers.dense({
      units: this.actions.length
    })
    fc4.build(flatten_output_shape)
    const fc4_output_shape = fc4.computeOutputShape(flatten_output_shape)

    const encodeActions = actions => {
      return actions.map(a => this.actions.findIndex(x => x == a))
    }

    const oneHotEncode = (input, levels) =>
      tf.tidy(() => {
        let input_tensor = tf.tensor(input, null, 'int32')
        const input_tensor_shape = input_tensor.shape
        input_tensor = input_tensor.flatten().as1D()
        input_tensor = tf.oneHot(input_tensor, levels)
        input_tensor = input_tensor.reshape([...input_tensor_shape, levels])
        return input_tensor
      })

    this.estimate_Q = states =>
      tf.tidy(() => {
        const states_tensor = oneHotEncode(states, this.state_levels)
        let x = fc1.call(states_tensor)
        x = fc2.call(x)
        x = fc3.call(x)
        x = flatten.call(x)
        x = fc4.call(x)
        return x
      })

    this.estimate_best_action_index = states =>
      tf.tidy(() =>
        this.estimate_Q(states)
          .argMax(1)
          .dataSync()
      )

    this.estimate_best_action_val = states =>
      tf.tidy(() =>
        this.estimate_Q(states)
          .max(1)
          .dataSync()
      )

    this.loss = (states, actions, target_Q) =>
      tf.tidy(() => {
        const target_Q_tensor = tf.tensor1d(target_Q)
        const Q = this.estimate_Q(states)
        const actions_tensor = oneHotEncode(
          encodeActions(actions),
          this.actions.length
        )
        const Q_action = tf.sum(tf.mul(Q, actions_tensor), 1)
        const loss = tf.mean(tf.square(tf.sub(target_Q, Q_action)))
        return loss
      })

    const optimiser = tf.train.rmsprop(this.learning_rate)

    this.optimise = (states, actions, target_Q) =>
      tf.tidy(() =>
        optimiser.minimize(() => this.loss(states, actions, target_Q))
      )
  }
}

export { DQNAgent }
