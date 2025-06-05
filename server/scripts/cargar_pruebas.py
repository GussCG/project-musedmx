import csv
import os
import mysql.connector
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv(dotenv_path="../.env")

DB_HOST = os.getenv("DB_HOST")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")
DB_PORT = int(os.getenv("DB_PORT"))

# Conexión a la base de datos
conn = mysql.connector.connect(
    host=DB_HOST,
    port=DB_PORT,
    user=DB_USER,
    password=DB_PASSWORD,
    database=DB_NAME
)
cursor = conn.cursor()

def cargar_csv_a_tabla(nombre_archivo, consulta_sql, columnas):
    print(f"Cargando {nombre_archivo} ...")
    with open(nombre_archivo, encoding="utf-8") as archivo:
        reader = csv.DictReader(archivo)
        for fila in reader:
            try:
                valores = tuple(fila[col] for col in columnas)
                cursor.execute(consulta_sql, valores)
            except Exception as e:
                print(f"Error cargando fila {fila}: {e}")

# Usuarios (incluye usr_verificado)
cargar_csv_a_tabla(
    "./csvpruebas/usuarios.csv",
    "INSERT INTO usuarios (usr_correo, usr_nombre, usr_ap_paterno, usr_ap_materno, usr_contrasenia, usr_fecha_nac, usr_telefono, usr_foto, usr_tipo, usr_verificado) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
    ["usr_correo", "usr_nombre", "usr_ap_paterno", "usr_ap_materno", "usr_contrasenia", "usr_fecha_nac", "usr_telefono", "usr_foto", "usr_tipo", "usr_verificado"]
)

# Usuarios_has_tematicas
cargar_csv_a_tabla(
    "./csvpruebas/usuarios_has_tematicas.csv",
    "INSERT INTO usuarios_has_tematicas (usuarios_usr_correo, tematicas_tm_nombre) VALUES (%s, %s)",
    ["usuarios_usr_correo", "tematicas_tm_nombre"]
)

# Visitas
cargar_csv_a_tabla(
    "./csvpruebas/visitas.csv",
    "INSERT INTO visitas (vi_fechahora, vi_usr_correo, vi_mus_id) VALUES (%s, %s, %s)",
    ["vi_fechahora", "vi_usr_correo", "vi_mus_id"]
)

# Respuestas Encuesta
cargar_csv_a_tabla(
    "./csvpruebas/respuestas_encuesta.csv",
    "INSERT INTO respuestas_encuesta (res_id, res_respuesta, visitas_vi_usr_correo, visitas_vi_mus_id, preguntas_preg_id, preguntas_encuesta_enc_cve) VALUES (%s, %s, %s, %s, %s, %s)",
    ["res_id", "res_respuesta", "usr_correo", "mus_id", "preguntas_preg_id", "encuesta_enc_cve"]
)

# Respuestas_servicios
cargar_csv_a_tabla(
    "./csvpruebas/respuestas_servicios.csv",
    "INSERT INTO respuestas_servicios (visitas_vi_usr_correo, visitas_vi_mus_id, servicios_ser_id) VALUES (%s, %s, %s)",
    ["visitas_vi_usr_correo", "visitas_vi_mus_id", "servicios_ser_id"]
)

# Reseña
cargar_csv_a_tabla(
    "./csvpruebas/resenia.csv",
    """INSERT INTO resenia (
        res_id_res, res_comentario, res_mod_correo, res_aprobado, res_calif_estrellas,
        visitas_vi_usr_correo, visitas_vi_mus_id, visitas_vi_fechahora
    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)""",
    ["res_id_res", "res_comentario", "res_mod_correo", "res_aprobado", "res_calif_estrellas",
     "visitas_vi_usr_correo", "visitas_vi_mus_id", "visitas_vi_fechahora"]
)

# 🚫 Foto Reseña - Eliminado completamente

# Quiero visitar
cargar_csv_a_tabla(
    "./csvpruebas/quiero_visitar.csv",
    "INSERT INTO quiero_visitar (qv_usr_correo, qv_mus_id) VALUES (%s, %s)",
    ["qv_usr_correo", "qv_mus_id"]
)

# Favoritos
cargar_csv_a_tabla(
    "./csvpruebas/favoritos.csv",
    "INSERT INTO favoritos (fav_usr_correo, fav_mus_id) VALUES (%s, %s)",
    ["fav_usr_correo", "fav_mus_id"]
)

conn.commit()
print("✅ Datos cargados correctamente.")

cursor.close()
conn.close()
