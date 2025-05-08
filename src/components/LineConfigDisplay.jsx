import InputNum from './InputNum'
import ButtonLineConfig from './ButtonLineConfig'

const LineConfigDisplay = ({ lineConfig, onUpdate, onRemove, onDuplicate }) => {
  const handleChange = (field, value) => {
    onUpdate({ [field]: value })
  }

  return (
    <div className='config' id={lineConfig.id}>
      <div id='config-header'>
        <div id='config-controls'>
          {/* <ButtonLineConfig iconName='arrow_left' /> */}
          {/* <ButtonLineConfig iconName='arrow_right' /> */}
          <ButtonLineConfig
            iconName='content_copy'
            handleClick={e => onDuplicate(e.target.id)}
          />
        </div>
        <div>
          <input
            type='text'
            id='config-name'
            onChange={e => handleChange('name', e.target.value)}
            value={lineConfig.name}
            placeholder='Configuration name'
          />
          <input
            type='color'
            className='color-picker'
            onChange={e => handleChange('lineColor', e.target.value)}
            value={lineConfig.lineColor}
          />
          <select
            id='line-style-dropdown'
            onChange={e => handleChange('lineStyle', e.target.value)}
            value={lineConfig.lineStyle}
          >
            <option value='solid'>Solid</option>
            <option value='dashed'>Dashed</option>
            <option value='dotted'>Dotted</option>
            <option value='dashDot'>Dash-Dot</option>
          </select>
        </div>
        <ButtonLineConfig
          iconName='delete_forever'
          handleClick={e => onRemove(e.target.id)}
        />
      </div>
      <div id='dice-inputs'>
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
