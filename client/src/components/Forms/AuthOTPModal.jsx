import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import OtpInput from "react-otp-input";
import Icons from "../Other/IconProvider";
import { useOTP } from "../../hooks/Usuario/useOTP";
import ToastMessage from "../Other/ToastMessage";
const { IoClose } = Icons;
import { useNavigate } from "react-router-dom";

function AuthOTPModal({ onClose, correo, redirectTo = "/Auth/Iniciar" }) {
  const [otp, setOtp] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [correoInput, setCorreoInput] = useState(correo || "");
  const navigate = useNavigate();

  const { generarOTP, verificarOTP } = useOTP();

  const handleResend = async () => {
    if (isResendDisabled) return;

    if (!correoInput) {
      ToastMessage({
        tipo: "error",
        mensaje: "Por favor, ingresa tu correo electrónico.",
        position: "top-right",
      });
      return;
    }

    try {
      const response = await generarOTP(correoInput);
      console.log("OTP generado:", response);
      if (response.success) {
        ToastMessage({
          tipo: "success",
          mensaje: response.message,
          position: "top-right",
        });
      } else {
        ToastMessage({
          tipo: "error",
          mensaje: response.response.data.message,
          position: "top-right",
        });
        return;
      }
    } catch (error) {
      console.error("Error al reenviar OTP:", error);
    } finally {
      setIsResendDisabled(true);
      setResendTimer(60);
    }
  };

  const handleVerify = async () => {
    if (otp.length < 6) {
      ToastMessage({
        tipo: "error",
        mensaje: "Por favor, ingresa un código de 6 dígitos.",
        position: "top-right",
      });
    }

    if (!correoInput) {
      ToastMessage({
        tipo: "error",
        mensaje: "Por favor, ingresa tu correo electrónico.",
        position: "top-right",
      });
      return;
    }

    try {
      const response = await verificarOTP(otp, correoInput);
      if (response.success) {
        ToastMessage({
          tipo: "success",
          mensaje: "Código verificado exitosamente.",
          position: "top-right",
        });
        navigate(redirectTo, { replace: true, state: { correo: correoInput } });
      } else {
        ToastMessage({
          tipo: "error",
          mensaje: response.message || "Error al verificar el código.",
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error al verificar OTP:", error);
      ToastMessage({
        tipo: "error",
        mensaje: "Error al verificar el código. Inténtalo de nuevo.",
        position: "top-right",
      });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (isResendDisabled && resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (resendTimer === 0) {
      setIsResendDisabled(false);
    }
  }, [resendTimer, isResendDisabled]);

  return (
    <motion.div
      className="bg-opaco-blur"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
    >
      <main className="otp-main" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal-button" onClick={onClose}>
          <IoClose />
        </button>
        <div className="otp-header">
          <h1>Autenticación de Dos Factores</h1>
          <p>
            Por favor, ingresa el código de verificación enviado a tu correo
            electrónico.
          </p>
        </div>
        {!correo && (
          <div className="registros-field">
            <input
              value={correoInput}
              onChange={(e) => setCorreoInput(e.target.value)}
              type="email"
              id="signin-frm-email"
              name="signinfrmemail"
              placeholder="Correo Electrónico"
              required
            />
            <label htmlFor="signin-frm-email" className="frm-label">
              Correo Electrónico
            </label>
          </div>
        )}
        <OtpInput
          value={otp}
          onChange={setOtp}
          numInputs={6}
          renderInput={(props) => <input {...props} />}
          inputType="number"
          inputStyle={{
            width: "3rem",
            height: "3.3rem",
            margin: "0 0.5rem",
            fontFamily: `Quicksand, sans-serif`,
            fontWeight: "bold",
            fontSize: "1.5rem",
            borderRadius: "10px",
            textAlign: "center",
            border: "none",
            outline: "none",
            backgroundColor: "#f0f0f0",
          }}
        />
        <div className="otp-buttons">
          <button
            className={`button ${isResendDisabled ? "disabled" : ""}`}
            onClick={handleResend}
            disabled={isResendDisabled}
          >
            {isResendDisabled
              ? `Volver a enviar en 00:${resendTimer
                  .toString()
                  .padStart(2, "0")}`
              : "Reenviar código"}
          </button>
          <button
            className={`button ${
              otp.length < 6 || !correoInput ? "disabled" : ""
            }`}
            onClick={handleVerify}
            disabled={otp.length < 6 || !correoInput}
          >
            Verificar
          </button>
        </div>
      </main>
    </motion.div>
  );
}

export default AuthOTPModal;
