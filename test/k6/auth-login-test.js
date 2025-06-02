// Auth login test
import http, { head } from "k6/http";
import { check, sleep } from "k6";
import { SharedArray } from "k6/data";

const users = new SharedArray("users", function () {
  const f = open("../../server/scripts/csvpruebas/usuarios.csv");
  return f
    .split("\n")
    .slice(1) // Ignora la primera línea (cabecera)
    .map((line) => {
      const parts = line.split(",").map((x) => x.trim());
      const usr_correo = parts[0];
      // No usar contraseña cifrada, usar la contraseña en texto plano de test
      const usr_contrasenia = "password123";
      return { usr_correo, usr_contrasenia };
    })
    .filter((user) => user.usr_correo && user.usr_contrasenia); // Filtra usuarios válidos
});

export let options = {
  vus: 200, // Numero de usuarios virtuales
  duration: "30s",
};

export default function () {
  const user = users[Math.floor(Math.random() * users.length)];

  const url = "http://localhost:3000/api/auth/login";
  const payload = JSON.stringify({
    usr_correo: user.usr_correo,
    usr_contrasenia: user.usr_contrasenia,
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  let res = http.post(url, payload, params);
  check(res, {
    "login exitoso": (r) => r.status === 200,
  });

  sleep(1); // Espera 1 segundo entre peticiones
}
