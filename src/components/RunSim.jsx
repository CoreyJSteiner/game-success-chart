import { useState } from 'react'
import { rollDie } from '../utils'

const useRunSim = () => {
  const [currentData, setCurrentData] = useState({})
  const [numTrials, setNumTrials] = useState(10)

  const runSimulation = async (loadingFunction, lineConfigs) => {
    loadingFunction(true)
    try {
      const configs = lineConfigs
      if (configs.length === 0) return alert('Add at least one configuration!')

      // Run simulations in parallel with progress
      const results = await Promise.all(
        configs.map(async config => ({
          ...config,
          data: await simulateConfiguration(config)
        }))
      )

      const allKeys = [
        ...new Set(results.flatMap(result => Object.keys(result.data)))
      ]
        .map(Number)
        .sort((a, b) => a - b)

      const datasets = results.map((config, index) => ({
        label: config.name,
        data: allKeys.map(key => config.data[key] || 0),
        borderColor: config.lineColor,
        borderDash: getBorderDash(config.lineStyle),
        tension: 0.1
      }))

      function getBorderDash (style) {
        switch (style) {
          case 'dashed':
            return [10, 5]
          case 'dotted':
            return [3, 3]
          case 'dashDot':
            return [10, 5, 3, 5]
          default:
            return []
        }
      }

      setCurrentData({
        configs,
        labels: allKeys,
        datasets: datasets
      })
    } finally {
      loadingFunction(false)
    }
  }

  const runTrial = config => {
    let dice = []
    dice.push(
      ...Array(config.d4)
        .fill()
        .map(() => ({ value: rollDie(4) }))
    )
    dice.push(
      ...Array(config.d10)
        .fill()
        .map(() => ({ value: rollDie(10) }))
    )
    dice.push(
      ...Array(config.d12)
        .fill()
        .map(() => ({ value: rollDie(12) }))
    )

    let initialSuccesses = dice.filter(
      d => d.value === 10 || d.value >= 10
    ).length

    const remainingValues = dice
      .filter(d => d.value < 10 || (d.value === 10 && d.type === 'd12'))
      .map(d => d.value)

    let summedSuccesses = 0
    const sortedValues = [...remainingValues].sort((a, b) => b - a)

    while (sortedValues.length > 0) {
      const current = sortedValues.shift()
      let target = 10 - current
      let found = false

      if (target < 0) continue
      if (target === 0) {
        summedSuccesses++
        continue
      }

      let sum = 0
      const usedIndices = []
      for (let i = 0; i < sortedValues.length; i++) {
        if (sum + sortedValues[i] <= target) {
          sum += sortedValues[i]
          usedIndices.push(i)
          if (sum === target) {
            found = true
            break
          }
        }
      }

      if (found) {
        summedSuccesses++
        usedIndices.reverse().forEach(i => sortedValues.splice(i, 1))
      }
    }

    return initialSuccesses + summedSuccesses
  }

  const simulateConfiguration = config => {
    return new Promise(resolve => {
      const results = {}
      const trials = numTrials
      let completed = 0
      const batchSize = 1000

      function processBatch () {
        for (let i = 0; i < batchSize && completed < trials; i++, completed++) {
          const totalSuccesses = runTrial(config)

          results[totalSuccesses] = (results[totalSuccesses] || 0) + 1
        }

        if (completed < trials) {
          setTimeout(processBatch, 0)
        } else {
          const output = {}
          Object.keys(results).forEach(key => {
            output[key] = results[key] / trials
          })
          resolve(output)
        }
      }

      processBatch()
    })
  }

  return {
    currentData,
    setCurrentData,
    numTrials,
    setNumTrials,
    runSimulation,
    runTrial,
    simulateConfiguration
  }
}

export default useRunSim
