import { useState, useEffect, useRef } from 'react'
import useLineConfigs from './components/LineConfigs'
import useRunSim from './components/RunSim'
import LineConfigDisplay from './components/LineConfigDisplay'
import ChartDisplay from './components/ChartDisplay'
import ButtonMain from './components/ButtonMain'
import LoadingOverlay from './components/LoadingOverlay'
import useJsonExport from './components/JsonExport'
import JsonImportButton from './components/JsonImport'
import jsonAllConfigsDefault from '../exports/all_withGroups.json'

function App () {
  const {
    lineConfigs,
    addConfig,
    duplicateConfig,
    updateConfig,
    removeConfig,
    clearConfigs,
    replaceConfigs
  } = useLineConfigs()
  const { exportToJSON } = useJsonExport()
  const { currentData, numTrials, setNumTrials, runSimulation } = useRunSim()
  const [yAxisLocked] = useState(true)
  const [bgColor, setBgColor] = useState('#0a0a23')
  const [isLoading, setIsLoading] = useState(true)
  const [showInputs, setShowInputs] = useState(false)

  //Initial Load handles double invocations casued by strict mode in developemnt
  const initialLoadRef = useRef(true)

  useEffect(() => {
    // addConfig({ name: '1d12+1d4', d12: 1, d4: 1, lineColor: '#7DF9FF' })
    runConfigs(jsonAllConfigsDefault.configs)
  }, [])

  useEffect(() => {
    if (initialLoadRef.current && lineConfigs.length > 0) {
      runSimulation(setIsLoading, lineConfigs)
      initialLoadRef.current = false
    }
  }, [lineConfigs])

  const importJson = async jsonFile => {
    try {
      if (!jsonFile) return

      const text = await jsonFile.text()
      const configs = JSON.parse(text).configs

      runConfigs(configs)
    } catch (error) {
      alert('Invalid JSON file: ' + error.message)
    }
  }

  const runConfigs = async configs => {
    replaceConfigs(configs)
    try {
      runSimulation(setIsLoading, configs)
    } finally {
      setShowInputs(false)
    }
  }

  //Handlers - To be moved
  const handleTrialsChange = e => {
    setNumTrials(e.target.value)
  }

  const handleBackgroundColorChange = e => {
    const color = e.target.value
    setBgColor(color)
    document.body.style = `background: ${color};`
  }

  const handleRunSimClick = () => {
    setShowInputs(false)
    return runSimulation(setIsLoading, lineConfigs)
  }

  return (
    <div id='page-container' style={{ backgroundColor: { bgColor } }}>
      <LoadingOverlay loading={isLoading} />
      {showInputs && (
        <div id='input-container'>
          <div id='top-button-container'>
            <div>
              <ButtonMain label='Add Configuration' handleClick={addConfig} />
            </div>
            <div>
              <ButtonMain
                label='Run Simulation'
                handleClick={handleRunSimClick}
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

          <div id='settings-buttons-container'>
            <div id='config-control-container'>
              <button
                onClick={() => {
                  console.dir(currentData, { depth: null })
                  exportToJSON(currentData)
                }}
              >
                Export JSON
              </button>
              <JsonImportButton importJson={importJson} />
              <ButtonMain label='Clear Configs' handleClick={clearConfigs} />
            </div>
            <div>
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
      {!initialLoadRef.current && (
        <div id='main-container'>
          <ChartDisplay
            currentData={currentData}
            isLoading={false}
            yAxisLocked={yAxisLocked}
          />
          <button
            id='button-show-inputs'
            onClick={() => {
              setShowInputs(!showInputs)
            }}
          >
            Show Inputs
          </button>
        </div>
      )}
    </div>
  )
}

export default App
