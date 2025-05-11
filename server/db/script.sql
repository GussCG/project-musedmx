CREATE DATABASE IF NOT EXISTS `musedmx` DEFAULT CHARACTER SET latin1 ;
USE `musedmx`;
-- DROP DATABASE `musedmx`;

-----------------------------------------------------
-- Table `musedmx`.`usuarios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `musedmx`.`usuarios` (
  `usr_correo` VARCHAR(75) NOT NULL,
  `usr_nombre` VARCHAR(20) NOT NULL,
  `usr_ap_paterno` VARCHAR(30) NOT NULL,
  `usr_ap_materno` VARCHAR(30) NULL DEFAULT NULL,
  `usr_contrasenia` VARCHAR(256) NOT NULL,
  `usr_fecha_nac` DATE NOT NULL,
  `usr_telefono` VARCHAR(10) NULL DEFAULT NULL,
  `usr_foto` LONGBLOB NULL DEFAULT NULL,
  `usr_tipo` TINYINT(1) NOT NULL,
  PRIMARY KEY (`usr_correo`)
-- UNIQUE INDEX `correo` (`usr_correo` ASC) VISIBLE
  );

-- -----------------------------------------------------
-- Table `musedmx`.`administrador`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `musedmx`.`administrador` (
  `usuarios_usr_correo` VARCHAR(75) NOT NULL,
  PRIMARY KEY (`usuarios_usr_correo`),
  CONSTRAINT `fk_administrador_usuarios1`
    FOREIGN KEY (`usuarios_usr_correo`)
    REFERENCES `musedmx`.`usuarios` (`usr_correo`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);

-- -----------------------------------------------------
-- Table `musedmx`.`moderador`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `musedmx`.`moderador` (
  `usuarios_usr_correo` VARCHAR(75) NOT NULL,
  PRIMARY KEY (`usuarios_usr_correo`),
  CONSTRAINT `fk_moderador_usuarios1`
    FOREIGN KEY (`usuarios_usr_correo`)
    REFERENCES `musedmx`.`usuarios` (`usr_correo`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);

-- -----------------------------------------------------
-- Table `musedmx`.`auditorias`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `musedmx`.`auditorias` (
  `audit_id` INT(11) NOT NULL AUTO_INCREMENT,
  `audit_tipo_cambio` ENUM('Insert', 'Update', 'Delete') NOT NULL,
  `audit_fecha` DATETIME NOT NULL,
  `administrador_usuarios_usr_correo` VARCHAR(75) NOT NULL,
  `moderador_usuarios_usr_correo` VARCHAR(75) NOT NULL,
  PRIMARY KEY (`audit_id`, `administrador_usuarios_usr_correo`, `moderador_usuarios_usr_correo`),
  CONSTRAINT `fk_auditorias_administrador1`
	FOREIGN KEY (`administrador_usuarios_usr_correo`)
	REFERENCES `musedmx`.`administrador` (`usuarios_usr_correo`)
	ON DELETE CASCADE
	ON UPDATE CASCADE,
  CONSTRAINT `fk_auditorias_moderador1`
	FOREIGN KEY (`moderador_usuarios_usr_correo`)
	REFERENCES `musedmx`.`moderador` (`usuarios_usr_correo`)
	ON DELETE CASCADE
	ON UPDATE CASCADE
-- INDEX `fk_auditorias_administrador1_idx` (`administrador_usuarios_usr_correo` ASC) VISIBLE,
-- INDEX `fk_auditorias_moderador1_idx` (`moderador_usuarios_usr_correo` ASC) VISIBLE
  );

-- -----------------------------------------------------
-- Table `musedmx`.`museos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `musedmx`.`museos` (
  `mus_id` INT(11) NOT NULL AUTO_INCREMENT,
  `mus_nombre` VARCHAR(100) NOT NULL,
  `mus_calle` VARCHAR(100) NOT NULL,
  `mus_num_ext` VARCHAR(10) NOT NULL,
  `mus_colonia` VARCHAR(100) NOT NULL,
  `mus_cp` VARCHAR(5) NOT NULL,
  `mus_alcaldia` VARCHAR(100) NOT NULL,
  `mus_descripcion` TEXT NOT NULL,
  `mus_fec_ap` DATE NOT NULL,
  `mus_tematica` ENUM('0', '1', '2', '3', '4', '5', '6', '7') NOT NULL,
  `mus_foto` LONGBLOB,
  `mus_g_longitud` DOUBLE NULL DEFAULT NULL,
  `mus_g_latitud` DOUBLE NULL DEFAULT NULL,
  PRIMARY KEY (`mus_id`)
-- INDEX `mus_id` (`mus_id` ASC) VISIBLE
  );

-- -----------------------------------------------------
-- Table `musedmx`.`galeria`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `musedmx`.`galeria` (
  `gal_foto_id` INT(11) NOT NULL AUTO_INCREMENT,
  `gal_mus_id` INT(11) NOT NULL,
  `gal_foto` LONGBLOB NOT NULL,
  PRIMARY KEY (`gal_foto_id`, `gal_mus_id`),
  CONSTRAINT `fk_galeria_museos1`
	FOREIGN KEY (`gal_mus_id`)
	REFERENCES `musedmx`.`museos` (`mus_id`)
	ON DELETE CASCADE
	ON UPDATE CASCADE
--  INDEX `id_Museo` (`gal_mus_id` ASC) VISIBLE
  );

-- -----------------------------------------------------
-- Table `musedmx`.`horarios_precios_museo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `musedmx`.`horarios_precios_museo` (
  `mh_id` INT(11) NOT NULL AUTO_INCREMENT,
  `mh_mus_id` INT(11) NOT NULL,
  `mh_dia` SET('Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo') NOT NULL,
  `mh_hora_inicio` TIME NOT NULL,
  `mh_hora_fin` TIME NOT NULL,
  `mh_precio_dia` DOUBLE NOT NULL,
  PRIMARY KEY (`mh_id`, `mh_mus_id`),
  CONSTRAINT `fk_horarios_precios_museo_museos1`
    FOREIGN KEY (`mh_mus_id`)
	REFERENCES `musedmx`.`museos` (`mus_id`)
	ON DELETE CASCADE
	ON UPDATE CASCADE
--  INDEX `id_Museo` (`mh_mus_id` ASC) VISIBLE
  );
  
-- -----------------------------------------------------
-- Table `musedmx`.`red_soc`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `musedmx`.`red_soc` (
  `rds_cve_rs` INT(2) NOT NULL AUTO_INCREMENT,
  `rds_nombre` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`rds_cve_rs`)
  );

-- -----------------------------------------------------
-- Table `musedmx`.`museos_have_red_soc`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `musedmx`.`museos_have_red_soc` (
  `mhrs_cve_rs` INT(2) NOT NULL,
  `mhrs_mus_id` INT(11) NOT NULL,
  `mhrs_link` VARCHAR(256) NOT NULL,
  PRIMARY KEY (`mhrs_cve_rs`, `mhrs_mus_id`),
  CONSTRAINT `fk_red_soc_has_museos_museos1`
	FOREIGN KEY (`mhrs_mus_id`)
	REFERENCES `musedmx`.`museos` (`mus_id`)
	ON DELETE CASCADE
	ON UPDATE CASCADE,
  CONSTRAINT `fk_red_soc_has_museos_red_soc1`
	FOREIGN KEY (`mhrs_cve_rs`)
	REFERENCES `musedmx`.`red_soc` (`rds_cve_rs`)
	ON DELETE CASCADE
	ON UPDATE CASCADE
--  INDEX `fk_red_soc_has_museos_museos1_idx` (`mhrs_mus_id` ASC) VISIBLE,
--  INDEX `fk_red_soc_has_museos_red_soc1_idx` (`mhrs_cve_rs` ASC) VISIBLE
);

-- -----------------------------------------------------
-- Table `musedmx`.`favoritos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `musedmx`.`favoritos` (
  `fav_usr_correo` VARCHAR(75) NOT NULL,
  `fav_mus_id` INT(11) NOT NULL,
  PRIMARY KEY (`fav_usr_correo`, `fav_mus_id`),
  CONSTRAINT `fk_favoritos_museos1`
	FOREIGN KEY (`fav_mus_id`)
	REFERENCES `musedmx`.`museos` (`mus_id`)
	ON DELETE CASCADE
	ON UPDATE CASCADE,
  CONSTRAINT `fk_favoritos_usuarios1`
	FOREIGN KEY (`fav_usr_correo`)
	REFERENCES `musedmx`.`usuarios` (`usr_correo`)
	ON DELETE CASCADE
	ON UPDATE CASCADE
  /* INDEX `correo_Usuario` (`fav_usr_correo` ASC) VISIBLE,
  INDEX `id_Museo` (`fav_mus_id` ASC) VISIBLE */
  );

-- -----------------------------------------------------
-- Table `musedmx`.`quiero_visitar`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `musedmx`.`quiero_visitar` (
  `qv_usr_correo` VARCHAR(75) NOT NULL,
  `qv_mus_id` INT(11) NOT NULL,
  PRIMARY KEY (`qv_usr_correo`, `qv_mus_id`),
  CONSTRAINT `fk_quiero_visitar_museos1`
	FOREIGN KEY (`qv_mus_id`)
	REFERENCES `musedmx`.`museos` (`mus_id`)
	ON DELETE CASCADE
	ON UPDATE CASCADE,
  CONSTRAINT `fk_quiero_visitar_usuarios1`
	FOREIGN KEY (`qv_usr_correo`)
	REFERENCES `musedmx`.`usuarios` (`usr_correo`)
	ON DELETE CASCADE
	ON UPDATE CASCADE
--  INDEX `correo_Usuario` (`qv_usr_correo` ASC) VISIBLE,
--  INDEX `id_Museo` (`qv_mus_id` ASC) VISIBLE
  );

-- -----------------------------------------------------
-- Table `musedmx`.`visitas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `musedmx`.`visitas` (
  `vi_fechahora` DATETIME NOT NULL,
  `vi_usr_correo` VARCHAR(75) NOT NULL,
  `vi_mus_id` INT(11) NOT NULL,
  PRIMARY KEY (`vi_fechahora`, `vi_usr_correo`, `vi_mus_id`),
  CONSTRAINT `fk_visitas_museos1`
	FOREIGN KEY (`vi_mus_id`)
	REFERENCES `musedmx`.`museos` (`mus_id`)
	ON DELETE CASCADE
	ON UPDATE CASCADE,
  CONSTRAINT `fk_visitas_usuarios1`
	FOREIGN KEY (`vi_usr_correo`)
	REFERENCES `musedmx`.`usuarios` (`usr_correo`)
	ON DELETE CASCADE
	ON UPDATE CASCADE
--  INDEX `correo_Usuario` (`vi_usr_correo` ASC) VISIBLE,
--  INDEX `id_Museo` (`vi_mus_id` ASC) VISIBLE
  );

-- -----------------------------------------------------
-- Table `musedmx`.`resenia`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `musedmx`.`resenia` (
  `res_id_res` INT(11) NOT NULL AUTO_INCREMENT,
  `res_comentario` TEXT NOT NULL,
  `res_mod_correo` VARCHAR(75) NOT NULL,
  `res_aprobado` TINYINT(1) NOT NULL,
  `res_calif_estrellas` INT(1) NOT NULL,
  `visitas_vi_usr_correo` VARCHAR(75) NOT NULL,
  `visitas_vi_mus_id` INT(11) NOT NULL,
  `visitas_vi_fechahora` DATETIME NOT NULL,
  PRIMARY KEY (`res_id_res`, `res_mod_correo`, `visitas_vi_usr_correo`, `visitas_vi_mus_id`, `visitas_vi_fechahora`),
/*   CONSTRAINT `fk_resenia_museos1`
	FOREIGN KEY (`visitas_vi_mus_id`)
	REFERENCES `musedmx`.`museos` (`mus_id`)
	ON DELETE CASCADE
	ON UPDATE CASCADE,
  CONSTRAINT `fk_resenia_usuarios1`
	FOREIGN KEY (`visitas_vi_usr_correo`)
	REFERENCES `musedmx`.`usuarios` (`usr_correo`)
	ON DELETE CASCADE
	ON UPDATE CASCADE, */
  CONSTRAINT `fk_resenia_moderador1`
	FOREIGN KEY (`res_mod_correo`)
	REFERENCES `musedmx`.`moderador` (`usuarios_usr_correo`)
	ON DELETE CASCADE
	ON UPDATE CASCADE,
  CONSTRAINT `fk_resenia_visitas1`
	FOREIGN KEY (`visitas_vi_fechahora`, `visitas_vi_usr_correo`, `visitas_vi_mus_id`)
	REFERENCES `musedmx`.`visitas` (`vi_fechahora`, `vi_usr_correo`, `vi_mus_id`)
	ON DELETE CASCADE
	ON UPDATE CASCADE
--  INDEX `correo_Usuario` (`res_usr_correo` ASC) VISIBLE,
--  INDEX `correo_Moderador` (`res_mod_correo` ASC) VISIBLE,
--  INDEX `fk_resenia_visitas1_idx` (`visitas_vi_fechahora` ASC, `visitas_vi_usr_correo` ASC, `visitas_vi_mus_id` ASC) VISIBLE
  );

-- -----------------------------------------------------
-- Table `musedmx`.`foto_resenia`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `musedmx`.`foto_resenia` (
  `f_res_id` INT(11) NOT NULL AUTO_INCREMENT,
  `f_res_id_res` INT(11) NOT NULL,
  `f_res_foto` LONGBLOB NULL DEFAULT NULL,
  PRIMARY KEY (`f_res_id`, `f_res_id_res`),
  CONSTRAINT `fk_foto_resenia_resenia1`
	FOREIGN KEY (`f_res_id_res`)
	REFERENCES `musedmx`.`resenia` (`res_id_res`)
	ON DELETE CASCADE
	ON UPDATE CASCADE
--  INDEX `id_Historial` (`f_res_id_res` ASC) VISIBLE
  );

-- -----------------------------------------------------
-- Table `musedmx`.`museos_has_encuesta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `musedmx`.`museos_has_encuesta` (
  `museos_mus_id` INT(11) NOT NULL,
  `encuesta_enc_cve` INT NOT NULL,
  PRIMARY KEY (`museos_mus_id`, `encuesta_enc_cve`),
  CONSTRAINT `fk_museos_has_encuesta_museos1`
	FOREIGN KEY (`museos_mus_id`)
	REFERENCES `musedmx`.`museos` (`mus_id`)
	ON DELETE CASCADE
	ON UPDATE CASCADE,
  CONSTRAINT `fk_museos_has_encuesta_encuesta1`
	FOREIGN KEY (`encuesta_enc_cve`)
	REFERENCES `musedmx`.`encuesta` (`enc_cve`)
	ON DELETE CASCADE
	ON UPDATE CASCADE
--  INDEX `fk_museos_has_servicios_servicios1_idx` (`servicios_ser_cve` ASC) VISIBLE,
--  INDEX `fk_museos_has_servicios_museos1_idx` (`museos_mus_id` ASC) VISIBLE
  );

-- -----------------------------------------------------
-- Table `musedmx`.`encuesta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `musedmx`.`encuesta` (
  `enc_cve` INT NOT NULL AUTO_INCREMENT,
  `enc_nom` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`enc_cve`)
  );

-- -----------------------------------------------------
-- Table `musedmx`.`preguntas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `musedmx`.`preguntas` (
  `preg_id` INT NOT NULL,
  `pregunta` VARCHAR(45) NOT NULL,
  `encuesta_enc_cve` INT NOT NULL,
  PRIMARY KEY (`preg_id`, `encuesta_enc_cve`),
  CONSTRAINT `fk_preguntas_encuesta1`
    FOREIGN KEY (`encuesta_enc_cve`)
    REFERENCES `musedmx`.`encuesta` (`enc_cve`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
--  INDEX `fk_preguntas_encuesta1_idx` (`encuesta_enc_cve` ASC) VISIBLE
  );

-- -----------------------------------------------------
-- Table `musedmx`.`respuestas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `musedmx`.`respuestas` (
  `res_id` INT NOT NULL,
  `res_respuesta` ENUM('0', '1', '2', '3', '4', '5') NOT NULL,
  `preguntas_preg_id` INT NOT NULL,
  `preguntas_encuesta_enc_cve` INT NOT NULL,
  PRIMARY KEY (`res_id`, `preguntas_preg_id`, `preguntas_encuesta_enc_cve`),
  CONSTRAINT `fk_respuestas_preguntas1`
	FOREIGN KEY (`preguntas_preg_id`, `preguntas_encuesta_enc_cve`)
	REFERENCES `musedmx`.`preguntas` (`preg_id`, `encuesta_enc_cve`)
	ON DELETE CASCADE
	ON UPDATE CASCADE
--  INDEX `fk_respuestas_preguntas1_idx` (`preguntas_preg_id` ASC, `preguntas_encuesta_enc_cve` ASC) VISIBLE
);

-- -----------------------------------------------------
-- Table `musedmx`.`calificaciones`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `musedmx`.`calificaciones` (
  `visitas_vi_fechahora` DATETIME NOT NULL,
  `visitas_vi_usr_correo` VARCHAR(75) NOT NULL,
  `visitas_vi_mus_id` INT(11) NOT NULL,
  `respuestas_res_id` INT(11) NOT NULL,
  `respuestas_preguntas_preg_id` INT NOT NULL,
  `respuestas_preguntas_encuesta_enc_cve` INT NOT NULL,
  PRIMARY KEY (`visitas_vi_fechahora`, `visitas_vi_usr_correo`, `visitas_vi_mus_id`, `respuestas_res_id`, `respuestas_preguntas_preg_id`, `respuestas_preguntas_encuesta_enc_cve`),
  CONSTRAINT `fk_calificaciones_visitas1`
	FOREIGN KEY (`visitas_vi_fechahora`, `visitas_vi_usr_correo`, `visitas_vi_mus_id`)
	REFERENCES `musedmx`.`visitas` (`vi_fechahora`, `vi_usr_correo`, `vi_mus_id`)
	ON DELETE CASCADE
	ON UPDATE CASCADE,
  CONSTRAINT `fk_calificaciones_respuesta1`
	FOREIGN KEY (`respuestas_res_id`, `respuestas_preguntas_preg_id`, `respuestas_preguntas_encuesta_enc_cve`)
	REFERENCES `musedmx`.`respuesta` (`res_id`, `preguntas_preg_id`, `preguntas_encuesta_enc_cve`)
	ON DELETE CASCADE
	ON UPDATE CASCADE
  );

-- -----------------------------------------------------
-- Table `musedmx`.`usuarios_has_tematicas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `musedmx`.`usuarios_has_tematicas` (
  `usuarios_usr_correo` VARCHAR(75) NOT NULL,
  `tematicas_tm_nombre` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`usuarios_usr_correo`, `tematicas_tm_nombre`),
  CONSTRAINT `fk_usuarios_has_tematicas_tematicas1`
	FOREIGN KEY (`tematicas_tm_nombre`)
	REFERENCES `musedmx`.`tematicas` (`tm_nombre`)
	ON DELETE CASCADE
	ON UPDATE CASCADE,
  CONSTRAINT `fk_usuarios_has_tematicas_usuarios1`
	FOREIGN KEY (`usuarios_usr_correo`)
	REFERENCES `musedmx`.`usuarios` (`usr_correo`)
	ON DELETE CASCADE
	ON UPDATE CASCADE
--  INDEX `fk_usuarios_has_tematicas_tematicas1_idx` (`tematicas_tm_nombre` ASC) VISIBLE,
--  INDEX `fk_usuarios_has_tematicas_usuarios1_idx` (`usuarios_usr_correo` ASC) VISIBLE
  );

-- -----------------------------------------------------
-- Table `musedmx`.`tematicas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `musedmx`.`tematicas` (
  `tm_nombre` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`tm_nombre`)
  );

-- -----------------------------------------------------
-- Table `musedmx`.`museos_has_servicios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `musedmx`.`museos_has_servicios` (
  `museos_mus_id` INT(11) NOT NULL,
  `servicios_ser_id` INT NOT NULL,
  PRIMARY KEY (`museos_mus_id`, `servicios_ser_id`),
  CONSTRAINT `fk_museos_has_servicios_museos1`
	FOREIGN KEY (`museos_mus_id`)
	REFERENCES `musedmx`.`museos` (`mus_id`)
	ON DELETE CASCADE
	ON UPDATE CASCADE,
  CONSTRAINT `fk_museos_has_servicios_servicios1`
	FOREIGN KEY (`servicios_ser_id`)
	REFERENCES `musedmx`.`servicios` (`ser_id`)
	ON DELETE CASCADE
	ON UPDATE CASCADE
	);

-- -----------------------------------------------------
-- Table `musedmx`.`servicios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `musedmx`.`servicios` (
  `ser_id` INT NOT NULL AUTO_INCREMENT,
  `ser_nombre` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`ser_id`)
  );

select * from museos where mus_nombre = "Herbario Medicinal del IMSS";

show VARIABLES LIKE 'max_allowed_packet';