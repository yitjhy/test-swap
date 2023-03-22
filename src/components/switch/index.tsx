// @ts-nocheck
import { useEffect, useState, FC, InputHTMLAttributes, useImperativeHandle, forwardRef } from 'react'

type TSwitchProps = {
  checked: boolean
  onChange: (isChecked: boolean) => void
}
const Switch: FC<TSwitchProps> = ({ checked, onChange }, ref) => {
  const [isChecked, setIsChecked] = useState(checked)
  useImperativeHandle(ref, () => ({
    // changeVal 就是暴露给父组件的方法
    handleChecked: (value: boolean) => {
      setIsChecked(value)
    },
  }))
  useEffect(() => {
    setIsChecked(checked)
  }, [checked])

  const onInputChange: InputHTMLAttributes<HTMLInputElement>['onChange'] = (e) => {
    const value = e.target.checked
    setIsChecked(value)
    if (!onChange) {
      return
    }
    onChange(value)
  }

  return (
    <label className="switch">
      <input type="checkbox" checked={isChecked} onChange={onInputChange} className="switch-checkbox" />
      <div className={isChecked ? 'switch-container switch-container-checked' : 'switch-container'} />
    </label>
  )
}

export default forwardRef(Switch)
