import { HorarioPrecio } from "./HorarioPrecio";
import { RedSocial } from "./RedSocial";
import { FotoGaleria } from "./FotoGaleria";

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
    horarios = [],
    redes = [],
    total_resenias = 0,
    total_favoritos = 0,
    mus_calificacion = 0,
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
    this.total_resenias = total_resenias;
    this.total_favoritos = total_favoritos;
    this.mus_calificacion = mus_calificacion;

    // Subestructuras
    this.galeria = galeria.map((foto) => new FotoGaleria(foto));
    this.horarios = horarios.map((horario) => new HorarioPrecio(horario));
    this.redes_sociales = redes.map((red) => new RedSocial(red));
  }
}
