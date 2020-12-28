<template>
  <div class="fullscreen-container">
    <Map :width="500" :height="500" :map_vals="map_vals" />
  </div>
</template>

<script>
import Map from './components/Map.vue'
import { maps, BattleMap } from '@/js/maps.js'

export default {
  name: 'App',
  components: {
    Map
  },
  data() {
    return {
      battleMap: new BattleMap(maps['basic']),
      map_vals: [[]],
      keyPressed: undefined,
      keyWatcher: undefined
    }
  },
  mounted() {
    this.battleMap.spawnPlayerOne()
    this.map_vals = this.battleMap.map_vals
    this.keyWatcher = setInterval(this.takeAction, 100)
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
    takeAction() {
      if (this.keyPressed) {
        console.log(this.keyPressed)
      }
      switch (this.keyPressed) {
        case 'ArrowUp':
          this.battleMap.action('up', 1)
          break
        case 'ArrowDown':
          this.battleMap.action('down', 1)
          break
        case 'ArrowLeft':
          this.battleMap.action('left', 1)
          break
        case 'ArrowRight':
          this.battleMap.action('right', 1)
          break
        case ' ':
          this.battleMap.action('fire', 1)
          break
        default:
          this.battleMap.clearFire()
      }
      this.map_vals = [...this.battleMap.map_vals]
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
}
/*#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}*/
</style>
