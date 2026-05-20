export class HorarioPrecio {
  constructor({
    mh_id,
    mh_dia,
    mh_hora_inicio,
    mh_hora_fin,
    mh_precio_ad,
    mh_precio_est,
    mh_precio_ni,
    mh_precio_ter,
    mh_mus_id,
  }) {
    this.id = mh_id;
    this.dia = mh_dia;
    this.hora_inicio = mh_hora_inicio;
    this.hora_fin = mh_hora_fin;
    this.precio_ad = mh_precio_ad;
    this.precio_est = mh_precio_est;
    this.precio_ni = mh_precio_ni;
    this.precio_ter = mh_precio_ter;
    this.mus_id = mh_mus_id;
  }
}
