class Review {
	constructor (
		res_id, 
		res_comentario,
		res_mod_correo, 
		res_aprobado, 
		res_calif_estrellas, 
		visitas_vi_usr_correo,
		visitas_vi_mus_id,
		visitas_vi_fechahora, 
		f_res_foto = []
	) {
		this.res_id = res_id;
		this.res_comentario = res_comentario;
		this.res_mod_correo = res_mod_correo;
		this.res_aprobado = res_aprobado;
		this.res_calif_estrellas = res_calif_estrellas;
		this.visitas_vi_usr_correo = visitas_vi_usr_correo;
		this.visitas_vi_mus_id = visitas_vi_mus_id;
		this.visitas_vi_fechahora = visitas_vi_fechahora;
		this.f_res_foto = f_res_foto;
	}
}

export default Review;