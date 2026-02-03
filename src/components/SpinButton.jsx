import './SpinButton.css';

export default function SpinButton({ onClick, disabled }) {
  return (
    <button
      className={`spin-button ${disabled ? 'spin-button--disabled' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {disabled ? '...' : 'SPIN!'}
    </button>
  );
}
