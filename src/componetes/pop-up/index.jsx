import "./style.css";

export default function Popup({ message, onConfirm, onCancel }) {
  return (
    <div className="popup-container">
      <div className="popup">
        <h2>Confirmar Ação</h2>
        <p>{message}</p>
        <div className="popup-buttons">
          <button className="confirm-button" onClick={onConfirm}>Confirmar</button>
          <button className="cancel-button" onClick={onCancel}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}
