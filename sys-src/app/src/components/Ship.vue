<template>
  <div
    ref="ship"
    :id="id"
    class="ship"
    @mousedown="dragStart"
    @mousemove="drag"
    :style="{ top: pos.y + 'px', left: pos.x + 'px' }"
    :class="{ dragging: dragStopped }"
  ></div>
</template>

<script lang="ts">
export default {
  props: ['id'],
  data() {
    return {
      isDragging: false,
      dragStopped: false,
      posValid: false,
      pos: {
        x: 0,
        y: 0
      },
      startPos: {
        x: 0,
        y: 0
      },
      relPos: {
        x: 0,
        y: 0
      }
    }
  },
  mounted() {
    // get ship pos
    this.pos = this.getPos()

    // mouse up event handler
    window.addEventListener('mouseup', (e) => {
      this.isDragging = false

      // reset if pos is not valid
      if (!this.posValid) {
        this.pos = { x: -2, y: 108 }
      }
    })
  },

  methods: {
    getPos() {
      const left = (this.$refs['ship'] as HTMLDivElement).getBoundingClientRect().left
      const top = (this.$refs['ship'] as HTMLDivElement).getBoundingClientRect().top

      return {
        x: left,
        y: top
      }
    },

    dragStart(e: any) {
      this.startPos.x = this.pos.x - e.clientX
      this.startPos.y = this.pos.y - e.clientY
      this.isDragging = true
    },
    drag(e: any) {
      if (!this.isDragging) return
      this.checkPos(e.pageX, e.pageY)
      if (this.posValid) {
      } else {
        this.pos.x = e.clientX + this.startPos.x
        this.pos.y = e.clientY + this.startPos.y
        const elBelow = this.getElementBelowPosition(e.pageX, e.pageY)
        console.log(elBelow) // Log or do something with the element below
      }
    },
    checkPos(x: number, y: number) {},
    getElementBelowPosition(x: number, y: number) {
      const topElement: any = document.elementFromPoint(x, y)
      topElement.style.visibility = 'hidden' // Hide the top element
      const belowElement = document.elementFromPoint(x, y) // Get the element below
      topElement.style.visibility = '' // Show the top element again
      return belowElement
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
