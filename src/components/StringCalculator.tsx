import React, { useState } from 'react'

const StringCalculator: React.FC = () => {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<number | string>(0)

  const add = (numbers: string): number => {
    // eslint-disable-next-line no-debugger
    debugger;
    if (numbers === '') return 0
  
    let delimiter = /[,;]/
    let numberString = numbers

    if (numbers.startsWith('//')) {
      const delimiterEnd = numbers.indexOf('\n')
      let customDelimiter = numbers.substring(2, delimiterEnd)
      
      if (customDelimiter.startsWith('[') && customDelimiter.endsWith(']')) {
        customDelimiter = customDelimiter.slice(1, -1)
        const delimiters = customDelimiter.split('][')
        delimiter = new RegExp(delimiters.map(d => d.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')).join('|'))
      } else {
        delimiter = new RegExp(customDelimiter.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'))
      }
      
      numberString = numbers.substring(delimiterEnd + 1)
    }

    const nums = numberString.split(delimiter)
      .filter(s => s.trim() !== '')
      .map(n => {
        const num = parseInt(n.trim(), 10)
        if (isNaN(num)) throw new Error('Invalid input')
        return num
      })

    const negatives = nums.filter(n => n < 0)
    if (negatives.length > 0) {
      throw new Error(`Negative numbers not allowed`)
    }

    return nums.filter(num => num <= 1000).reduce((sum, num) => sum + num, 0)
  }

  const handleCalculate = () => {
    try {
      const calculatedResult = add(input)
      setResult(calculatedResult.toString())
    } catch (error) {
      if (error instanceof Error && error.message === 'Invalid input') {
        setResult('An unknown error occurred')
      } else if (error instanceof Error) {
        setResult(error.message)
      } else {
        setResult('An unknown error occurred')
      }
    }
  }

  return (
    <div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter numbers separated by commas"
        aria-label="Number input"
      />
      <button onClick={handleCalculate}>Calculate</button>
      <p>Result: {result}</p>
    </div>
  )
}

export default StringCalculator
