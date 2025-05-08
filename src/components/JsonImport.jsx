import ButtonMain from './ButtonMain'
import { useRef } from 'react'

const JsonImportButton = ({ importJson }) => {
  const hiddenInputRef = useRef(null)

  const openFileDialogue = () => {
    hiddenInputRef.current.click()
  }

  const importJsonButtonHandler = async e => {
    try {
      const file = e.target.files[0]
      if (!file) return
      importJson(file)
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
        onChange={importJsonButtonHandler}
      />
    </div>
  )
}

export default JsonImportButton
