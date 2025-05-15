import Icons from "../Other/IconProvider";
const { IoClose } = Icons;

function LoginErrorMessage({ error, onClose }) {
  return (
    <div className="login-error-message">
      <p>{error}</p>
      <button id="close-login-popup" type="button" onClick={onClose}>
        <IoClose />
      </button>
    </div>
  );
}

export default LoginErrorMessage;
