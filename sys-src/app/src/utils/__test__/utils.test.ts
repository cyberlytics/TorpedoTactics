import { screen } from '@testing-library/dom'
import { it, describe, expect, beforeEach, vi } from 'vitest'

// store
import { useFieldStore } from '@/stores/field'

// utils
import { onField, savePositions, cleanUpStore } from '@/utils/utils' // replace this with your actual file path

vi.mock('@/stores/field') // Mock the entire module

describe('utils', () => {
  describe('onField function', () => {
    beforeEach(() => {
      document.body.innerHTML = `
      <div id="game-field" data-testid="game-field" style="position: absolute; top: 10px; left: 10px; width: 100px; height: 100px"></div>
    `
    })

    it('should return true if the point is within the game field', () => {
      // Create a div element
      const mockElement = document.createElement('div')

      // Define getBoundingClientRect
      mockElement.getBoundingClientRect = vi.fn().mockReturnValue({
        x: 10,
        y: 10,
        width: 100,
        height: 100,
        top: 10,
        right: 110,
        bottom: 110,
        left: 10
      })

      // Define offsetWidth
      Object.defineProperty(mockElement, 'offsetWidth', {
        get: () => 100
      })

      // Define offsetHeight
      Object.defineProperty(mockElement, 'offsetHeight', {
        get: () => 100
      })

      // Mock document.getElementById
      vi.spyOn(document, 'getElementById').mockReturnValue(mockElement)

      const gameField = document.getElementById('game-field')
      expect(gameField).not.toBeNull() // Check that game-field is present

      expect(onField(20, 20)).toBe(true)
      expect(onField(10, 10)).toBe(true)

      // this should be false, as it's outside the 100x100 field
      expect(onField(109, 109)).toBe(false)
    })

    it('should return false if the point is outside the game field', () => {
      expect(onField(0, 0)).toBe(false)
      expect(onField(120, 120)).toBe(false)
    })

    it('should return false if the game field is not present', () => {
      const gameField = screen.getByTestId('game-field')
      gameField?.parentNode?.removeChild(gameField)
      expect(onField(20, 20)).toBe(false)
    })
  })

  describe('savePositions', () => {
    it('should call setPos with correct arguments for horizontal orientation', () => {
      const setPos = vi.fn()

      // mock return value
      ;(useFieldStore as any).mockReturnValue({ setPos })

      // ship pos and orientation
      const x = 5,
        y = 7,
        size = 3

      // call setPos
      savePositions(x, y, size, 'h')

      expect(setPos).toHaveBeenCalledTimes(size)
      expect(setPos).toHaveBeenNthCalledWith(1, x, y)
      expect(setPos).toHaveBeenNthCalledWith(2, x + 1, y)
      expect(setPos).toHaveBeenNthCalledWith(3, x + 2, y)
    })

    it('should call setPos with correct arguments for vertical orientation', () => {
      const setPos = vi.fn()

      // mock return value
      ;(useFieldStore as any).mockReturnValue({ setPos })

      // ship pos and orientation
      const x = 5,
        y = 7,
        size = 3

      // call setPos
      savePositions(x, y, size, 'v')

      expect(setPos).toHaveBeenCalledTimes(size)
      expect(setPos).toHaveBeenNthCalledWith(1, x, y)
      expect(setPos).toHaveBeenNthCalledWith(2, x, y + 1)
      expect(setPos).toHaveBeenNthCalledWith(3, x, y + 2)
    })
  })

  describe('cleanUpStore', () => {
    it('should call removePos with correct arguments for horizontal orientation', () => {
      const removePos = vi.fn()
      ;(useFieldStore as any).mockReturnValue({ removePos })

      const x = 5,
        y = 7,
        size = 3
      cleanUpStore(x, y, size, 'h')

      expect(removePos).toHaveBeenCalledTimes(size)
      expect(removePos).toHaveBeenNthCalledWith(1, x, y)
      expect(removePos).toHaveBeenNthCalledWith(2, x + 1, y)
      expect(removePos).toHaveBeenNthCalledWith(3, x + 2, y)
    })

    it('should call removePos with correct arguments for vertical orientation', () => {
      const removePos = vi.fn()
      ;(useFieldStore as any).mockReturnValue({ removePos })

      const x = 5,
        y = 7,
        size = 3
      cleanUpStore(x, y, size, 'v')

      expect(removePos).toHaveBeenCalledTimes(size)
      expect(removePos).toHaveBeenNthCalledWith(1, x, y)
      expect(removePos).toHaveBeenNthCalledWith(2, x, y + 1)
      expect(removePos).toHaveBeenNthCalledWith(3, x, y + 2)
    })
  })
})
