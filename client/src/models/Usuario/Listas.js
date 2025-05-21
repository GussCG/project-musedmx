class Lista {
  constructor(
    usr_correo, 
	mus_id
  ) {
	this.usr_correo = usr_correo;
	this.mus_id = mus_id;
  }
}

class Visitas extends Lista {
  constructor(usr_correo, mus_id, vi_fechahora) {
	super(usr_correo, mus_id);
  	this.vi_fechahora = vi_fechahora;
  }
}

export { Lista, Visitas };