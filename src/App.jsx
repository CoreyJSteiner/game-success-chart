import { useState, useEffect, useRef } from 'react'
import useLineConfigs from './hooks/LineConfigs'
import useRunSim from './hooks/RunSim'
import LineConfigDisplay from './components/LineConfigDisplay'
import ChartDisplay from './components/ChartDisplay'
import ButtonMain from './components/ButtonMain'
import { getRandomColor, rollDie } from './utils'
import LoadingOverlay from './components/LoadingOverlay'

function App () {
  const {
    lineConfigs,
    addConfig,
    duplicateConfig,
    updateConfig,
    removeConfig
  } = useLineConfigs()
  const { currentData, numTrials, setNumTrials, runSimulation } = useRunSim()
  const [yAxisLocked, setYAxisLocked] = useState(true)
  const [bgColor, setBgColor] = useState('#0a0a23')
  const [isLoading, setIsLoading] = useState(true)

  //Initial Load
  const initialLoadRef = useRef(true)

  useEffect(() => {
    addConfig({ name: '1d12+1d4', d12: 1, d4: 1, lineColor: '#7DF9FF' })
  }, [])

  useEffect(() => {
    if (initialLoadRef.current && lineConfigs.length > 0) {
      runSimulation(setIsLoading, lineConfigs)
      initialLoadRef.current = false
      setNumTrials(50000)
    }
  }, [lineConfigs])

  //Handlers - To be moved
  const handleTrialsChange = e => {
    setNumTrials(e.target.value)
  }

  const handleBackgroundColorChange = e => {
    const color = e.target.value
    setBgColor(color)
    document.body.style = `background: ${color};`
  }

  return (
    <div style={{ backgroundColor: { bgColor } }}>
      <LoadingOverlay loading={isLoading} />
      {!initialLoadRef.current && (
        <div>
          {' '}
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
                <ButtonMain
                  label='Run Simulation'
                  handleClick={() => runSimulation(setIsLoading, lineConfigs)}
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
                justifyContent: 'right',
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
              <input
                id='bg-color-pick-input'
                type='color'
                className='color-picker'
                onChange={handleBackgroundColorChange}
                value={bgColor}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
