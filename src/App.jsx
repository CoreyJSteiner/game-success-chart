import { useState, useEffect } from 'react'
import useLineConfigs from './components/LineConfigs'
import DieConfig from './components/DieConfig'
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

  return (
    <div>
      {lineConfigs.map(config => (
        <DieConfig
          key={config.id}
          lineConfig={config}
          onUpdate={updated => updateConfig(config.id, updated)}
          onRemove={() => removeConfig(config.id)}
          onDuplicate={() => duplicateConfig(config.id)}
        />
      ))}
    </div>
  )
}

export default App
