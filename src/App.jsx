import { useState, useEffect } from 'react'
import DieConfig from './components/DieConfig'
import { getRandomColor } from './utils'

function App () {
  const [lineConfigs, setLineConfigs] = useState([])
  const [yAxisLocked, setYAxisLocked] = useState(true)
  const [numTrials, setNumTrials] = useState(50000)

  //On Component Mount
  useEffect(() => {
    addConfiguration()
  }, [])

  const addConfiguration = (
    config = {
      name: '',
      lineColor: getRandomColor(),
      lineStyle: 'solid',
      d4: 0,
      d10: 1,
      d12: 0
    }
  ) => {
    setLineConfigs([...lineConfigs, { ...config, id: Date.now() }])
  }

  const updateConfig = (id, updated) => {
    setLineConfigs(
      lineConfigs.map(config =>
        config.id === id ? { ...config, ...updated } : config
      )
    )
  }

  const removeConfig = id => {
    setLineConfigs(lineConfigs.filter(config => config.id !== id))
  }

  const duplicateConfig = id => {
    const config = getConfigById(id)
    console.dir(config)
    if (config) addConfiguration(config)
  }

  const getConfigById = id => {
    let config = null
    lineConfigs.forEach(c => {
      console.log(`${id}===${c.id}`)
      if (c.id === id) {
        config = c
      }
    })

    return config
  }

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
