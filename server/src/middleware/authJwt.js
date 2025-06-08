import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  let token = null;

  // Opción 1: Bearer token
  if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Token no proporcionado",
      details:
        "Debe incluir el token en el header Authorization: Bearer <token>",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Estructura consistente del usuario
    req.usuario = {
      correo: decoded.correo || decoded.usr_correo, // Compatibilidad con ambos formatos
      id: decoded.id || decoded.usr_id,
      tipo: decoded.tipo || decoded.usr_tipo,
    };

    next();
  } catch (error) {
    console.error("Error verificando token:", error);

    let message = "Token inválido";
    if (error.name === "TokenExpiredError") {
      message = "Token expirado";
    } else if (error.name === "JsonWebTokenError") {
      message = "Token malformado";
    }

    return res.status(401).json({
      success: false,
      message,
      details: error.message,
    });
  }
};
