import { useState } from 'react'

const TextInput = props => {
  const [compVal, setCompVal] = useState(props.compVal || 0)

  const handleInputChange = val => {
    setCompVal(val)
  }

  return (
    <div className='text-input-cont'>
      {props.label && props.label}
      <div className='text-input'>
        <input type='text' onChange={handleInputChange} value={compVal} />
      </div>
    </div>
  )
}

export default TextInput
