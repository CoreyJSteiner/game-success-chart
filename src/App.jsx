import { useState, useEffect } from 'react'
import useLineConfigs from './hooks/LineConfigs'
import LineConfigDisplay from './components/LineConfigDisplay'
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
  const [numTrials, setNumTrials] = useState(50000)

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
      <div className='loading-overlay' id='loadingOverlay'>
        <div className='spinner'></div>
      </div>

      <div style={{ maxWidth: '80%', marginLeft: 'auto', marginRight: 'auto' }}>
        <canvas id='chart'></canvas>
      </div>

      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <button
              className='add-config-btn'
              onClick={() => console.log('addConfiguration()')}
            >
              Add Configuration
            </button>
          </div>
          <div>
            <button onClick={() => console.log('runSim')}>
              Run Simulation
            </button>
          </div>
        </div>

        {lineConfigs.map(config => (
          <LineConfigDisplay
            key={config.id}
            lineConfig={config}
            onUpdate={updated => updateConfig(config.id, updated)}
            onRemove={() => removeConfig(config.id)}
            onDuplicate={() => duplicateConfig(config.id)}
          />
        ))}

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '1rem'
          }}
        >
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => console.log('toggleYAxis()')}>
              Toggle Y-Axis Lock (0-100%)
            </button>
            <button onClick={() => console.log('exportToCSV()')}>
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
            </button>
          </div>
          <input
            id='num-trials-input'
            onChange={handleTrialsChange}
            type='number'
            value={numTrials}
          />
        </div>
        <input
          id='csv-file-input'
          type='file'
          accept='.csv'
          style={{ display: 'none' }}
        />
        <input
          id='json-file-input'
          type='file'
          accept='.json'
          style={{ display: 'none' }}
        />
      </div>
    </div>
  )
}

export default App
