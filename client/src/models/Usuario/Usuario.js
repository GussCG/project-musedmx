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
  constructor(correo, nombre, apPaterno, apMaterno, telefono, fecNac) {
    super(correo, nombre, apPaterno, apMaterno, telefono, fecNac);
  }
}

class Mod extends Usuario {
  constructor(correo, nombre, apPaterno, apMaterno, telefono, fecNac) {
    super(correo, nombre, apPaterno, apMaterno, telefono, fecNac);
  }
}

export { Usuario, Admin, Mod };
