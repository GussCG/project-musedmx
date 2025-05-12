# Librerias
import csv
import os
import mysql.connector
from dotenv import load_dotenv
from PIL import Image
import io

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

csv_path = "./data/museo-directorio-cdmx.csv"
csv_horarios_path = "./data/horarios-precios.csv"

def normalizar_dia(dia):
    # La primera letra en mayúscula y el resto en minúscula
    dia = dia.lower()
    dia = dia.capitalize()

    return dia


def cargar_horarios():
    with open(csv_horarios_path, mode='r', newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            try:
                # Registrar el horario en la base de datos
                cursor.execute(
                    "INSERT INTO horarios_precios_museo (mh_mus_id, mh_dia, mh_hora_inicio, mh_hora_fin, mh_precio_ad, mh_precio_ni, mh_precio_ter, mh_precio_est) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)",
                    (row['mh_mus_id'], normalizar_dia(row['mh_dia']), row['mh_abre'], row['mh_cierra'], row['mh_precio_ad'], row['mh_precio_ni'], row['mh_precio_ter'], row['mh_precio_est'])
                )
            except mysql.connector.Error as err:
                print(f"Error: {err}")
                continue

    conn.commit()
    cursor.close()
    conn.close()

    print("Horarios Creados correctamente.")

if __name__ == "__main__":
    cargar_horarios()
