import { useState } from 'react'
import { getRandomColor } from '../utils'

export default function useLineConfigs () {
  const [lineConfigs, setLineConfigs] = useState([])

  const addConfig = input => {
    const config = {
      name: input.name || '1d10',
      lineColor: input.lineColor || getRandomColor(),
      lineStyle: input.lineStyle || 'solid',
      d4: input.d4 || 0,
      d10: input.d10 || 0,
      d12: input.d12 || 0
    }
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
