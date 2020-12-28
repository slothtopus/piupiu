import { randomItem, range } from '@/js/utils.js'

/*
Map elements
0: empty space
1: wall
2: player 1 pointing up
3: player 1 pointing right
4: player 1 pointing down
5: player 1 pointing left
6: fire
*/

const maps = {
  basic: [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 1, 0, 0, 0, 1, 0, 1],
    [1, 0, 0, 1, 0, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  ]
}

class BattleMap {
  constructor(map_vals) {
    this.map_vals = map_vals
  }

  getWidth() {
    return this.map_vals[0].length
  }

  getHeight() {
    return this.map_vals.length
  }

  spawnPlayerOne() {
    let potential_spots = []
    this.map_vals.forEach((row_vals, row) => {
      potential_spots = potential_spots.concat(
        row_vals.map((val, col) => [row, col, val]).filter(v => v[2] == 0)
      )
    })
    let chosen_spot = randomItem(potential_spots)
    this.map_vals[chosen_spot[0]][chosen_spot[1]] = 2

    this.player_one_location = [chosen_spot[0], chosen_spot[1]]
  }

  action(action_name, player) {
    //debugger
    let old_location =
      player == 1 ? this.player_one_location : this.player_two_location
    let new_location = [...old_location]
    let current_orientation

    switch (this.getBlockAt(old_location)) {
      case 2:
        current_orientation = 'up'
        break
      case 4:
        current_orientation = 'down'
        break
      case 5:
        current_orientation = 'left'
        break
      case 3:
        current_orientation = 'right'
        break
    }

    switch (action_name) {
      case 'up':
        if (current_orientation == 'up') {
          new_location[0] = Math.min(
            Math.max(old_location[0] - 1, 0),
            this.getHeight()
          )
        } else {
          this.setBlockAt(old_location, 2)
        }
        break
      case 'down':
        if (current_orientation == 'down') {
          new_location[0] = Math.min(
            Math.max(old_location[0] + 1, 0),
            this.getHeight()
          )
        } else {
          this.setBlockAt(old_location, 4)
        }
        break
      case 'left':
        if (current_orientation == 'left') {
          new_location[1] = Math.min(
            Math.max(old_location[1] - 1, 0),
            this.getWidth()
          )
        } else {
          this.setBlockAt(old_location, 5)
        }
        break
      case 'right':
        if (current_orientation == 'right') {
          new_location[1] = Math.min(
            Math.max(old_location[1] + 1, 0),
            this.getWidth()
          )
        } else {
          this.setBlockAt(old_location, 3)
        }
        break
      case 'fire':
        this.fire(new_location, current_orientation)
      default:
    }

    if (player == 1) {
      if (this.map_vals[new_location[0]][new_location[1]] == 0) {
        this.movePlayerOne(old_location, new_location)
      }
    }
  }

  movePlayerOne(old_location, new_location) {
    let player_state = this.map_vals[old_location[0]][old_location[1]]
    this.map_vals[old_location[0]][old_location[1]] = 0
    this.map_vals[new_location[0]][new_location[1]] = player_state
    this.player_one_location = new_location
  }

  fire(from_location, direction) {
    console.log('fire from ', from_location)
    let indices
    let canStillFire

    switch (direction) {
      case 'right':
        indices = range(from_location[1] + 1, this.getWidth())
        console.log(indices)
        canStillFire = true
        indices.forEach(i => {
          canStillFire = this.map_vals[from_location[0]][i] == 0 && canStillFire
          if (canStillFire) {
            this.map_vals[from_location[0]][i] = 6
          }
        })
        break
      case 'left':
        indices = range(0, from_location[1])
        indices.reverse()
        console.log(indices)
        canStillFire = true
        indices.forEach(i => {
          canStillFire = this.map_vals[from_location[0]][i] == 0 && canStillFire
          if (canStillFire) {
            this.map_vals[from_location[0]][i] = 6
          }
        })
        break
      case 'up':
        indices = range(0, from_location[0])
        indices.reverse()
        console.log(indices)
        canStillFire = true
        indices.forEach(i => {
          canStillFire = this.map_vals[i][from_location[1]] == 0 && canStillFire
          if (canStillFire) {
            this.map_vals[i][from_location[1]] = 6
          }
        })
        break
      case 'down':
        indices = range(from_location[0] + 1, this.getHeight())
        console.log(indices)
        canStillFire = true
        indices.forEach(i => {
          canStillFire = this.map_vals[i][from_location[1]] == 0 && canStillFire
          if (canStillFire) {
            this.map_vals[i][from_location[1]] = 6
          }
        })
        break
    }
  }

  clearFire() {
    for (let r = 0; r < this.getHeight(); r++) {
      for (let c = 0; c < this.getWidth(); c++) {
        this.map_vals[r][c] = this.map_vals[r][c] == 6 ? 0 : this.map_vals[r][c]
      }
    }
  }

  getBlockAt(location) {
    return this.map_vals[location[0]][location[1]]
  }

  setBlockAt(location, val) {
    this.map_vals[location[0]][location[1]] = val
  }
}

export { maps, BattleMap }
