// import * as nodemailer from "nodemailer";
import { transporter } from "../config/nodemailerConfig.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function sendRecoveryEmail({ recipient_email, OTP }) {
  return new Promise((resolve, reject) => {
    console.log("Sending recovery email to:", recipient_email);
    const mail_configs = {
      from: process.env.MY_EMAIL,
      to: recipient_email,
      subject: "Recuperación de contraseña - MuseDMX",
      html: `<!DOCTYPE html>
			<html lang="es">

				<head>
					<meta charset="UTF-8">
					<title>Correo de Recuperación de Contraseña - MuseDMX</title>
					<style>

						h1 {
							font-family: Raleway, sans-serif;
							font-optical-sizing: auto;
							font-weight: 400;
							font-style: normal;
							font-size: 1.4em;
							text-decoration: none;
								color: #00466a;
						}

						p {
							font-family: Quicksand, sans-serif;
							font-optical-sizing: auto;
							font-weight: 300;
							font-style: normal;
							font-size: 1.1em;
							color: #333;
						}

						h2 {
							font-family: Raleway, sans-serif;
							font-weight: 700;
							font-style: normal;
							font-size: 2em;
							background: #00466a;
							margin: 0 auto;
							width: max-content;
							padding: 0 10px;
							color: #fff;
							border-radius: 4px;
						}
						
						.datos {
							float: left;
							padding: 8px 0;
							color: #aaa;
							font-size: 0.8em;
							line-height: 1;
							font-weight: 300;
						}


						.datos p {
							font-family: Quicksand, sans-serif;
							font-optical-sizing: auto;
							font-weight: 300;
							font-style: normal;
							font-size: .9em;
							color: #333;
						}
					</style>
				</head>

				<body>
					<!-- partial:index.partial.html -->
					<div>
						<div style="margin:50px auto;width:70%;padding:20px 0">
							<div style="border-bottom:1px solid #eee">
								<img src="cid:logo" alt="MuseDMX Logo" style="width: 150px; height: auto;" />
							</div>
							<p>Gracias por usar MuseDMX. Utiliza este código de un solo uso para completar tu procedimiento de
								recuperación de contraseña.</p>
							<h2>${OTP}</h2>
							<p>Saludos,<br />MuseDMX</p>
							<hr style="border:none;border-top:1px solid #eee" />
							<div class="datos">
								<p>MuseDMX Inc</p>
								<p>Unidad Profesional Adolfo López Mateos, Av. Juan de Dios Bátiz, Nueva Industrial Vallejo</p>
								<p>Ciudad de México</p>
							</div>
						</div>
					</div>
					<!-- partial -->

				</body>

			</html>`,
      attachments: getAttachments(),
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

export function sendOTPEmail({ recipient_email, OTP }) {
  return new Promise((resolve, reject) => {
    console.log("Sending OTP email to:", recipient_email);
    const mail_configs = {
      from: process.env.MY_EMAIL,
      to: recipient_email,
      subject: "Código de Verificación - MuseDMX",
      html: `<!DOCTYPE html>
			<html lang="es">

				<head>
					<meta charset="UTF-8">
					<title>Correo de Verificación - MuseDMX</title>
					<style>
						h1 {
							font-family: Raleway, sans-serif;
							font-optical-sizing: auto;
							font-weight: 400;
							font-style: normal;
							font-size: 1.4em;
							text-decoration: none;
								color: #00466a;
						}

						p {
							font-family: Quicksand, sans-serif;
							font-optical-sizing: auto;
							font-weight: 300;
							font-style: normal;
							font-size: 1.1em;
							color: #333;
						}

						h2 {
							font-family: Raleway, sans-serif;
							font-weight: 700;
							font-style: normal;
							font-size: 2em;
							background: #00466a;
							margin: 0 auto;
							width: max-content;
							padding: 0 10px;
							color: #fff;
							border-radius: 4px;
						}

						.datos p {
							font-family: Quicksand, sans-serif;
							font-optical-sizing: auto;
							font-weight: 300;
							font-style: normal;
							font-size: .9em;
							color: #333;
						}
					</style>
				</head>

				<body>
					<!-- partial:index.partial.html -->
					<div>
						<div style="margin:50px auto;width:70%;padding:20px 0">
							<div style="border-bottom:1px solid #eee">
								<img src="cid:logo" alt="MuseDMX Logo" style="width: 150px; height: auto;" />
							</div>
							<p>Gracias por usar MuseDMX. Utiliza este código de verificación para completar tu registro o
								procedimiento de autenticación.</p>
							<h2>${OTP}</h2>
							<p>Saludos,<br />MuseDMX</p>
							<hr style="border:none;border-top:1px solid #eee" />
							<div class="datos"
								style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
								<p>MuseDMX Inc</p>
								<p>Unidad Profesional Adolfo López Mateos, Av. Juan de Dios Bátiz, Nueva Industrial Vallejo</p>
								<p>Ciudad de México</p>
							</div>
						</div>
					</div>
					<!-- partial -->
				</body>
			</html>`,
      attachments: getAttachments(),
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

export function getAttachments() {
  console.log(path.join(__dirname, "../assets/icons/musedmx-logo.png"));
  return [
    {
      filename: "musedmx-logo.png",
      path: path.join(__dirname, "../assets/icons/musedmx-logo.png"),
      cid: "logo", // este cid debe coincidir con el usado en el HTML
    },
  ];
}
