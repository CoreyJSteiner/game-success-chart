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

  const addConfiguration = () => {
    const newConfig = {
      id: Date.now(),
      name: '',
      color: getRandomColor(),
      lineStyle: 'solid',
      d4: 0,
      d10: 1,
      d12: 0
    }
    setLineConfigs([...lineConfigs, newConfig])
  }

  const updateConfig = (id, updated) => {
    console.log(id)
    console.log(updated)
    setLineConfigs(
      lineConfigs.map(config => {
        return config.id === id ? { ...config, ...updated } : config
      })
    )
    console.dir(lineConfigs, { depth: null })
  }

  const removeConfig = id => {
    setLineConfigs(lineConfigs.filter(config => config.id !== id))
  }

  return (
    <div>
      {lineConfigs.map(config => {
        console.dir(config, { depth: null })

        return (
          <DieConfig
            key={config.id}
            lineConfig={config}
            onUpdate={updated => updateConfig(config.id, updated)}
            onRemove={() => removeConfig(config.id)}
          />
        )
      })}
    </div>
  )
}

export default App
