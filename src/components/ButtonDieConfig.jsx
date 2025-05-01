const ButtonDieConfig = ({ label, iconName, handleClick }) => {
  // const handleClick = val => {
  //   setCompVal(val)
  // }

  return (
    <div className='button-die-config'>
      <button onClick={handleClick}>
        {label && label}
        {iconName && (
          <span className='material-symbols-outlined'>{iconName}</span>
        )}
      </button>
    </div>
  )
}

export default ButtonDieConfig
