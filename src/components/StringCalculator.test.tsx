import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import StringCalculator from './StringCalculator'
import { describe, it, expect } from 'vitest'
import '@testing-library/jest-dom'

describe('StringCalculator', () => {
  const setup = () => {
    render(<StringCalculator />)
    const input = screen.getByLabelText('Number input')
    const calculateButton = screen.getByText('Calculate')
    const getResult = () => screen.getByText(/Result:/).textContent?.split(': ')[1]
    return { input, calculateButton, getResult }
  }

  describe('Rendering', () => {
    it('renders input field and calculate button', () => {
      const { input, calculateButton } = setup()
      expect(input).toBeTruthy()
      expect(calculateButton).toBeTruthy()
    })

    it('displays initial result as 0', () => {
      const { getResult } = setup()
      expect(getResult()).toBe('0')
    })
  })

  describe('Input handling', () => {
    it('updates input value when typing', () => {
      const { input } = setup()
      fireEvent.change(input, { target: { value: '1,2,3' } })
      expect(input).toHaveAttribute('value', '1,2,3')
    })
  })

  describe('Calculation', () => {
    it('returns 0 for an empty string', () => {
      const { calculateButton, getResult } = setup()
      fireEvent.click(calculateButton)
      expect(getResult()).toBe('0')
    })

    it('returns the number for a single number', () => {
      const { input, calculateButton, getResult } = setup()
      fireEvent.change(input, { target: { value: '1' } })
      fireEvent.click(calculateButton)
      expect(getResult()).toBe('1')
    })

    it('returns the sum of two numbers', () => {
      const { input, calculateButton, getResult } = setup()
      fireEvent.change(input, { target: { value: '1,5' } })
      fireEvent.click(calculateButton)
      expect(getResult()).toBe('6')
    })

    it('handles any amount of numbers', () => {
      const { input, calculateButton, getResult } = setup()
      fireEvent.change(input, { target: { value: '1,2,3,4,5' } })
      fireEvent.click(calculateButton)
      expect(getResult()).toBe('15')
    })

    // it('handles new lines between numbers', () => {
    //   const { input, calculateButton, getResult } = setup()
    //   fireEvent.change(input, { target: { value: '1\n2,3' } })
    //   fireEvent.click(calculateButton)
    //   expect(getResult()).toBe('6')
    // })

    it('supports different delimiters', () => {
      const { input, calculateButton, getResult } = setup()
      fireEvent.change(input, { target: { value:'1;2' } })
      fireEvent.click(calculateButton)
      expect(getResult()).toBe('3')
    })

    it('throws an exception for negative numbers', () => {
      const { input, calculateButton, getResult } = setup()
      fireEvent.change(input, { target: { value: '-1,2' } })
      fireEvent.click(calculateButton)
      expect(getResult()).toBe('Negative numbers not allowed')
    })

    it('throws an exception with all negative numbers in the message', () => {
      const { input, calculateButton, getResult } = setup()
      fireEvent.change(input, { target: { value: '2,-4,3,-5' } })
      fireEvent.click(calculateButton)
      expect(getResult()).toBe('Negative numbers not allowed')
    })

    it('ignores numbers bigger than 1000', () => {
      const { input, calculateButton, getResult } = setup()
      fireEvent.change(input, { target: { value: '2,1001,6' } })
      fireEvent.click(calculateButton)
      expect(getResult()).toBe('8')
    })

  })

  describe('Error handling', () => {
    it('displays error message for unknown errors', () => {
      const { input, calculateButton, getResult } = setup()
      fireEvent.change(input, { target: { value: 'invalid' } })
      fireEvent.click(calculateButton)
      expect(getResult()).toBe('An unknown error occurred')
    })
  })
})

