<template>
  <div
    ref="ship"
    :id="id"
    class="ship"
    @mousedown="dragStart"
    @mousemove="drag"
    @mouseup="dragEnd"
    @click="handleClick"
    :style="{ top: pos.y + 'px', left: pos.x + 'px', width: size * 30 + 1 + 'px' }"
    :class="`${orientation !== 'h' ? 'vertical' : ''}`"
  ></div>
</template>

<script lang="ts">
export default {
  props: ['id', 'size'],
  data() {
    return {
      isDragging: false,
      posValid: false,
      isClickHandled: false,
      prevEle: [],
      orientation: 'h',
      pos: {
        x: 500,
        y: 0
      },
      startPos: {
        x: 0,
        y: 0
      },
      originPos: {
        x: 500,
        y: 108
      },
      validPos: {
        x: 0,
        y: 0
      }
    }
  },
  mounted() {
    // get ship pos
    this.pos = this.getPos()
  },

  methods: {
    handleClick() {
      if (!this.isDragging && !this.isClickHandled) {
        if (this.orientation === 'h') {
          this.orientation = 'v'
        } else {
          this.orientation = 'h'
        }
      }
      this.isClickHandled = false
    },
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
      this.isClickHandled = false
    },
    drag(e: any) {
      if (!this.isDragging) return
      this.checkPos(e.pageX, e.pageY)

      this.pos.x = e.clientX + this.startPos.x
      this.pos.y = e.clientY + this.startPos.y

      this.isClickHandled = true
    },
    dragEnd() {
      this.isDragging = false

      // reset if pos is not valid
      if (!this.posValid) {
        this.pos = { ...this.originPos }
      } else {
        this.pos = { ...this.validPos }
      }
    },
    markElements(x: number, y: number) {
      this.cleanUpElements() //clean up elements before assigning new ones

      const eles = []
      if (this.orientation === 'h') {
        for (let i = 0; i < this.size; i++) {
          eles.push(document.querySelector(`[data-x="${x + i}"][data-y="${y}"]`))
        }
      } else {
        for (let i = 0; i < this.size; i++) {
          eles.push(document.querySelector(`[data-y="${y + i}"][data-x="${x}"]`))
        }
      }

      eles.forEach((ele) => {
        if (ele) {
          ele.style.backgroundColor = 'green'
          this.prevEle.push(ele) //add elements to prevEle
        }
      })
    },
    cleanUpElements() {
      this.prevEle.forEach((ele) => {
        if (ele) {
          ele.style.backgroundColor = '' //reset color
        }
      })
      this.prevEle = [] //empty the array
    },
    validatePos(x: number, y: number) {
      if (this.orientation === 'h' && x + this.size - 1 > 10) {
        return false
      }
      return !(this.orientation === 'v' && y + this.size - 1 > 10)
    },
    checkPos(x: number, y: number) {
      const ele = this.getElementBelowPosition(x, y) as HTMLElement

      if (
        ele &&
        ele.getAttribute('data-x') &&
        ele.getAttribute('data-y') &&
        this.validatePos(Number(ele.getAttribute('data-x')), Number(ele.getAttribute('data-y')))
      ) {
        this.posValid = true
        const { top, left } = ele.getBoundingClientRect()

        // margin of game field
        const topMargin = 45

        // navigation height
        const navHeight = 65

        // adjusted valid position
        this.validPos = { x: left + 2, y: top - topMargin - navHeight + 2 }

        // style element
        this.markElements(Number(ele.getAttribute('data-x')), Number(ele.getAttribute('data-y')))
      } else {
        this.cleanUpElements()
        this.posValid = false
      }
    },
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
