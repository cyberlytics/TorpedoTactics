<template>
  <div
    :id="id"
    class="ship"
    @drag="drag"
    @dragstart="dragStart"
    @dragover.stop
    @mousedown="dragStart"
    @mousemove="drag"
    :style="{ top: y + 'px', left: x + 'px' }"
  ></div>
</template>

<script lang="ts">
export default {
  props: ['id', 'draggable'],
  data() {
    return {
      isDragging: false,
      x: 0,
      y: 0,
      startX: 0,
      startY: 0
    }
  },
  mounted() {
    window.addEventListener('mouseup', (e) => {
      console.log(e)
      this.isDragging = false
    })
  },
  methods: {
    dragStart(e: any) {
      this.startX = this.x - e.clientX
      this.startY = this.y - e.clientY
      this.isDragging = true
      // const target = e.target

      // e.dataTransfer.setData('ship_id', target.id)

      // delay to make element draggable
      // setTimeout(() => {
      //   target.style.display = 'none' // hiddes drag component
      // }, 0)
    },
    drag(e: any) {
      if (!this.isDragging) return
      this.x = e.clientX + this.startX
      this.y = e.clientY + this.startY
    }
  }
}
</script>

<style>
.ship {
  width: 2em;
  height: 2em;
  padding-right: 0px;
  padding-bottom: 0px;
  cursor: move !important;
  z-index: 10;
  left: 0;
  top: 0;
  background: white;
  position: absolute !important;
  margin: -2px;
}
</style>
