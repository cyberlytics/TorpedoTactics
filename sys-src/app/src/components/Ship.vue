<template>
  <div
    ref="ship"
    :id="id"
    class="ship"
    @mousedown="dragStart"
    @mousemove="drag"
    @mouseup="dragEnd"
    @click="handleClick"
    :style="{ top: pos.y + 'px', left: pos.x + 'px', width: size * 30 + 1 + 'px', height: '30px' }"
    :class="`${orientation !== 'h' ? 'vertical' : ''}`"
  ></div>
</template>

<script lang="ts">
import {
  cleanUpElements,
  getElementBelowPosition,
  getPos,
  markElements,
  validatePos
} from '@/utils/utils'

export default {
  props: ['id', 'size'],
  data() {
    return {
      dragging: false,
      validatedPos: false,
      clicked: false,
      prevEle: [], // all marked elements
      orientation: 'h', // horizontal or vertical
      // current position
      pos: {
        x: 500,
        y: 0
      },
      // need to be updated when dragging
      startPos: {
        x: 0,
        y: 0
      },

      // need to reset position
      originPos: {
        x: 500,
        y: 108
      },

      // need to set pos when drag ends
      validPos: {
        x: 0,
        y: 0
      }
    }
  },
  mounted() {
    // set position state on mount
    this.pos = getPos(this.$refs['ship'] as HTMLDivElement)
  },
  methods: {
    handleClick() {
      // this function handles the click event so that the ship can be dragged or rotated not both
      if (!this.dragging && !this.clicked) {
        this.orientation = this.orientation === 'h' ? 'v' : 'h'
      }

      // clean up marked elements
      cleanUpElements(this.prevEle)

      // reset flag
      this.clicked = false
    },
    dragStart(e: any) {
      // adjust start position
      this.startPos.x = this.pos.x - e.clientX
      this.startPos.y = this.pos.y - e.clientY

      // set flags
      this.dragging = true
      this.clicked = false
    },
    drag(e: any) {
      // stop if dragging is false
      if (!this.dragging) return

      // check position on drag
      this.checkPos(e.pageX, e.pageY)
      this.pos.x = e.clientX + this.startPos.x
      this.pos.y = e.clientY + this.startPos.y

      // set click flag
      this.clicked = true
    },
    dragEnd() {
      // set dragging flag
      this.dragging = false

      // set position of ship
      this.pos = this.validatedPos ? { ...this.validPos } : { ...this.originPos }
    },
    markElements(x: number, y: number) {
      // clean up previous elements
      cleanUpElements(this.prevEle)

      // get new elements
      this.prevEle = markElements(x, y, this.size, this.orientation)

      // mark elements
      this.prevEle.forEach((ele) => {
        if (ele) {
          ele.style.backgroundColor = this.validatedPos ? 'green' : 'red'
        }
      })
    },
    checkPos(x: number, y: number) {
      const ele = getElementBelowPosition(x, y)

      // check if position is in valid area
      if (
        ele &&
        ele.getAttribute('data-x') &&
        ele.getAttribute('data-y') &&
        validatePos(
          Number(ele.getAttribute('data-x')),
          Number(ele.getAttribute('data-y')),
          this.size,
          this.orientation
        )
      ) {
        // set position as valid
        this.validatedPos = true

        // calculate valid position
        const { top, left } = ele.getBoundingClientRect()
        const topMargin = 45
        const navHeight = 65
        this.validPos = { x: left + 2, y: top - topMargin - navHeight + 2 }

        // mark elements in valid position
        this.markElements(Number(ele.getAttribute('data-x')), Number(ele.getAttribute('data-y')))
      } else {
        // clean up elements
        cleanUpElements(this.prevEle)

        // set position as invalid
        this.validatedPos = false
      }
    }
  }
}
</script>

<style>
.ship {
  width: 2em;
  height: 2em;
  padding-right: 0;
  padding-bottom: 0;
  cursor: move !important;
  z-index: 10;
  left: 0;
  top: 0;
  background: white;
  position: absolute !important;
  margin: -2px;
}

.vertical {
  transform-origin: 15px 15px;
  transform: rotate(90deg);
}
</style>
