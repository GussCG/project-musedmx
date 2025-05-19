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

tematicas = [
    "Antropología",
    "Arte",
    "Arte Alternativo",
    "Arqueología",
    "Ciencia y Tecnología",
    "Especializado",
    "Historia",
    "Otro"
]

for tematica in tematicas:
    # Insertar la temática en la base de datos
    cursor.execute("""
        INSERT INTO tematicas (tm_nombre)
        VALUES (%s)
    """, (tematica,))

# Guardar los cambios
conn.commit()
# Cerrar la conexión
cursor.close()
conn.close()
print("Temáticas cargadas correctamente.")