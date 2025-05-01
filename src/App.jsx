import { useState, useEffect } from 'react'
import useLineConfigs from './hooks/LineConfigs'
import LineConfigDisplay from './components/LineConfigDisplay'
import Chart from './components/Chart'
import ButtonMain from './components/ButtonMain'
import { getRandomColor } from './utils'

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

  //On Component Mount
  useEffect(() => {
    addConfig()
  }, [])

  //Handlers - To be moved
  const handleTrialsChange = num => {
    setNumTrials(num)
  }

  return (
    <div>
      <Chart />
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <ButtonMain label='Add Configuration' handleClick={addConfig} />
          </div>
          <div>
            <ButtonMain
              label='Run Simulation'
              handleClick={() => console.log('runSim')}
            />
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
            <ButtonMain
              label='Toggle Y-Axis Lock (0-100%)'
              handleClick={() => setYAxisLocked(!yAxisLocked)}
            />
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
