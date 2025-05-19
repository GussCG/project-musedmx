import csv
import os
import random
from datetime import datetime, timedelta
import mysql.connector
from dotenv import load_dotenv

# Cargar variables de entorno desde .env (configura tu .env con DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT)
load_dotenv(dotenv_path="../.env")

DB_HOST = os.getenv("DB_HOST")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")
DB_PORT = int(os.getenv("DB_PORT"))

# Datos de prueba para las reseñas
moderadores = ["mod1@museos.com", "mod2@museos.com"]
usuarios = ["usuario1@correo.com", "usuario2@correo.com"]
museos = [2236, 2311, 768]
comentarios = [
    "Una experiencia increíble.",
    "Muy informativo y bien organizado.",
    "El museo estaba cerrado sin aviso.",
    "Volvería sin duda, excelente guía.",
    "Falta más interacción para los niños."
]

# Nombre del archivo CSV a generar
csv_path = "resenas_prueba.csv"

# Generar CSV con reseñas de prueba
num_resenas = 10
with open(csv_path, mode="w", newline="", encoding="utf-8") as csvfile:
    fieldnames = [
        "res_comentario",
        "res_mod_correo",
        "res_aprobado",
        "res_calif_estrellas",
        "visitas_vi_usr_correo",
        "visitas_vi_mus_id",
        "visitas_vi_fechahora"
    ]
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    writer.writeheader()

    for _ in range(num_resenas):
        comentario = random.choice(comentarios)
        mod_correo = random.choice(moderadores)
        usr_correo = random.choice(usuarios)
        mus_id = random.choice(museos)
        fecha = datetime.now() - timedelta(days=random.randint(1, 365))
        fecha_str = fecha.strftime("%Y-%m-%d %H:%M:%S")
        estrellas = random.randint(1, 5)
        aprobado = random.choice([0, 1])

        writer.writerow({
            "res_comentario": comentario,
            "res_mod_correo": mod_correo,
            "res_aprobado": aprobado,
            "res_calif_estrellas": estrellas,
            "visitas_vi_usr_correo": usr_correo,
            "visitas_vi_mus_id": mus_id,
            "visitas_vi_fechahora": fecha_str
        })

print(f"Archivo CSV '{csv_path}' generado.")

# Conectarse a la base de datos MySQL
conn = mysql.connector.connect(
    host=DB_HOST,
    port=DB_PORT,
    user=DB_USER,
    password=DB_PASSWORD,
    database=DB_NAME
)
cursor = conn.cursor()

# Insertar las reseñas desde el CSV
with open(csv_path, mode="r", encoding="utf-8") as csvfile:
    reader = csv.DictReader(csvfile)
    insert_query = """
        INSERT INTO resenia (
            res_comentario,
            res_mod_correo,
            res_aprobado,
            res_calif_estrellas,
            visitas_vi_usr_correo,
            visitas_vi_mus_id,
            visitas_vi_fechahora
        ) VALUES (%s, %s, %s, %s, %s, %s, %s)
    """

    for row in reader:
        data = (
            row["res_comentario"],
            row["res_mod_correo"],
            int(row["res_aprobado"]),
            int(row["res_calif_estrellas"]),
            row["visitas_vi_usr_correo"],
            int(row["visitas_vi_mus_id"]),
            row["visitas_vi_fechahora"]
        )
        try:
            cursor.execute(insert_query, data)
            print(f"Insertada reseña de usuario {row['visitas_vi_usr_correo']} para museo {row['visitas_vi_mus_id']}")
        except mysql.connector.Error as err:
            print(f"Error insertando reseña: {err}")

conn.commit()

cursor.close()
conn.close()
print("Conexión cerrada. Proceso finalizado.")
