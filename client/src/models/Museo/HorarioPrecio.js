export class HorarioPrecio {
  constructor({ mh_id, mh_dia, mh_hora_inicio, mh_hora_fin, mh_precio_dia }) {
    this.id = mh_id;
    this.dia = mh_dia;
    this.hora_inicio = mh_hora_inicio;
    this.hora_fin = mh_hora_fin;
    this.precio_dia = mh_precio_dia;
  }
}
