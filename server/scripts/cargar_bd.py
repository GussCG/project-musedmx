# Librerias
import csv
import os
import mysql.connector
from dotenv import load_dotenv

# Cargar .env
load_dotenv(dotenv_path="../.env")

# Leemos las variables de entorno
DB_HOST = os.getenv("DB_HOST")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")
DB_PORT =int(os.getenv("DB_PORT"))

# Conectamos a la base de datos
conn = mysql.connector.connect(
    host=DB_HOST,
    port=DB_PORT,
    user=DB_USER,
    password=DB_PASSWORD,
    database=DB_NAME
)

cursor = conn.cursor()

# Ruta del CSV
csv_path = "./data/museo-directorio-cdmx.csv"

with open(csv_path, newline='', encoding='utf-8') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        try:
            cursor.execute(
                "INSERT INTO museos (mus_nombre, mus_calle, mus_num_ext, mus_colonia, mus_cp, mus_alcaldia, mus_descripcion, mus_fec_ap, mus_tematica, mus_g_longitud, mus_g_latitud) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
                (row['museo_nombre'], row['museo_calle'], row['museo_num_ext'], row['museo_colonia'], row['museo_cp'], row['nom_mun'], row['museo_descripcion'], row['museo_fecha_fundacion'], row['museo_tematica_n1'], row['gmaps_longitud'], row['gmaps_latitud'])
            )
        except mysql.connector.Error as err:
            print(f"Error: {err}")
            continue

    conn.commit()
    cursor.close()
    conn.close()

print("Datos insertados correctamente.")
