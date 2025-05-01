import InputNum from './InputNum'
import ButtonDieConfig from './ButtonDieConfig'

const LineConfigDisplay = ({ lineConfig, onUpdate, onRemove, onDuplicate }) => {
  const handleChange = (field, value) => {
    onUpdate({ [field]: value })
  }

  return (
    <div className='config-box' id={lineConfig.id}>
      <div className='config-header'>
        <div className='config-controls'>
          <ButtonDieConfig iconName='arrow_left' />
          <ButtonDieConfig iconName='arrow_right' />
          <ButtonDieConfig
            iconName='content_copy'
            handleClick={e => onDuplicate(e.target.id)}
          />
        </div>
        <div>
          <input
            type='text'
            className='config-name'
            onChange={e => handleChange('name', e.target.value)}
            value={lineConfig.name}
            placeholder='Configuration name'
          />
          <input
            type='color'
            className='color-picker'
            onChange={e => handleChange('lineColor', e.target.value)}
            value={lineConfig.color}
          />
          <select
            className='line-style'
            onChange={e => handleChange('lineStyle', e.target.value)}
            value={lineConfig.lineStyle}
          >
            <option value='solid'>Solid</option>
            <option value='dashed'>Dashed</option>
            <option value='dotted'>Dotted</option>
            <option value='dashDot'>Dash-Dot</option>
          </select>
        </div>
        <ButtonDieConfig
          iconName='delete_forever'
          handleClick={e => onRemove(e.target.id)}
        />
      </div>
      <div className='dice-inputs'>
        <InputNum
          label={'D4'}
          onChange={val => handleChange('d4', val)}
          value={lineConfig.d4}
        />
        <InputNum
          label={'D10'}
          onChange={val => handleChange('d10', val)}
          value={lineConfig.d10}
        />
        <InputNum
          label={'D12'}
          onChange={val => handleChange('d12', val)}
          value={lineConfig.d12}
        />
      </div>
    </div>
  )
}

export default LineConfigDisplay
