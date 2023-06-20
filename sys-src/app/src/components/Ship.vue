<template>
  <div
    ref="ship"
    :id="id"
    class="ship"
    @mousedown="dragStart"
    @click="handleClick"
    :style="{ top: pos.y + 'px', left: pos.x + 'px', width: size * shipBlockSize + 'px', height: `${shipBlockSize}px`,
      '--rotation-translate': `-${getRotatedTranslateValues()}px ${getRotatedTranslateValues()}px` }"
    :class="`${orientationHorizontal ? '' : 'vertical'}`"
  ></div>
</template>

<script lang="ts">
import {
  cleanUpElements,
  getElementBelowPosition,
  getPos,
  markElements,
  validatePos,
  savePositions,
  cleanUpStore,
  onField
} from '@/utils/utils'

export default {
  props: ['id', 'size', 'x', 'y'],
  data() {
    return {
      shipBlockSize: 31,
      dragging: false,
      validatedPos: false,
      clicked: false,
      prevEle: [], // all marked elements
      orientationHorizontal: true, // horizontal or vertical
      placedOnField: false,
      invalidRotateInterval: 0,
      // current position
      pos: {
        x: this.x || 0,
        y: this.y || 0
      },
      // need to be updated when dragging
      draggingPos: {
        x: this.x || 0,
        y: this.y || 0
      },

      // needed for invalid dropoffs -> reset
      originPos: {
        x: this.x || 0,
        y: this.y || 0
      },

      // need to set pos when drag ends
      validPos: {
        x: 0,
        y: 0,
        dataX: null as number,
        dataY: null as number
      }
    }
  },
  watch: {
    x(newX) {
      this.updatePosition(newX, this.y)
    },
    y(newY) {
      this.updatePosition(this.x, newY)
    }
  },
  mounted() {
    // set position state on mount
    this.pos = getPos(this.$refs['ship'] as HTMLDivElement)
  },
  methods: {
    getRotatedTranslateValues() {
      return this.shipBlockSize * (this.size / 2 - 0.5);
    },
    updatePosition(x, y) {
      this.pos = { x, y }
      this.draggingPos = { x, y }
    },
    handleClick(e: any) {
      // this function handles the click event so that the ship can be dragged or rotated not both
      if (!this.dragging
        && !this.clicked
        && this.placedOnField) { // don't try to rotate ship if not on field
        // on drag clean up store
        if (this.validPos.dataX !== null && this.validPos.dataY !== null) {
          cleanUpStore(this.validPos.dataX, this.validPos.dataY, this.size, this.orientationHorizontal)
        }

        // change orientation
        const newOrientation = !this.orientationHorizontal;
        
        // validate position
        if (validatePos(this.validPos.dataX, this.validPos.dataY, this.size, newOrientation)) {
          // adjust orientation
          this.orientationHorizontal = newOrientation

          // calculate new position and update it
          this.dragging = true
          this.drag(e)
          this.dragEnd()
          this.dragging = false
        } else {
          // invalidate position
          this.validatedPos = false
          this.pos = { ...this.originPos }
          this.draggingPos = { ...this.originPos }


          // get ship html element
          let shipElement = document.getElementById(this.id);
          if (shipElement == null) {
            return;
          }

          // show animation on invalid rotation
          window.clearTimeout(this.invalidRotateInterval); // clear previous timeout if clicked within the delay
          shipElement.classList.add(this.orientationHorizontal ? "invalid-rotate-horizontal" : "invalid-rotate-vertical")
          this.invalidRotateInterval = window.setTimeout(() => {
            // remove class afterwards
            shipElement?.classList.remove("invalid-rotate-horizontal");
            shipElement?.classList.remove("invalid-rotate-vertical");
          }, 700);
        }
      }

      // clean up marked elements
      cleanUpElements(this.prevEle)

      // reset flag
      this.clicked = false
    },
    dragStart(e: any) {
      // save originPos position for reset
      this.originPos.x = this.pos.x
      this.originPos.y = this.pos.y

      // adjust start position
      this.draggingPos.x = this.pos.x - e.clientX
      this.draggingPos.y = this.pos.y - e.clientY

      // set flags
      this.dragging = true
      this.clicked = false

      // add global listeners
      window.addEventListener('mousemove', this.drag)
      window.addEventListener('mouseup', this.dragEnd)

      // on drag clean up store
      if (this.validPos.dataX !== null && this.validPos.dataY !== null) {
        cleanUpStore(this.validPos.dataX, this.validPos.dataY, this.size, this.orientationHorizontal)
      }
    },
    drag(e: any) {
      // stop if dragging is false
      if (!this.dragging) return

      // get coordinates of ship
      let shipElement = document.getElementById(this.id)?.getBoundingClientRect();
      if (shipElement == null) {
        return;
      }
      // add half shipblock size to make grid snapping better
      let shipLeft = shipElement.left + this.shipBlockSize / 2;
      let shipTop = shipElement.top + this.shipBlockSize / 2;

      this.checkPos(shipLeft, shipTop)
      this.pos.x = e.clientX + this.draggingPos.x
      this.pos.y = e.clientY + this.draggingPos.y

      // set click flag
      this.clicked = true
    },
    dragEnd() {
      // set dragging flag
      this.dragging = false

      // set position of ship
      this.pos = this.validatedPos ? { ...this.validPos } : { ...this.originPos }

      // save positions into store
      if (this.validatedPos) {
        savePositions(this.validPos.dataX, this.validPos.dataY, this.size, this.orientationHorizontal)
        this.placedOnField = true;
      }

      // remove global listeners
      window.removeEventListener('mousemove', this.drag)
      window.removeEventListener('mouseup', this.dragEnd)
    },
    markElements(x: number, y: number) {
      // clean up previous elements
      cleanUpElements(this.prevEle)

      // get new elements
      this.prevEle = markElements(x, y, this.size, this.orientationHorizontal)

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
          this.orientationHorizontal
        )
      ) {
        // set position as valid
        this.validatedPos = true

        // calculate valid position
        const { top, left } = ele.getBoundingClientRect()
        const navHeight = 65
        this.validPos = {
          x: this.orientationHorizontal ? left + 1.5 : left + 2.5,
          y: top - navHeight + 1.5,
          dataX: Number(ele.getAttribute('data-x')),
          dataY: Number(ele.getAttribute('data-y'))
        }
      } else {
        // clean up elements
        cleanUpElements(this.prevEle)

        // set position as invalid
        this.validatedPos = false
      }

      if (ele && onField(x, y)) {
        // mark cells
        this.markElements(Number(ele.getAttribute('data-x')), Number(ele.getAttribute('data-y')))
      }
    }
  }
}
</script>

<style>
.ship {
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
  translate: var(--rotation-translate);
  transform: rotate(90deg);
}

.invalid-rotate-horizontal {
  animation: wiggleAnimationHorizontal 0.5s;
}
@keyframes wiggleAnimationHorizontal {
  0% { transform: rotate(0deg); background: lightcoral; }
  20% { transform: rotate(-3deg); }
  40% { transform: rotate(3deg); }
  60% { transform: rotate(-3deg); }
  80% { transform: rotate(3deg); }
  100% { transform: rotate(0deg); background: lightcoral; }
}

.invalid-rotate-vertical {
  animation: wiggleAnimationVertical 0.5s;
}
@keyframes wiggleAnimationVertical {
  0% { transform: rotate(90deg); background: lightcoral; }
  20% { transform: rotate(87deg); }
  40% { transform: rotate(93deg); }
  60% { transform: rotate(87deg); }
  80% { transform: rotate(93deg); }
  100% { transform: rotate(90deg); background: lightcoral; }
}
</style>
