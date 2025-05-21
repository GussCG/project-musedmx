// import * as nodemailer from "nodemailer";
import { transporter } from "../config/nodemailerConfig"

function sendEmail({ recipient_email, OTP }) {
  return new Promise((resolve, reject) => {
    const mail_configs = {
      from: process.env.MY_EMAIL,
      to: recipient_email,
      subject: "Recuperación de contraseña - MuseDMX",
      html: `<!DOCTYPE html>
			<html lang="en" >
			<head>
			<meta charset="UTF-8">
			<title>Correo de Recuperación de Contraseña - MuseDMX</title>

			</head>
			<body>
			<!-- partial:index.partial.html -->
			<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
			<div style="margin:50px auto;width:70%;padding:20px 0">
				<div style="border-bottom:1px solid #eee">
				<a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">MuseDMX</a>
				</div>
				<p style="font-size:1.1em">Hi,</p>
				<p>Gracias por usar MuseDMX. Utiliza este código de un solo uso para completar tu procedimiento de recuperación de contraseña. El código es válido por 5 minutos</p>
				<h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2>
				<p style="font-size:0.9em;">Regards,<br />MuseDMX</p>
				<hr style="border:none;border-top:1px solid #eee" />
				<div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
				<p>MuseDMX Inc</p>
				<p>Unidad Profesional Adolfo López Mateos, Av. Juan de Dios Bátiz, Nueva Industrial Vallejo</p>
				<p>Ciudad de México</p>
				</div>
			</div>
			</div>
			<!-- partial -->
			
			</body>
			</html>`,
    };
    transporter.sendMail(mail_configs, function (error, info) {
      if (error) {
        console.log(error);
        return reject({ message: `An error has occured` });
      }
      return resolve({ message: "Email sent succesfuly" });
    });
  });
}

module.exports = { sendRecoveryEmail };
