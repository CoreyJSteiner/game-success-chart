import { useState } from 'react'
import { getRandomColor } from '../utils'

const useLineConfigs = () => {
  const [lineConfigs, setLineConfigs] = useState([])

  const addConfig = input => {
    const config = {
      name: input.name || '',
      lineColor: input.lineColor || getRandomColor(),
      lineStyle: input.lineStyle || 'solid',
      d4: input.d4 || 0,
      d10: input.d10 || 0,
      d12: input.d12 || 0,
      group: 'Group 1'
    }
    setLineConfigs([...lineConfigs, { ...config, id: crypto.randomUUID() }])
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
    if (config) addConfig(config)
  }

  const getConfigById = id => {
    let config = null
    lineConfigs.forEach(c => {
      if (c.id === id) {
        config = c
      }
    })

    return config
  }

  const clearConfigs = () => {
    setLineConfigs([])
  }

  const replaceConfigs = newConfigs => {
    const updatedConfigs = newConfigs.map(config => ({
      ...config,
      id: crypto.randomUUID()
    }))
    setLineConfigs(updatedConfigs)
  }

  return {
    lineConfigs,
    setLineConfigs,
    addConfig,
    duplicateConfig,
    updateConfig,
    removeConfig,
    clearConfigs,
    replaceConfigs
  }
}

export default useLineConfigs
