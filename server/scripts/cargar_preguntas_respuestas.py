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

nombre_encuesta = "Encuesta de satisfacción"

preguntas = [
    "¿Qué tan interesante fue la visita?",
    "¿El museo estaba limpio?",
    "¿Es fácil de entender la información?",
    "¿Qué tan costosa fue la entrada?",
    "¿Para qué tipo de público es el museo?",
]

servicios = [
    "Tienda de regalos",
    "Wi-Fi",
    "Guardarropa",
    "Biblioteca",
    "Estacionamiento",
    "Visitas guiadas",
    "Servicio Médico",
    "Baños",
    "Sillas de ruedas",
    "Cafetería",
    "Elevador",
    "Braille",
    "Lenguaje de señas",
]

# Función para crear la encuesta
def create_encuesta(cursor, nombre_encuesta):
    query = "INSERT INTO encuesta (enc_nom) VALUES (%s)"
    cursor.execute(query, (nombre_encuesta,))
    return cursor.lastrowid

# Función para insertar preguntas
def insert_pregunta(cursor, pregunta, encuesta_id):
    query = "INSERT INTO preguntas (pregunta, encuesta_enc_cve) VALUES (%s, %s)"
    cursor.execute(query, (pregunta, encuesta_id))
    return cursor.lastrowid

# Función para insertar servicios
def insert_servicio(cursor, servicio):
    query = "INSERT INTO servicios (ser_nombre) VALUES (%s)"
    cursor.execute(query, (servicio,))
    return cursor.lastrowid

def insert_museo_encuesta(cursor, museo_id, encuesta_id):
    query = "INSERT INTO museos_has_encuesta (museos_mus_id, encuesta_enc_cve) VALUES (%s, %s)"
    cursor.execute(query, (museo_id, encuesta_id))

print("Creando encuesta...")
encuesta_id = create_encuesta(cursor, nombre_encuesta)
print("Encuesta creada con ID:", encuesta_id)
print("Insertando preguntas...")
for pregunta in preguntas:
    pregunta_id = insert_pregunta(cursor, pregunta, encuesta_id)
    print("Pregunta insertada con ID:", pregunta_id)
print("Insertando servicios...")
for servicio in servicios:
    servicio_id = insert_servicio(cursor, servicio)
    print("Servicio insertado con ID:", servicio_id)

# Insertamos la encuesta en la tabla museos_has_encuestas
print("Insertando encuesta en museos_has_encuestas...")
with open(csv_path, "r", encoding="utf-8") as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        # Obtenemos el ID del museo
        museo_id = row["museo_id"]
        # Insertamos la encuesta en la tabla museos_has_encuestas
        insert_museo_encuesta(cursor, museo_id, encuesta_id)
        print("Encuesta insertada en museos_has_encuestas para el museo con ID:", museo_id)

# Guardamos los cambios
conn.commit()
print("Encuesta insertada en museos_has_encuestas para todos los museos.")
# Cerramos la conexión
cursor.close()
conn.close()
print("Conexión cerrada.")
