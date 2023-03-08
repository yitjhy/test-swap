import { useEffect, useState, FC } from 'react';
// import './index.css';

type TSwitchProps = {
  checked: boolean;
  onChange: (isChecked: boolean) => void;
};
const Switch: FC<TSwitchProps> = ({ checked, onChange }) => {
  const [isChecked, setIsChecked] = useState(checked);

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  const onInputChange: React.InputHTMLAttributes<HTMLInputElement>['onChange'] =
    (e) => {
      const value = e.target.checked;
      setIsChecked(value);
      if (!onChange) {
        return;
      }
      onChange(value);
    };

  return (
    <label className="switch">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={onInputChange}
        className="switch-checkbox"
      />
      <div
        className={
          isChecked
            ? 'switch-container switch-container-checked'
            : 'switch-container'
        }
      />
    </label>
  );
};

export default Switch;
