CREATE DATABASE IF NOT EXISTS `musedmx` DEFAULT CHARACTER SET latin1 ;
USE `musedmx`;
-- DROP DATABASE `musedmx`;

-----------------------------------------------------
-- Table `musedmx`.`usuarios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `musedmx`.`usuarios` (
  `usr_correo` VARCHAR(75) NOT NULL,
  `usr_nombre` VARCHAR(60) NOT NULL,
  `usr_ap_paterno` VARCHAR(30) NOT NULL,
  `usr_ap_materno` VARCHAR(30) NULL DEFAULT NULL,
  `usr_contrasenia` VARCHAR(256) NOT NULL,
  `usr_fecha_nac` DATE NOT NULL,
  `usr_telefono` VARCHAR(15) NULL DEFAULT NULL,
  `usr_foto` VARCHAR(300) NULL DEFAULT NULL,
  `usr_tipo` TINYINT(1) NOT NULL,
  `usr_verificado` TINYINT(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`usr_correo`)
-- UNIQUE INDEX `correo` (`usr_correo` ASC) VISIBLE
  ) ENGINE=InnoDB;
  
-- INSERT INTO musedmx.usuarios 
-- (usr_correo, usr_nombre, usr_ap_paterno, usr_ap_materno, usr_contrasenia, usr_fecha_nac, usr_telefono, usr_foto, usr_tipo, usr_verificado)
-- VALUES
-- ('admin@musedmx.com', 'Admin', 'Sistema', 'MuseDMX', '$2a$12$.XBh/8KCrhawxxq/mE9Lpe9AL.WxTauVT59hHaPZfyfSFZ1vD0Sc6', '2002-09-30', "+525527167255", NULL, 2, 1);

-- INSERT INTO musedmx.usuarios 
-- (usr_correo, usr_nombre, usr_ap_paterno, usr_ap_materno, usr_contrasenia, usr_fecha_nac, usr_telefono, usr_foto, usr_tipo, usr_verificado)
-- VALUES
-- ('mod@musedmx.com', 'Mod', 'Sistema', 'MuseDMX', '$2a$12$.XBh/8KCrhawxxq/mE9Lpe9AL.WxTauVT59hHaPZfyfSFZ1vD0Sc6', '2000-04-02', "+525531933874", NULL, 3,1);

SELECT * FROM usuarios;
DELETE FROM usuarios WHERE usr_correo = "gusester2002@gmail.com";

-- -----------------------------------------------------
-- Table `musedmx`.`otp`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `musedmx`.`otp` (
  `otp_usr_correo` VARCHAR(75) NOT NULL,
  `otp_codigo` VARCHAR(6) NOT NULL,
  `otp_creado_en` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`otp_usr_correo`),
  CONSTRAINT `fk_otp_usuarios` 
	FOREIGN KEY(`otp_usr_correo`)
	REFERENCES `musedmx`.`usuarios` (`usr_correo`)
	ON DELETE CASCADE
	ON UPDATE CASCADE
) ENGINE=InnoDB;

SELECT * FROM otp;

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
    ON UPDATE CASCADE
	) ENGINE=InnoDB;
    
SELECT * FROM administrador;
-- -----------------------------------------------------
-- Trigger para cuando se inserte un nuevo usuario en usuarios con tipo 2, se inserte en administrador
-- -----------------------------------------------------
DELIMITER //
CREATE TRIGGER `musedmx`.`trg_insert_administrador` AFTER INSERT ON `musedmx`.`usuarios` FOR EACH ROW
BEGIN
  IF NEW.usr_tipo = 2 THEN
    INSERT INTO musedmx.administrador (usuarios_usr_correo) VALUES (NEW.usr_correo);
  END IF;
END;
//
DELIMITER ;

-- -----------------------------------------------------
-- Trigger para cuando cambie el tipo de usuario a tipo 2, se inserte en administrador
-- -----------------------------------------------------
DELIMITER //
CREATE TRIGGER `musedmx`.`trg_update_administrador` AFTER UPDATE ON `musedmx`.`usuarios` FOR EACH ROW
BEGIN
  IF NEW.usr_tipo = 2 THEN
    -- Solo inserta si no existe
    IF NOT EXISTS (SELECT 1 FROM administrador WHERE usuarios_usr_correo = NEW.usr_correo) THEN
      INSERT INTO administrador (usuarios_usr_correo) VALUES (NEW.usr_correo);
    END IF;
  ELSE
    -- Opcional: si tipo cambió a diferente de 2, eliminar de administrador
    DELETE FROM administrador WHERE usuarios_usr_correo = NEW.usr_correo;
  END IF;
END;
//
DELIMITER ;


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
    ON UPDATE CASCADE
	) ENGINE=InnoDB;
    
SELECT * FROM moderador;

-- -----------------------------------------------------
-- Trigger para cuando se inserte un nuevo usuario en usuarios con tipo 3, se inserte en moderador
-- -----------------------------------------------------
DELIMITER //
CREATE TRIGGER `musedmx`.`trg_insert_moderador` AFTER INSERT ON `musedmx`.`usuarios` FOR EACH ROW
BEGIN
  IF NEW.usr_tipo = 3 THEN
    INSERT INTO `musedmx`.`moderador` (usuarios_usr_correo) VALUES (NEW.usr_correo);
  END IF;
END;
//
DELIMITER ;

-- -----------------------------------------------------
-- Trigger para cuando cambie el tipo de usuario a tipo 3, se inserte en moderador
-- -----------------------------------------------------
DELIMITER //
CREATE TRIGGER `musedmx`.`trg_update_moderador` AFTER UPDATE ON `musedmx`.`usuarios` FOR EACH ROW
BEGIN
  IF NEW.usr_tipo = 3 THEN
    IF NOT EXISTS (SELECT 1 FROM moderador WHERE usuarios_usr_correo = NEW.usr_correo) THEN
      INSERT INTO moderador (usuarios_usr_correo) VALUES (NEW.usr_correo);
    END IF;
  ELSE
    -- Opcional: eliminar si tipo cambió a distinto de 3
    DELETE FROM moderador WHERE usuarios_usr_correo = NEW.usr_correo;
  END IF;
END;
//
DELIMITER ;

-- -----------------------------------------------------
-- Table `musedmx`.`auditorias`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `musedmx`.`auditorias` (
  `audit_id` INT(11) NOT NULL AUTO_INCREMENT,
  `audit_tipo_cambio` ENUM('Insert', 'Update', 'Delete') NOT NULL,
  `audit_fecha` DATETIME NOT NULL,
  `administrador_usuarios_usr_correo` VARCHAR(75) NULL,
  `moderador_usuarios_usr_correo` VARCHAR(75) NULL,
  `audit_datos_anteriores` TEXT NULL DEFAULT NULL,
  `audit_datos_nuevos` TEXT NULL DEFAULT NULL,
  PRIMARY KEY (`audit_id`),
  CONSTRAINT `fk_auditorias_administrador1`
    FOREIGN KEY (`administrador_usuarios_usr_correo`)
    REFERENCES `musedmx`.`administrador` (`usuarios_usr_correo`)
    ON UPDATE CASCADE,
  CONSTRAINT `fk_auditorias_moderador1`
    FOREIGN KEY (`moderador_usuarios_usr_correo`)
    REFERENCES `musedmx`.`moderador` (`usuarios_usr_correo`)
    ON UPDATE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `musedmx`.`museos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `musedmx`.`museos` (
  `mus_id` INT(11) NOT NULL AUTO_INCREMENT,
  `mus_nombre` VARCHAR(255) NOT NULL,
  `mus_calle` VARCHAR(255) NOT NULL,
  `mus_num_ext` VARCHAR(10) NOT NULL,
  `mus_colonia` VARCHAR(255) NOT NULL,
  `mus_cp` VARCHAR(5) NOT NULL,
  `mus_alcaldia` VARCHAR(100) NOT NULL,
  `mus_descripcion` TEXT NOT NULL,
  `mus_fec_ap` DATE NOT NULL,
  `mus_tematica` ENUM('0', '1', '2', '3', '4', '5', '6', '7') NOT NULL,
  `mus_foto` VARCHAR(300) NULL DEFAULT NULL,
  `mus_g_longitud` DOUBLE NULL DEFAULT NULL,
  `mus_g_latitud` DOUBLE NULL DEFAULT NULL,
  PRIMARY KEY (`mus_id`)
-- INDEX `mus_id` (`mus_id` ASC) VISIBLE
  ) ENGINE=InnoDB;

SELECT * FROM museos;
-- -----------------------------------------------------
-- Triggers para cuando se hagan cambios en la tabla museos, se inserte en auditorias
-- -----------------------------------------------------
DELIMITER //
CREATE TRIGGER `musedmx`.`trg_insert_auditoria` 
AFTER INSERT ON `musedmx`.`museos` 
FOR EACH ROW
BEGIN
  INSERT INTO `musedmx`.`auditorias` (
	  audit_tipo_cambio, 
	  audit_fecha, 
	  administrador_usuarios_usr_correo, 
	  moderador_usuarios_usr_correo, 
	  audit_datos_anteriores, 
	  audit_datos_nuevos
  ) 
  VALUES (
	  'Insert', 
	  NOW(), 
	  IF(LOCATE('@admin', @usuario_actual), @usuario_actual, NULL),
	  IF(LOCATE('@mod', @usuario_actual), @usuario_actual, NULL),
	  NULL, 
	  CONCAT('ID: ', NEW.mus_id, ', Nombre: ', NEW.mus_nombre, ', Calle: ', NEW.mus_calle, ', Num Ext: ', NEW.mus_num_ext, ', Colonia: ', NEW.mus_colonia, ', CP: ', NEW.mus_cp, ', Alcaldia: ', NEW.mus_alcaldia, ', Descripcion: ', NEW.mus_descripcion, ', Fecha Apertura: ', NEW.mus_fec_ap, ', Tematica: ', NEW.mus_tematica, ', Longitud: ', NEW.mus_g_longitud, ', Latitud: ', NEW.mus_g_latitud)
  );
END;
//
DELIMITER ;

DELIMITER //
CREATE TRIGGER `musedmx`.`trg_update_auditoria` 
AFTER UPDATE ON `musedmx`.`museos` 
FOR EACH ROW
BEGIN
  INSERT INTO `musedmx`.`auditorias` (
	  audit_tipo_cambio, 
	  audit_fecha, 
	  administrador_usuarios_usr_correo, 
	  moderador_usuarios_usr_correo, 
	  audit_datos_anteriores, 
	  audit_datos_nuevos
  ) 
  VALUES (
	  'Update', 
	  NOW(), 
	  IF(LOCATE('@admin', @usuario_actual), @usuario_actual, NULL),
	  IF(LOCATE('@mod', @usuario_actual), @usuario_actual, NULL), 
	  CONCAT('ID: ', OLD.mus_id, ', Nombre: ', OLD.mus_nombre, ', Calle: ', OLD.mus_calle, ', Num Ext: ', OLD.mus_num_ext, ', Colonia: ', OLD.mus_colonia, ', CP: ', OLD.mus_cp, ', Alcaldia: ', OLD.mus_alcaldia, ', Descripcion: ', OLD.mus_descripcion, ', Fecha Apertura: ', OLD.mus_fec_ap, ', Tematica: ', OLD.mus_tematica, ', Longitud: ', OLD.mus_g_longitud, ', Latitud: ', OLD.mus_g_latitud), 
	  CONCAT('ID: ', NEW.mus_id, ', Nombre: ', NEW.mus_nombre, ', Calle: ', NEW.mus_calle, ', Num Ext: ', NEW.mus_num_ext, ', Colonia: ', NEW.mus_colonia, ', CP: ', NEW.mus_cp, ', Alcaldia: ', NEW.mus_alcaldia, ', Descripcion: ', NEW.mus_descripcion, ', Fecha Apertura: ', NEW.mus_fec_ap, ', Tematica: ', NEW.mus_tematica,', Longitud: ' ,NEW.mus_g_longitud,', Latitud:',NEW.mus_g_latitud)
  );
END;
//
DELIMITER ;

DELIMITER //
CREATE TRIGGER `musedmx`.`trg_delete_auditoria` 
AFTER DELETE ON `musedmx`.`museos` 
FOR EACH ROW
BEGIN
  INSERT INTO `musedmx`.`auditorias` (
	  audit_tipo_cambio,
	  audit_fecha, 
	  administrador_usuarios_usr_correo, 
	  moderador_usuarios_usr_correo, 
	  audit_datos_anteriores, 
	  audit_datos_nuevos
  ) 
  VALUES (
	  'Delete', 
	  NOW(), 
	  IF(LOCATE('@admin', @usuario_actual), @usuario_actual, NULL),
	  IF(LOCATE('@mod', @usuario_actual), @usuario_actual, NULL), 
	  CONCAT('ID: ', OLD.mus_id, ', Nombre: ', OLD.mus_nombre, ', Calle: ', OLD.mus_calle, ', Num Ext: ', OLD.mus_num_ext, ', Colonia: ', OLD.mus_colonia, ', CP: ', OLD.mus_cp, ', Alcaldia: ', OLD.mus_alcaldia, ', Descripcion: ', OLD.mus_descripcion, ', Fecha Apertura: ', OLD.mus_fec_ap, ', Tematica: ', OLD.mus_tematica,', Longitud:',OLD.mus_g_longitud,', Latitud:',OLD.mus_g_latitud), 
	  NULL
  );
END;
//
DELIMITER ;
  
  SELECT * FROM museos;
  DELETE FROM museos WHERE mus_id = 2435;

-- -----------------------------------------------------
-- Table `musedmx`.`galeria`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `musedmx`.`galeria` (
  `gal_foto_id` INT(11) NOT NULL AUTO_INCREMENT,
  `gal_mus_id` INT(11) NOT NULL,
  `gal_foto` VARCHAR(300) NOT NULL,
  PRIMARY KEY (`gal_foto_id`, `gal_mus_id`),
  CONSTRAINT `fk_galeria_museos1`
	  FOREIGN KEY (`gal_mus_id`)
	  REFERENCES `musedmx`.`museos` (`mus_id`)
	  ON DELETE CASCADE
	  ON UPDATE CASCADE
--  INDEX `id_Museo` (`gal_mus_id` ASC) VISIBLE
  ) ENGINE=InnoDB;

SELECT * FROM galeria;

-- -----------------------------------------------------
-- Table `musedmx`.`horarios_precios_museo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `musedmx`.`horarios_precios_museo` (
  `mh_id` INT(11) NOT NULL AUTO_INCREMENT,
  `mh_mus_id` INT(11) NOT NULL,
  `mh_dia` SET('Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo') NOT NULL,
  `mh_hora_inicio` TIME NOT NULL,
  `mh_hora_fin` TIME NOT NULL,
  `mh_precio_ad` VARCHAR(4) NOT NULL,
  `mh_precio_ni` VARCHAR(4) NOT NULL,
  `mh_precio_ter` VARCHAR(4) NOT NULL,
  `mh_precio_est` VARCHAR(4) NOT NULL,
  PRIMARY KEY (`mh_id`, `mh_mus_id`),
  CONSTRAINT `fk_horarios_precios_museo_museos1`
    FOREIGN KEY (`mh_mus_id`)
	    REFERENCES `musedmx`.`museos` (`mus_id`)
	    ON DELETE CASCADE
	    ON UPDATE CASCADE
--  INDEX `id_Museo` (`mh_mus_id` ASC) VISIBLE
  ) ENGINE=InnoDB;

-- DROP TABLE horarios_precios_museo;
select * from horarios_precios_museo where mh_mus_id = 375;
  
-- -----------------------------------------------------
-- Table `musedmx`.`red_soc`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `musedmx`.`red_soc` (
  `rds_cve_rs` INT(2) NOT NULL AUTO_INCREMENT,
  `rds_nombre` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`rds_cve_rs`)
  ) ENGINE=InnoDB;
  
-- TRUNCATE TABLE red_soc;
-- TRUNCATE TABLE museos_have_red_soc;

-- -----------------------------------------------------
-- Table `musedmx`.`museos_have_red_soc`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `musedmx`.`museos_have_red_soc` (
  `mhrs_id` INT NOT NULL AUTO_INCREMENT,
  `mhrs_cve_rs` INT(2) NOT NULL,
  `mhrs_mus_id` INT(11) NOT NULL,
  `mhrs_link` VARCHAR(300) NOT NULL,
  PRIMARY KEY (`mhrs_id`),
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
) ENGINE=InnoDB;

select * from museos_have_red_soc where mhrs_mus_id = 2447;

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
  ) ENGINE=InnoDB;
  
  SELECT * FROM favoritos WHERE fav_usr_correo = "gusester2002@gmail.com";
  DELETE FROM favoritos WHERE fav_usr_correo = "gusester2002@gmail.com";

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
  ) ENGINE=InnoDB;

SELECT * FROM quiero_visitar WHERE qv_usr_correo = "gusester2002@gmail.com";

-----------------------------------------------------
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
  ) ENGINE=InnoDB;

SELECT * FROM visitas WHERE vi_mus_id = 673 AND vi_usr_correo = "narguello@example.com";
-- DELETE FROM visitas WHERE vi_mus_id = 606 AND vi_usr_correo = "narguello@example.com";
-- -----------------------------------------------------
-- Table `musedmx`.`resenia`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `musedmx`.`resenia` (
  `res_id_res` INT(11) NOT NULL AUTO_INCREMENT,
  `res_comentario` TEXT NOT NULL,
  `res_foto_entrada` VARCHAR(300) NULL DEFAULT NULL,
  `res_mod_correo` VARCHAR(75) NULL DEFAULT NULL,
  `res_aprobado` TINYINT(1) NOT NULL DEFAULT '0',
  `res_calif_estrellas` INT(1) NOT NULL,
  `visitas_vi_usr_correo` VARCHAR(75) NOT NULL,
  `visitas_vi_mus_id` INT(11) NOT NULL,
  `visitas_vi_fechahora` DATETIME NOT NULL,
  PRIMARY KEY (`res_id_res`, `visitas_vi_usr_correo`, `visitas_vi_mus_id`, `visitas_vi_fechahora`),
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
  ) ENGINE=InnoDB;
  
 SELECT * FROM resenia WHERE visitas_vi_usr_correo = "gusester2002@gmail.com";
 UPDATE resenia SET res_aprobado = 1 WHERE res_id_res = 612;
-- TRUNCATE TABLE resenia;

-- -----------------------------------------------------
-- Table `musedmx`.`foto_resenia`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `musedmx`.`foto_resenia` (
  `f_res_id` INT(11) NOT NULL AUTO_INCREMENT,
  `f_res_id_res` INT(11) NOT NULL,
  `f_res_foto` VARCHAR(300) NULL DEFAULT NULL,
  PRIMARY KEY (`f_res_id`, `f_res_id_res`),
  CONSTRAINT `fk_foto_resenia_resenia1`
	  FOREIGN KEY (`f_res_id_res`)
	  REFERENCES `musedmx`.`resenia` (`res_id_res`)
	  ON DELETE CASCADE
	  ON UPDATE CASCADE
--  INDEX `id_Historial` (`f_res_id_res` ASC) VISIBLE
  ) ENGINE=InnoDB;

-- TRUNCATE TABLE foto_resenia;
SELECT * FROM foto_resenia WHERE f_res_id_res = 602 ;

-- -----------------------------------------------------
-- Table `musedmx`.`encuesta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `musedmx`.`encuesta` (
  `enc_cve` INT NOT NULL AUTO_INCREMENT,
  `enc_nom` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`enc_cve`)
  ) ENGINE=InnoDB;
  
-- DROP TABLE encuesta;
SELECT * FROM encuesta;

-- -----------------------------------------------------
-- Table `musedmx`.`museos_have_encuesta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `musedmx`.`museos_have_encuesta` (
  `museos_mus_id` INT(11) NOT NULL,
  `encuesta_enc_cve` INT NOT NULL,
  PRIMARY KEY (`museos_mus_id`, `encuesta_enc_cve`),
  CONSTRAINT `fk_museos_have_encuesta_museos1`
	  FOREIGN KEY (`museos_mus_id`)
	  REFERENCES `musedmx`.`museos` (`mus_id`)
	  ON DELETE CASCADE
	  ON UPDATE CASCADE,
  CONSTRAINT `fk_museos_have_encuesta_encuesta1`
	  FOREIGN KEY (`encuesta_enc_cve`)
	  REFERENCES `musedmx`.`encuesta` (`enc_cve`)
	  ON DELETE CASCADE
	  ON UPDATE CASCADE
--  INDEX `fk_museos_have_servicios_servicios1_idx` (`servicios_ser_cve` ASC) VISIBLE,
--  INDEX `fk_museos_have_servicios_museos1_idx` (`museos_mus_id` ASC) VISIBLE
  ) ENGINE=InnoDB;
  
  -- DROP TABLE museos_have_encuesta;
SELECT * FROM museos_have_encuesta;

-- -----------------------------------------------------
-- Table `musedmx`.`preguntas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `musedmx`.`preguntas` (
  `preg_id` INT NOT NULL AUTO_INCREMENT,
  `pregunta` VARCHAR(255) NOT NULL,
  `encuesta_enc_cve` INT NOT NULL,
  PRIMARY KEY (`preg_id`, `encuesta_enc_cve`),
  CONSTRAINT `fk_preguntas_encuesta1`
    FOREIGN KEY (`encuesta_enc_cve`)
    REFERENCES `musedmx`.`encuesta` (`enc_cve`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
--  INDEX `fk_preguntas_encuesta1_idx` (`encuesta_enc_cve` ASC) VISIBLE
  ) ENGINE=InnoDB;
  
-- DROP TABLE preguntas;
SELECT * FROM preguntas;
  
-- -----------------------------------------------------
-- Table `musedmx`.`servicios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `musedmx`.`servicios` (
  `ser_id` INT NOT NULL AUTO_INCREMENT,
  `ser_nombre` VARCHAR(100) NOT NULL,
  
  PRIMARY KEY (`ser_id`)
  ) ENGINE=InnoDB;
  
-- DROP TABLE servicios; 
SELECT * FROM servicios;

-- -----------------------------------------------------
-- Table `musedmx`.`respuestas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `musedmx`.`respuestas_encuesta` (
  `res_id` INT NOT NULL AUTO_INCREMENT,
  `res_respuesta` ENUM('0', '1', '2', '3', '4', '5') NOT NULL,
  `preguntas_preg_id` INT NOT NULL,
  `preguntas_encuesta_enc_cve` INT NOT NULL,
  `visitas_vi_usr_correo` VARCHAR(75) NOT NULL,
  `visitas_vi_mus_id` INT(11) NOT NULL,
  PRIMARY KEY (`res_id`), 
  CONSTRAINT `fk_respuestas_preguntas1`
    FOREIGN KEY (`preguntas_preg_id`, `preguntas_encuesta_enc_cve`)
    REFERENCES `musedmx`.`preguntas` (`preg_id`, `encuesta_enc_cve`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB;

SELECT * FROM respuestas_encuesta WHERE visitas_vi_usr_correo = "narguello@example.com" AND visitas_vi_mus_id = 673;

CREATE TABLE IF NOT EXISTS `musedmx`.`respuestas_servicios` (
  `visitas_vi_usr_correo` VARCHAR(75) NOT NULL,
  `visitas_vi_mus_id` INT(11) NOT NULL,
  `servicios_ser_id` INT NOT NULL,
  PRIMARY KEY (`visitas_vi_usr_correo`, `visitas_vi_mus_id`, `servicios_ser_id`),
  CONSTRAINT `fk_ers_servicios`
    FOREIGN KEY (`servicios_ser_id`)
    REFERENCES `musedmx`.`servicios` (`ser_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB;

SELECT * FROM respuestas_servicios;
  -- -----------------------------------------------------
-- Table `musedmx`.`tematicas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `musedmx`.`tematicas` (
  `tm_nombre` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`tm_nombre`)
  ) ENGINE=InnoDB;

SELECT * FROM tematicas;

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
  ) ENGINE=InnoDB;

SELECT * FROM usuarios_has_tematicas;
show VARIABLES LIKE 'max_allowed_packet';
SHOW ENGINE INNODB STATUS;