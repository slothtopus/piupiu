import { randomItem } from '@/js/utils.js'

class QTableAgent {
  // https://github.com/simoninithomas/Deep_reinforcement_learning_Course/blob/master/Q%20learning/Taxi-v2/Q%20Learning%20with%20OpenAI%20Taxi-v2%20video%20version.ipynb
  // Exploration parameters
  epsilon = 1.0 // Exploration rate
  max_epsilon = 1.0 // Exploration probability at start
  min_epsilon = 0.01 // Minimum exploration probability
  decay_rate = 0.01 // Exponential decay rate for exploration prob
  learning_rate = 0.7
  gamma = 0.7 // Discounting rate
  episode = 0 // Count of episodes (i.e. games) played

  qTable = {}

  constructor(actions) {
    this.actions = actions
  }

  chooseAction(state) {
    if (Math.random() > this.epsilon && state in this.qTable) {
      let q_vals = this.qTable[state]
      let action = this.actions[q_vals.findIndex(x => x == Math.max(...q_vals))]
      return action
    } else {
      let weights = Array(this.actions.length).fill(1)
      return randomItem(this.actions, weights)
    }
  }

  update(state, next_state, action, reward) {
    //console.log('update: ', action, reward)
    let state_q_vals =
      state in this.qTable
        ? this.qTable[state]
        : Array(this.actions.length).fill(0)

    //console.log('state_q_vals: ', state_q_vals)

    let next_state_q_vals =
      next_state in this.qTable
        ? this.qTable[next_state]
        : Array(this.actions.length).fill(0)

    //console.log('next_state_q_vals: ', state_q_vals)

    let action_index = this.actions.findIndex(x => x == action)

    //console.log('action_index: ', action_index)

    // The magic update
    state_q_vals[action_index] =
      state_q_vals[action_index] +
      this.learning_rate *
        (reward +
          this.gamma * Math.max(...next_state_q_vals) -
          state_q_vals[action_index])

    this.qTable[state] = state_q_vals

    this.epsilon =
      this.min_epsilon +
      (this.max_epsilon - this.min_epsilon) *
        Math.exp(-this.decay_rate * this.episode)

    console.log('state_q_vals: ', this.epsilon, state_q_vals)
  }

  endGame() {
    this.episode = this.episode + 1
  }
}

export { QTableAgent }
