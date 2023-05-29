<script lang="ts">
import Game from '../components/Game-Field.vue'
import Ship from '../components/Ship.vue'

export default {
  components: { Game, Ship },
  data() {
    return {
      ships: [
        { id: 'ship-1', size: 5, x: 0, y: 0 },
        { id: 'ship-2', size: 4, x: 0, y: 0 },
        { id: 'ship-3', size: 4, x: 0, y: 0 },
        { id: 'ship-4', size: 3, x: 0, y: 0 },
        { id: 'ship-5', size: 3, x: 0, y: 0 },
        { id: 'ship-6', size: 3, x: 0, y: 0 },
        { id: 'ship-7', size: 2, x: 0, y: 0 },
        { id: 'ship-8', size: 2, x: 0, y: 0 },
        { id: 'ship-9', size: 2, x: 0, y: 0 },
        { id: 'ship-10', size: 2, x: 0, y: 0 }
      ]
    }
  },
  mounted() {
    this.$nextTick(() => {
      let bottomMargin = 30 // Bottom margin
      let gameFieldWidth = document.getElementById('game-field')?.clientWidth + 100

      // Position ships beside game field
      let currentTop = 50
      this.ships = this.ships.map((ship) => {
        let x = gameFieldWidth
        let y = currentTop

        currentTop += ship.size + bottomMargin // Add bottom margin

        return { ...ship, x, y }
      })
    })
  }
}
</script>

<template>
  <Game />
  <Ship
    v-for="ship in ships"
    :key="ship.id"
    :id="ship.id"
    :size="ship.size"
    :x="ship.x"
    :y="ship.y"
  />
</template>
