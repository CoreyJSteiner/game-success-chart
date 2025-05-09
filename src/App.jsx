import { useState, useEffect, useRef } from 'react'
import useLineConfigs from './components/LineConfigs'
import useRunSim from './components/RunSim'
import LineConfigDisplay from './components/LineConfigDisplay'
import ChartDisplay from './components/ChartDisplay'
import ButtonMain from './components/ButtonMain'
import LoadingOverlay from './components/LoadingOverlay'
import useJsonExport from './components/JsonExport'
import JsonImportButton from './components/JsonImport'
import jsonAllConfigsDefault from '../exports/defaultConfigs.json'

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
  const runningSim = useRef(false)

  //Initial Load handles double invocations casued by strict mode in developemnt
  const initialLoadRef = useRef(true)

  useEffect(() => {
    const initialLoad = async () => {
      await runConfigs(jsonAllConfigsDefault.configs)
      initialLoadRef.current = false
    }

    if (initialLoadRef.current) {
      initialLoad()
    }
  }, [])

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
    if (runningSim.current) return
    runningSim.current = true
    replaceConfigs(configs)
    try {
      await runSimulation(setIsLoading, configs)
    } catch {
      console.log('Error running sim')
    } finally {
      setShowInputs(false)
      runningSim.current = false
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
              <button onClick={() => exportToJSON({ configs: lineConfigs })}>
                Export Config JSON
              </button>
              <button onClick={() => exportToJSON(currentData)}>
                Export Result JSON
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
            displayInputs={showInputs}
            toggleInputsDisplay={() => {
              setShowInputs(!showInputs)
            }}
          />
        </div>
      )}
    </div>
  )
}

export default App
