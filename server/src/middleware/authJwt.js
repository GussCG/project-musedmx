import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
	const token = req.cookies?.token;
	if (!token) {
		return res.status(401).json({ message: "Token no proporcionado" });
	}
  
	try {
	  	const decoded = jwt.verify(token, process.env.JWT_SECRET);
	  	req.usuario = decoded;
	  	next();
	} catch (error) {
		console.error("Error verificando token:", error);
	  	return res.status(401).json({ message: 'Token inválido' });
	}
  };
