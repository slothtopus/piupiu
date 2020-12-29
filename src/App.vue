<template>
  <div id="app" class="fullscreen-container">
    <!--<button @click="currentPlayer = 0">Control player 1</button>
    <button @click="currentPlayer = 1">Control player 2</button>-->
    <h1>Piu Piu</h1>
    <div class="horizontal-spacing button-container">
      <button @click="startPlaying">Start</button>
      <button @click="stopPlaying">Stop</button>
      <button :disabled="this.playing" @click="singleMove">Single move</button>
    </div>
    <div style="display: flex; flex-direction: row;">
      Speed: <input v-model="speed" type="range" min="0" max="100" />
      {{ speed }}
    </div>
    <!--<button @click="debug">Debug</button>-->
    <p>
      Controlling player {{ currentPlayer + 1 }}<br />
      State size: {{ stateSize }} | Move: {{ moveNumber }} | Game {{ gameNumber
      }}<br />
      Player 1 wins: {{ playerWins[0] }} | Player 2 wins: {{ playerWins[1] }}
    </p>
    <Map :width="400" :height="400" :map_vals="map_vals" />
  </div>
</template>

<script>
import Map from './components/Map.vue'
import { maps, BattleGround } from '@/js/maps.js'
import { QTableAgent } from '@/js/QTableAgent.js'

export default {
  name: 'App',
  components: {
    Map
  },
  data() {
    return {
      battleGround: new BattleGround(maps['basic']),
      map_vals: [[]],
      keyPressed: undefined,
      keyWatcher: undefined,
      playerMover: undefined,
      playing: false,
      currentPlayer: 0,
      gameOver: false,
      newGame: true,
      stateSize: 0,
      agent: undefined,
      moveNumber: 0,
      gameNumber: 1,
      playerWins: [0, 0],
      speed: 50
    }
  },
  mounted() {
    //this.battleGround.spawnPlayer(0)
    //this.battleGround.spawnPlayer(1)
    this.battleGround.reset(true)
    this.map_vals = this.battleGround.getState()
    //this.stateSize = this.battleGround.getStateSize()
    this.agent = new QTableAgent(this.battleGround.actions)
    //this.keyWatcher = setInterval(this.takeAction, 100)
  },
  created() {
    window.addEventListener('keydown', event => {
      this.keyPressed = event.key
    })
    window.addEventListener('keyup', event => {
      this.keyPressed = undefined
    })
  },
  methods: {
    startPlaying() {
      this.playing = true
      this.doMove()
    },
    stopPlaying() {
      this.playing = false
    },
    singleMove() {
      this.doMove()
    },
    doMove(newGame = false) {
      if (newGame) {
        this.agent.endGame()
        this.battleGround.reset(true)
        this.gameNumber += 1
        this.moveNumber = 0
        this.currentPlayer = 0
        this.updateMapFromState()
        if (this.playing) {
          setTimeout(this.doMove, this.speed)
        }
        return
      }

      let state = this.battleGround.getReducedStateAsPlayer(this.currentPlayer)
      let action = this.agent.chooseAction(state)
      let reward = this.battleGround.action(action, this.currentPlayer)
      console.log('action/reward:', action, reward)
      let new_state = this.battleGround.getReducedStateAsPlayer(
        this.currentPlayer
      )
      this.agent.update(state, new_state, action, reward[0])

      this.stateSize = Object.keys(this.agent.qTable).length
      this.moveNumber += 1

      this.updateMapFromState()

      let start_new_game_next_loop = this.moveNumber > 200

      if (reward[1]) {
        this.playerWins[this.currentPlayer] += 1
        start_new_game_next_loop = true
      }

      this.currentPlayer = (this.currentPlayer + 1) % 2

      if (this.playing) {
        setTimeout(this.doMove, this.speed, start_new_game_next_loop)
      }
    },
    updateMapFromState() {
      if (this.speed > 0) {
        this.map_vals = [...this.battleGround.getState()]
      }
    },
    debug() {
      debugger
    },
    takeAction() {
      if (this.gameOver) {
        alert('Game Over')
        this.gameOver = false
        this.battleGround.reset()
      } else {
        let reward
        switch (this.keyPressed) {
          case 'ArrowUp':
            reward = this.battleGround.action('up', this.currentPlayer)
            break
          case 'ArrowDown':
            reward = this.battleGround.action('down', this.currentPlayer)
            break
          case 'ArrowLeft':
            reward = this.battleGround.action('left', this.currentPlayer)
            break
          case 'ArrowRight':
            reward = this.battleGround.action('right', this.currentPlayer)
            break
          case ' ':
            reward = this.battleGround.action('fire', this.currentPlayer)
            break
          default:
            reward = this.battleGround.action('none', this.currentPlayer)
        }
        this.map_vals = [...this.battleGround.getState()]

        if (reward[0]) {
          console.log('Reward: ', reward[0])
        }
        this.gameOver = reward[1]
      }
    }
  }
}
</script>

<style>
.fullscreen-container {
  position: absolute;
  top: 0px;
  left: 0px;
  bottom: 0px;
  right: 0px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #212121;
  color: lightgray;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  /*color: #2c3e50;*/
  /*margin-top: 60px;*/
}

button {
  width: 10rem;
}

input {
  width: 20rem;
}

.horizontal-spacing > * + * {
  margin-left: 1rem;
}

.button-container {
  display: flex;
  flex-direction: row;
  margin-bottom: 1rem;
}
</style>
