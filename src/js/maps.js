import { randomItem, range } from '@/js/utils.js'

/*
Map elements
0: empty space
1: wall

2: player 1 pointing up
3: player 1 pointing right
4: player 1 pointing down
5: player 1 pointing left

6: player 2 pointing up
7: player 2 pointing right
8: player 2 pointing down
9: player 2 pointing left

10: fire
*/

const maps = {
  basic: [
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 1, 0, 0, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1]
  ]
}

class BattleGround {
  move_reward = -1
  orient_reward = -2
  stay_still_reward = -2
  move_into_wall_reward = -5
  fire_reward = -10
  kill_reward = 100

  player_locations = [
    [1, 1],
    [8, 8]
  ]
  default_starting_locations = [
    [1, 1],
    [8, 7]
  ]

  player_vals = [
    { up: 2, right: 3, down: 4, left: 5 },
    { up: 6, right: 7, down: 8, left: 9 }
  ]

  inverse_player_vals = this.player_vals.map(v => {
    return Object.keys(v).reduce((s, x) => {
      s[v[x]] = x
      return s
    }, {})
  })

  structure_vals = {
    space: 0,
    wall: 1,
    fire: 10
  }

  non_wall_vals = [0, 2, 3, 4, 5, 6, 7, 8, 9, 10]

  actions = ['up', 'right', 'left', 'down', 'fire', 'none']

  constructor(map_vals) {
    this.map_vals = map_vals
  }

  getWidth() {
    return this.map_vals[0].length
  }

  getHeight() {
    return this.map_vals.length
  }

  extractNonWallBlocks(map_vals) {
    let blocks = []
    map_vals.forEach((row_vals, row) => {
      blocks = blocks.concat(
        row_vals
          .map((val, col) => [row, col, val])
          .filter(v => v[2] != this.structure_vals['wall'])
      )
    })
    return blocks
  }

  getStateAsPlayer(player) {
    if (player == 0) {
      return this.getState()
    } else if (player == 1) {
      // Create a copy of the 2 dimensional array
      let state = this.getState().map(x => [...x])

      // Make player 1 look like player 2
      state[this.player_locations[0][0]][
        this.player_locations[0][1]
      ] = this.playerOrientationToVal(1, this.getPlayerOrientation(0))

      // Make player 2 look like player 1
      state[this.player_locations[1][0]][
        this.player_locations[1][1]
      ] = this.playerOrientationToVal(0, this.getPlayerOrientation(1))

      return state
    }
  }

  getReducedStateAsPlayer(player) {
    return this.extractNonWallBlocks(this.getStateAsPlayer(player)).map(
      x => x[2]
    )
  }

  playerOrientationToVal(player, orientation) {
    return this.player_vals[player][orientation]
  }

  playerValToOrientation(player, val) {
    return this.inverse_player_vals[player][val]
  }

  getPlayerOrientation(player) {
    return this.playerValToOrientation(
      player,
      this.getBlockAt(this.player_locations[player])
    )
  }

  getState() {
    return this.map_vals
  }

  valIsPlayer(val, player) {
    return Object.values(this.player_vals[player]).includes(val)
  }

  valIsAnyPlayer(val) {
    return this.player_vals.some(player => Object.values(player).includes(val))
  }

  reset(random = false) {
    this.clearFireFromBoard()
    this.spawnPlayer(0, random)
    this.spawnPlayer(1, random)
  }

  spawnPlayer(player, random = false) {
    this.clearPlayerFromBoard(player)

    if (random) {
      let potential_spots = []
      this.map_vals.forEach((row_vals, row) => {
        potential_spots = potential_spots.concat(
          row_vals
            .map((val, col) => [row, col, val])
            .filter(v => v[2] == this.structure_vals['space'])
        )
      })
      let chosen_spot = randomItem(potential_spots)
      this.setBlockAt(chosen_spot, this.player_vals[player]['right'])

      this.player_locations[player] = [chosen_spot[0], chosen_spot[1]]
    } else {
      this.player_locations[player] = this.default_starting_locations[player]
      this.setBlockAt(
        this.player_locations[player],
        this.player_vals[player]['right']
      )
    }
  }

  action(action_name, player) {
    let old_location = this.player_locations[player]
    let new_location = [...old_location]
    let current_orientation = this.getPlayerOrientation(player)
    let reoriented = false
    let reward

    this.clearFireFromBoard()

    switch (action_name) {
      case 'up':
        if (current_orientation == 'up') {
          new_location[0] = Math.min(
            Math.max(old_location[0] - 1, 0),
            this.getHeight()
          )
          return [this.movePlayer(old_location, new_location, player), false]
        } else {
          this.setBlockAt(old_location, this.player_vals[player]['up'])
          return [this.orient_reward, false]
        }
        break
      case 'down':
        if (current_orientation == 'down') {
          new_location[0] = Math.min(
            Math.max(old_location[0] + 1, 0),
            this.getHeight()
          )
          return [this.movePlayer(old_location, new_location, player), false]
        } else {
          this.setBlockAt(old_location, this.player_vals[player]['down'])
          return [this.orient_reward, false]
        }
        break
      case 'left':
        if (current_orientation == 'left') {
          new_location[1] = Math.min(
            Math.max(old_location[1] - 1, 0),
            this.getWidth()
          )
          return [this.movePlayer(old_location, new_location, player), false]
        } else {
          this.setBlockAt(old_location, this.player_vals[player]['left'])
          return [this.orient_reward, false]
        }
        break
      case 'right':
        if (current_orientation == 'right') {
          new_location[1] = Math.min(
            Math.max(old_location[1] + 1, 0),
            this.getWidth()
          )
          return [this.movePlayer(old_location, new_location, player), false]
        } else {
          this.setBlockAt(old_location, this.player_vals[player]['right'])
          return [this.orient_reward, false]
        }
        break
      case 'fire':
        let reward = this.fire(new_location, current_orientation, player)
        return [reward, reward == this.kill_reward]
        break
      case 'none':
        return [this.stay_still_reward, false]
        break
      default:
    }
  }

  movePlayer(old_location, new_location, player) {
    if (
      this.getBlockAt(new_location) == this.structure_vals['space'] ||
      this.getBlockAt(new_location) == this.structure_vals['fire']
    ) {
      let player_state = this.getBlockAt(old_location)
      this.setBlockAt(old_location, this.structure_vals['space'])
      this.setBlockAt(new_location, player_state)
      this.player_locations[player] = new_location
      return this.move_reward
    } else {
      return this.move_into_wall_reward
    }
  }

  fire(from_location, direction) {
    let indices
    let reward = this.fire_reward

    switch (direction) {
      case 'right':
        indices = range(from_location[1] + 1, this.getWidth())
        indices = indices.map(i => [from_location[0], i])
        break
      case 'left':
        indices = range(0, from_location[1])
        indices.reverse()
        indices = indices.map(i => [from_location[0], i])
        break
      case 'up':
        indices = range(0, from_location[0])
        indices.reverse()
        indices = indices.map(i => [i, from_location[1]])
        break
      case 'down':
        indices = range(from_location[0] + 1, this.getHeight())
        indices = indices.map(i => [i, from_location[1]])
        break
    }

    //console.log(indices)

    // some short circuits and stops evaluation on first true returned
    indices.some(loc => {
      /*console.log(
        `[${loc[0]},${loc[1]}] -> ${this.getBlockAt(
          loc
        )} - is player = ${this.valIsAnyPlayer(this.getBlockAt(loc))}`
      )*/
      if (this.getBlockAt(loc) == 0) {
        this.setBlockAt(loc, this.structure_vals['fire'])
        return false
      } else {
        if (this.valIsAnyPlayer(this.getBlockAt(loc))) {
          reward = this.kill_reward
        }
        return true
      }
    })

    return reward
  }

  applyToBoard(fun) {
    for (let r = 0; r < this.getHeight(); r++) {
      for (let c = 0; c < this.getWidth(); c++) {
        fun(r, c)
      }
    }
  }

  clearFireFromBoard() {
    this.applyToBoard((r, c) => {
      if (this.getBlockAt([r, c]) == this.structure_vals['fire']) {
        this.setBlockAt([r, c], this.structure_vals['space'])
      }
    })
  }

  clearPlayerFromBoard(player) {
    this.applyToBoard((r, c) => {
      if (this.valIsPlayer(this.getBlockAt([r, c]), player)) {
        this.setBlockAt([r, c], this.structure_vals['space'])
      }
    })
  }

  getBlockAt(location) {
    return this.map_vals[location[0]][location[1]]
  }

  setBlockAt(location, val) {
    this.map_vals[location[0]][location[1]] = val
  }
}

export { maps, BattleGround }
