import ButtonMain from './ButtonMain'
import { useRef } from 'react'

const JsonImportButton = ({ replaceConfigs, importRunSim }) => {
  const hiddenInputRef = useRef(null)

  const openFileDialogue = () => {
    hiddenInputRef.current.click()
  }

  const importJson = async e => {
    try {
      const file = e.target.files[0]
      if (!file) return

      const text = await file.text()
      const configs = JSON.parse(text).configs

      replaceConfigs(configs)
      importRunSim(configs)
    } catch (error) {
      alert('Invalid JSON file: ' + error.message)
    }
  }

  return (
    <div>
      <ButtonMain label='Import JSON' handleClick={openFileDialogue} />
      <input
        id='json-file-input'
        type='file'
        accept='.json'
        style={{ display: 'none' }}
        ref={hiddenInputRef}
        onChange={importJson}
      />
    </div>
  )
}

export default JsonImportButton
