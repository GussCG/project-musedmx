import adminFoto from "../assets/images/placeholders/admin-placeholder.png";
import modFoto from "../assets/images/placeholders/mod-placeholder.png";

class Usuario {
  constructor(
    correo,
    nombre,
    apPaterno,
    apMaterno,
    telefono,
    fecNac,
    foto,
    tematicas = []
  ) {
    this.correo = correo;
    this.nombre = nombre;
    this.apPaterno = apPaterno;
    this.apMaterno = apMaterno;
    this.telefono = telefono;
    this.fecNac = fecNac;
    this.foto = foto;
    this.tematicas = tematicas;
  }
}

class Admin extends Usuario {
  foto = { adminFoto };
  constructor(correo, nombre, apPaterno, apMaterno, telefono, fecNac) {
    super(correo, nombre, apPaterno, apMaterno, telefono, fecNac, foto, null);
  }
}

class Mod extends Usuario {
  foto = { modFoto };
  constructor(correo, nombre, apPaterno, apMaterno, telefono, fecNac) {
    super(correo, nombre, apPaterno, apMaterno, telefono, fecNac, foto, null);
  }
}

export { Usuario, Admin, Mod };
