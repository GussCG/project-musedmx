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

# Ruta del CSV
csv_path = "./data/museo-directorio-cdmx.csv"

# Ruta de la carpeta de imagenes
imgs_path = "./images/"

def procesar_img(ruta, max_ancho = 800, calidad = 70):
    with Image.open(ruta) as img:
        if img.width > max_ancho:
            proporcion = max_ancho / img.width
            nuevo_tam = (max_ancho, int(img.height * proporcion))
            img = img.resize(nuevo_tam)

        buffer = io.BytesIO()
        img.convert("RGB").save(buffer, format='JPEG', quality = calidad, optimize= True)
        datos_img = buffer.getvalue()
        tamano = len(datos_img) / 1024
        print(f"Tamano de imagen procesada: {tamano:.2f} KB")
        return datos_img

with open(csv_path, newline='', encoding='utf-8') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        try:
            # Para la carpeta de imagenes es nombre y en espacios son guiones bajos y primera letra en mayuscula menos "y", ademas de quitar caracteres ":"
            carpeta_museo = row['museo_nombre'].replace(" ", "_").replace(":", "").replace("y", "Y").title()
            # Si la carpeta existe
            # Buscamos la imagen principal (_Main) la guardamos en una variable 
            # Las otras imagenes las guardamos en un array
            imgs_museo = []
            if os.path.exists(os.path.join(imgs_path, carpeta_museo)):
                # Buscamos la imagen principal (_Main)
                for file in os.listdir(os.path.join(imgs_path, carpeta_museo)):
                    imgs_museo.append(os.path.join(imgs_path, carpeta_museo, file))
                    if "_Main" in file:
                        img_principal = os.path.join(imgs_path, carpeta_museo, file)
                        break
                else:
                    img_principal = None
            else:
                img_principal = None

            # Registrar el museo en la base de datos
            cursor.execute(
                "UPDATE museos SET mus_foto = %s WHERE mus_id = %s",(procesar_img(img_principal), row['museo_id'])
            )
            conn.commit()
 
        except mysql.connector.Error as err:
            print(f"Error: {err}")
            continue

    cursor.close()
    conn.close()
