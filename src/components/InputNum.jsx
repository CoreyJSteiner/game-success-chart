const InputNum = ({ label, value = 0, onChange, min = 0, max = 5 }) => {
  const handleChange = newValue => {
    const num = Math.max(min, Math.min(max, Number(newValue)))
    onChange(num)
  }

  return (
    <div className='num-input-cont'>
      {label && label}
      <div className='number-input'>
        <button onClick={() => handleChange(value - 1)}>-</button>
        <input
          type='number'
          onChange={() => handleChange(e.target.value)}
          min={min}
          max={max}
          value={value}
        />
        <button onClick={() => handleChange(value + 1)}>+</button>
      </div>
    </div>
  )
}

export default InputNum
