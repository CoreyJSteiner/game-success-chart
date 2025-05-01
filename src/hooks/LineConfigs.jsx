import { useState } from 'react'
import { getRandomColor } from '../utils'

export default function useLineConfigs () {
  const [lineConfigs, setLineConfigs] = useState([])

  const addConfig = (
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
    if (config) addConfig(config)
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

  return { lineConfigs, addConfig, duplicateConfig, updateConfig, removeConfig }
}
