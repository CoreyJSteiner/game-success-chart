import { saveAs } from 'file-saver'

const useJsonExport = () => {
  const exportToJSON = data => {
    try {
      if (data.length === 0) return alert('No data to export!')

      const jsonData = JSON.stringify(data, null, 2)

      const blob = new Blob([jsonData], { type: 'application/json' })
      saveAs(blob, 'probs_' + Date.now())
    } catch (e) {
      alert('Invalid JSON file: ' + error.message)
    }
  }

  return { exportToJSON }
}

export default useJsonExport
