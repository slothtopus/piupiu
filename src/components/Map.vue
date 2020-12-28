<template>
  <div class="map-container" :style="mapSizeStyle">
    <MapBlock
      class="map-block"
      v-for="b in mapBlocks"
      :key="b.key"
      :style="b.position"
      :type="b.type"
    />
  </div>
</template>

<script>
//import { maps, BattleMap } from '@/js/maps.js'
import MapBlock from '@/components/MapBlock.vue'

export default {
  name: 'Map',
  components: { MapBlock },
  props: {
    width: Number,
    height: Number,
    map: String,
    map_vals: Array
  },
  /*data() {
    return {
      battleMap: new BattleMap(maps[this.map])
    }
  },*/
  computed: {
    mapSizeStyle() {
      return {
        width: this.width + 'px',
        height: this.height + 'px',
        backgroundColor: 'blue'
      }
    },
    mapBlocks() {
      let map_blocks = []
      let block_height = this.height / this.map_vals.length
      let block_width = this.width / this.map_vals[0].length

      this.map_vals.forEach((vals, row) => {
        map_blocks = map_blocks.concat(
          vals.map((v, col) => {
            return {
              key: `${row},${col}`,
              position: {
                left: col * block_width + 'px',
                top: row * block_height + 'px',
                width: block_width + 'px',
                height: block_height + 'px'
              },
              type: v
            }
          })
        )
      })

      return map_blocks
    }
  }
  /*mounted() {
    this.battleMap.spawnPlayerOne()
  }*/
  /*destroyed() {
    window.removeEventListener('keydown', this.handleKeyPress)
  },
  methods: {
    handleKeyPress(event) {
      this.keyPressed
    }
  }*/
}
</script>

<style scoped>
.map-container {
  position: relative;
}
</style>
