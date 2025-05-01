import { useState, useEffect } from 'react'
import useLineConfigs from './hooks/LineConfigs'
import LineConfigDisplay from './components/LineConfigDisplay'
import ChartDisplay from './components/ChartDisplay'
import ButtonMain from './components/ButtonMain'
import { getRandomColor, rollDie } from './utils'

function App () {
  const {
    lineConfigs,
    addConfig,
    duplicateConfig,
    updateConfig,
    removeConfig
  } = useLineConfigs()
  const [yAxisLocked, setYAxisLocked] = useState(true)
  const [numTrials, setNumTrials] = useState(100)
  const [currentData, setCurrentData] = useState({})

  //On Component Mount
  useEffect(() => {
    addConfig()
  }, [])

  //Handlers - To be moved
  const handleTrialsChange = num => {
    setNumTrials(num)
  }

  //Run Sim Functions
  const runSimulation = async () => {
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

      const allKeys = [...new Set(results.flatMap(r => Object.keys(r.data)))]
        .map(Number)
        .sort((a, b) => a - b)

      const datasets = results.map((config, index) => ({
        label: config.name,
        data: allKeys.map(k => config.data[k] || 0),
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

      const processedResults = results.map(r => r.data)

      setCurrentData({
        configs,
        labels: allKeys,
        datasets: datasets
      })
    } finally {
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
      const chunkSize = 1000 // Process in chunks to keep UI responsive

      function processChunk () {
        for (let i = 0; i < chunkSize && completed < trials; i++, completed++) {
          const totalSuccesses = runTrial(config)

          results[totalSuccesses] = (results[totalSuccesses] || 0) + 1
        }

        if (completed < trials) {
          setTimeout(processChunk, 0)
        } else {
          const output = {}
          Object.keys(results).forEach(k => {
            output[k] = results[k] / trials
          })
          resolve(output)
        }
      }

      processChunk()
    })
  }

  return (
    <div>
      <ChartDisplay
        currentData={currentData}
        isLoading={false}
        yAxisLocked={yAxisLocked}
      />
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <ButtonMain label='Add Configuration' handleClick={addConfig} />
          </div>
          <div>
            <ButtonMain label='Run Simulation' handleClick={runSimulation} />
          </div>
        </div>

        <div id='configurations-container'>
          {lineConfigs.map(config => (
            <LineConfigDisplay
              key={config.id}
              lineConfig={config}
              onUpdate={updated => updateConfig(config.id, updated)}
              onRemove={() => removeConfig(config.id)}
              onDuplicate={() => duplicateConfig(config.id)}
            />
          ))}
        </div>

        <div
          id='settings-buttons-container'
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '1rem'
          }}
        >
          <div style={{ display: 'flex', gap: '10px' }}>
            {/* <ButtonMain
              label='Toggle Y-Axis Lock (0-100%)'
              handleClick={() => setYAxisLocked(!yAxisLocked)}
            /> */}
            {/* <button onClick={() => console.log('exportToCSV()')}>
              Export to CSV
            </button>
            <button onClick={() => console.log('importFromCSV()')}>
              Import from CSV
            </button>
            <button onClick={() => console.log('exportToJSON()')}>
              Export JSON
            </button>
            <button onClick={() => console.log('importFromJSON()')}>
              Import JSON
            </button> */}
          </div>
          <input
            id='num-trials-input'
            onChange={handleTrialsChange}
            type='number'
            value={numTrials}
          />
        </div>
      </div>
    </div>
  )
}

export default App
