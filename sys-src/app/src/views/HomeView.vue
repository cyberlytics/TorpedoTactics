<script lang="ts">
import Game from '../components/Game-Field.vue'
import Ship from '../components/Ship.vue'

export default {
  components: { Game, Ship }
}
</script>

<template>
  <Ship id="ship-1" draggable="true" />
  <Game />
</template>
