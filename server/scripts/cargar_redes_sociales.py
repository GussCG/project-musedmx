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

nombresRedes = [
    "pagina_web",
    "pagina_web2",
    "pagina_web3",
    "email",
    "facebook",
    "twitter",
    "instagram",
]

# Insertar catálogo de redes (solo si no existen ya)
cursor.execute("SELECT rds_nombre FROM red_soc")
redes_existentes = {nombre[0] for nombre in cursor.fetchall()}

for red in nombresRedes:
    if red not in redes_existentes:
        cursor.execute("INSERT INTO red_soc (rds_nombre) VALUES (%s)", (red,))
conn.commit()

# Obtener catálogo con IDs
cursor.execute("SELECT rds_cve_rs, rds_nombre FROM red_soc")
catalogo_redes = {nombre: id_ for id_, nombre in cursor.fetchall()}

# Ruta del CSV
csv_path = "./data/museo-directorio-cdmx.csv"
with open(csv_path, newline='', encoding='utf-8') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        id_museo = row["museo_id"]

        for red in nombresRedes:
            link = row.get(red)
            if link and link.strip():
                red_id = catalogo_redes[red]

                # Si es twitter, agregar el prefijo xq unicamente es el nombre de usuario
                if red == "twitter":
                    link = f"https://x.com/{link.strip()}"

                # Insertar en la tabla de redes sociales
                cursor.execute(
                    "INSERT INTO museos_have_red_soc (mhrs_mus_id, mhrs_cve_rs, mhrs_link) VALUES (%s, %s, %s)",
                    (id_museo, red_id, link.strip())
                )
                print(f"Inserted link: {link.strip()} for museum ID: {id_museo} and network: {red}")
conn.commit()

# Cerrar la conexión
cursor.close()
