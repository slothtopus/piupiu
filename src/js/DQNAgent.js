const tf = require('@tensorflow/tfjs')

class DQNAgent {
  constructor(state_size, action_size, learning_rate) {
    this.state_size = state_size
    this.action_size = action_size
    this.learning_rate = learning_rate
  }

  createModel() {
    // https://github.com/simoninithomas/Deep_reinforcement_learning_Course/blob/master/Deep%20Q%20Learning/Doom/Deep%20Q%20learning%20with%20Doom.ipynb

    this._inputs = tf.input({
      dtype: 'int32',
      shape: [null, ...[this.state_size]],
      name: 'inputs'
    })
    this._actions = tf.input({
      dtype: 'int32',
      shape: [null, this.action_size],
      name: 'actions'
    })
    this._target_Q = tf.input({
      dtype: 'float32',
      shape: [null],
      name: 'target_Q'
    })

    const fc1 = tf.layers.dense({
      units: 128,
      activation: 'elu'
    })

    const fc2 = tf.layers.dense({
      units: 64,
      activation: 'elu'
    })

    const fc3 = tf.layers.dense({
      units: this.action_size
    })

    const output = fc3.apply(fc2.apply(fc1.apply(this._inputs)))
  }
}

export { DQNAgent }
