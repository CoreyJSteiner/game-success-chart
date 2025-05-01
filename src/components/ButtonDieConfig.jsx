const ButtonDieConfig = props => {
  // const handleClick = val => {
  //   setCompVal(val)
  // }

  return (
    <div className='button-die-config'>
      <button onClick={props.handleClick}>
        {props.label && props.label}
        {props.iconName && (
          <span className='material-symbols-outlined'>{props.iconName}</span>
        )}
      </button>
    </div>
  )
}

export default ButtonDieConfig
