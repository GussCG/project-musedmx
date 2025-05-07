export default class Museo {
  constructor({
    mus_id,
    mus_nombre,
    mus_calle,
    mus_num_ext,
    mus_colonia,
    mus_cp,
    mus_alcaldia,
    mus_descripcion,
    mus_fec_ap,
    mus_tematica,
    mus_foto,
    mus_g_latitud,
    mus_g_longitud,
    galeria = [],
    horarios_precios = [],
    redes_sociales = [],
  }) {
    this.id = mus_id;
    this.nombre = mus_nombre;
    this.calle = mus_calle;
    this.num_ext = mus_num_ext;
    this.colonia = mus_colonia;
    this.cp = mus_cp;
    this.alcaldia = mus_alcaldia;
    this.descripcion = mus_descripcion;
    this.fecha_apertura = mus_fec_ap;
    this.tematica = Number(mus_tematica);
    this.img = mus_foto;
    this.g_latitud = mus_g_latitud;
    this.g_longitud = mus_g_longitud;

    // Subestructuras
    this.galeria = galeria.map((foto) => new FotoGaleria(foto));
    this.horarios_precios = horarios_precios.map(
      (horario) => new HorarioPrecio(horario)
    );
    this.redes_sociales = redes_sociales.map((red) => new RedSocial(red));
  }
}
