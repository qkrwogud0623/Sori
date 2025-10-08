import './Button.css';

function Button({ children, onClick, variant = 'primary' }) {
  return (
    <button className={`custom-button ${variant}`} onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;