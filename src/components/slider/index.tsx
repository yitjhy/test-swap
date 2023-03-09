import { useState, FC, useEffect, ChangeEvent } from 'react'
import styled from 'styled-components'

type TSliderProps = {
  value: number
  onChange: (value: number) => void
}
const Slider: FC<TSliderProps> = ({ onChange, value: sliderValue = 50 }) => {
  const [value, setValue] = useState<number>(sliderValue | 50)
  const onSliderChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(Number(e.target.value))
    onChange(Number(e.target.value))
  }
  useEffect(() => {
    setValue(sliderValue)
  }, [sliderValue])
  return (
    <ReactSlider
      type="range"
      min="0"
      max="100"
      step="0.1"
      onChange={onSliderChange}
      value={value}
      sliderValue={value}
    />
  )
}
const ReactSlider = styled.input<{ sliderValue: number }>`
  &::-webkit-slider-thumb {
    position: relative;
    height: 20px;
    width: 20px;
    margin-top: -9px;
    background-color: #d9d9d9;
    border-radius: 50%;
    border: none;
    cursor: pointer;
  }
  &::-webkit-slider-runnable-track {
    height: 3px;
    width: 180px;
    border-radius: 4px;
    /* background: linear-gradient(to right, #ff9417 0%, #ff9417 80%, #9c9c9c 80%, #9c9c9c); */
    background: ${({ sliderValue }) =>
      `linear-gradient(to right, #ff9417 0%, #ff9417 ${sliderValue}%, #9c9c9c ${sliderValue}%, #9c9c9c)`};
  }
`
export default Slider
