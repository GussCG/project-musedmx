import http, { head } from "k6/http";
import { check, sleep } from "k6";
import { SharedArray } from "k6/data";

export let options = {
  vus: 200, // Numero de usuarios virtuales
  duration: "30s",
};

export default function () {
  const correo_test = "alejandrofigueroa@example.net";
  const url = `http://localhost:8000/api/v1/recomendaciones/personalizada/${correo_test}`;
  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  let res = http.get(url, params);
  check(res, {
    "status is 200": (r) => r.status === 200,
    "response time < 200ms": (r) => r.timings.duration < 200,
  });
  sleep(1); // Espera 1 segundo entre peticiones
}
