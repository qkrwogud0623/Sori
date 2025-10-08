// src/components/common/Input.jsx

import './Input.css';

function Input({ label, type = 'text', placeholder, value, onChange }) {
  return (
    <div className="input-wrapper">
      {label && <label className="input-label">{label}</label>}
      <input
        className="custom-input"
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

export default Input;