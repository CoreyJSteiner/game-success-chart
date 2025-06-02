import InputNum from './InputNum'
import ButtonLineConfig from './ButtonLineConfig'
import { useRef } from 'react'

const LineConfigDisplay = ({ lineConfig, onUpdate, onRemove, onDuplicate }) => {
  const d4El = useRef()
  const d10El = useRef()
  const d12El = useRef()

  const handleChange = (field, value) => {
    const autoName = (changeField, newValue) => {
      const d4 = changeField === 'd4' ? newValue : d4El.current.value
      const d10 = changeField === 'd10' ? newValue : d10El.current.value
      const d12 = changeField === 'd12' ? newValue : d12El.current.value

      const strD10 = d10 > 0 ? d10 + 'd10' : ''
      const strD12 = d12 > 0 ? d12 + 'd12' : ''
      const strD4 = 'C'.repeat(d4)

      return `${strD10}${strD12}${strD4}`
    }

    onUpdate({
      name: autoName(field, value),
      [field]: value
    })
  }

  return (
    <div className='config' id={lineConfig.id}>
      <div id='config-header'>
        <div id='config-controls'>
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
          ref={d4El}
          label={'D4'}
          onChange={val => handleChange('d4', val)}
          value={lineConfig.d4}
        />
        <InputNum
          ref={d10El}
          label={'D10'}
          onChange={val => handleChange('d10', val)}
          value={lineConfig.d10}
        />
        <InputNum
          ref={d12El}
          label={'D12'}
          onChange={val => handleChange('d12', val)}
          value={lineConfig.d12}
        />
      </div>
      <input
        type='text'
        id='config-group'
        onChange={e => handleChange('group', e.target.value)}
        value={lineConfig.group}
        placeholder='Group name'
      />
    </div>
  )
}

export default LineConfigDisplay
