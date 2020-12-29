<template>
  <div class="map-block" :style="colorStyle">
    <img
      v-if="isPlayerBlock"
      width="100%"
      height="100%"
      src="@/assets/play-button.svg"
      :style="rotatePlayerStyle"
    />
  </div>
</template>

<script>
/*
Map elements
0: empty space
1: wall
2: player 1 pointing up
3: player 1 pointing right
4: player 1 pointing down
5: player 1 pointing left
*/

export default {
  name: 'MapBlock',
  props: {
    type: Number
  },
  computed: {
    colorStyle() {
      switch (this.type) {
        case 0:
          return { backgroundColor: 'white' }
          break
        case 1:
          return { backgroundColor: 'black' }
          break
        case 10:
          return { backgroundColor: 'red' }
          break
        default:
          return { backgroundColor: 'white' }
      }
    },
    isPlayerBlock() {
      return [2, 3, 4, 5, 6, 7, 8, 9].includes(this.type)
    },
    rotatePlayerStyle() {
      switch (this.type) {
        case 2:
        case 6:
          return { transform: 'rotate(-90deg)' }
          break
        case 3:
        case 7:
          return { transform: 'rotate(0deg)' }
          break
        case 4:
        case 8:
          return { transform: 'rotate(90deg)' }
          break
        case 5:
        case 9:
          return { transform: 'rotate(180deg)' }
          break
        default:
          return {}
      }
    }
  }
}
</script>

<style scoped>
.map-block {
  position: absolute;
}
</style>
