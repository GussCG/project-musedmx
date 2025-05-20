import csv
import os   
import mysql.connector
from dotenv import load_dotenv
import io
from PIL import Image
from azure.storage.blob import BlobServiceClient
import requests

load_dotenv(dotenv_path="../.env")

# Leemos las variables de entorno
DB_HOST = os.getenv("DB_HOST")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")
DB_PORT =int(os.getenv("DB_PORT"))
AZURE_STORAGE_CONNECTION_STRING = os.getenv("AZURE_STORAGE_CONNECTION_STRING")
AZURE_CONTAINER_NAME = os.getenv("AZURE_CONTAINER_NAME")
AZURE_STORAGE_NAME = os.getenv("AZURE_STORAGE_NAME")
BLOB_BASE_URL = f"https://{AZURE_STORAGE_NAME}.blob.core.windows.net/{AZURE_CONTAINER_NAME}/"

conn = mysql.connector.connect(
    host=DB_HOST,
    port=DB_PORT,
    user=DB_USER,
    password=DB_PASSWORD,
    database=DB_NAME
)

# Conexión a Azure Blob Storage
blob_service_client = BlobServiceClient.from_connection_string(AZURE_STORAGE_CONNECTION_STRING)
container_client = blob_service_client.get_container_client(AZURE_CONTAINER_NAME)

cursor = conn.cursor()

def cargar_imagen_principal():
    print("\nActualizando URLS de imágenes principales...")
    csv_path = "./data/museo-directorio-cdmx.csv"

    with open(csv_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            try:
                carpeta_museo = row['museo_nombre'].replace(" ", "_").replace(":", "").replace("y", "Y").title()
                blob_list = container_client.list_blobs(name_starts_with=f"{carpeta_museo}/")

                img_url = None
                for blob in blob_list:
                    if "Main" in blob.name:
                        img_url = f"{BLOB_BASE_URL}{blob.name}"
                        break

                if img_url:
                    cursor.execute(
                        """
                        UPDATE museos
                        SET mus_foto = %s
                        WHERE mus_id = %s
                        """
                    ,(img_url, row['museo_id']))
                    print(f"Imagen principal actualizada para el museo {row['museo_id']}: {img_url}")
                else:
                    print(f"No se encontró imagen principal para el museo {row['museo_id']}")
            except mysql.connector.Error as err:
                print(f"Error al actualizar imagen principal para el museo {row['museo_id']}: {err}")
                continue

    conn.commit()
    print("URLS de imágenes principales actualizadas correctamente.")

def cargar_galeria():
    print("\nActualizando URLS de imágenes de galería...")
    csv_path = "./data/museo-directorio-cdmx.csv"

    with open(csv_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            try:
                carpeta_museo = row['museo_nombre'].replace(" ", "_").replace(":", "").replace("y", "Y").title()
                blob_list = container_client.list_blobs(name_starts_with=f"{carpeta_museo}/")
                
                cursor.execute(
                    "DELETE FROM galeria WHERE gal_mus_id = %s", (row['museo_id'],)
                )

                images_added = 0
                for blob in blob_list:
                    img_url = f"{BLOB_BASE_URL}{blob.name}"
                    cursor.execute(
                        """
                        INSERT INTO galeria
                            (gal_mus_id, gal_foto)
                        VALUES
                            (%s, %s)
                        """
                    ,(row['museo_id'], img_url))
                    images_added += 1
                
                print(f"Museo ID {row['museo_id']}: {images_added} imágenes añadidas a la galería")

            except mysql.connector.Error as err:
                print(f"Error al añadir imagen de galería para el museo {row['museo_id']}: {err}")
                continue
    conn.commit()
    print("URLS de imágenes de galería actualizadas correctamente.")

def cargar_horarios():
    def normalizar_dia(dia):
        """Normaliza el formato de los días de la semana"""
        dias = {
            'lunes': 'Lunes',
            'martes': 'Martes',
            'miércoles': 'Miércoles',
            'miercoles': 'Miércoles',
            'jueves': 'Jueves',
            'viernes': 'Viernes',
            'sábado': 'Sábado',
            'sabado': 'Sábado',
            'domingo': 'Domingo'
        }
        return dias.get(dia.lower(), dia.capitalize())

    print("Cargando horarios y precios...")

    try:
        csv_horarios_path = "./data/horarios-precios.csv"
        with open(csv_horarios_path, newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                try:
                    query = """
                    INSERT INTO horarios_precios_museo
                        (mh_mus_id, mh_dia, mh_hora_inicio, mh_hora_fin, mh_precio_ad, mh_precio_ni, mh_precio_ter, mh_precio_est)
                    VALUES
                        (%s, %s, %s, %s, %s, %s, %s, %s)
                    """  
                    cursor.execute(query, (
                        row['mh_mus_id'],
                        normalizar_dia(row['mh_dia']),
                        row['mh_abre'],
                        row['mh_cierra'],
                        row['mh_precio_ad'],
                        row['mh_precio_ni'],
                        row['mh_precio_ter'],
                        row['mh_precio_est']
                    ))  
                except mysql.connector.Error as err:
                    print(f"Error: {err}")
                    continue
        conn.commit()
        print("Horarios y precios creados correctamente.")
    except FileNotFoundError:
        print(f"El archivo {csv_horarios_path} no se encontró.")
    except Exception as e:
        print(f"Error al cargar horarios y precios: {e}")          

def cargar_museos():
    print("Cargando museos...")
    csv_path = "./data/museo-directorio-cdmx.csv"

    with open(csv_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            try:
                query = """
                INSERT INTO museos
                    (mus_id, mus_nombre, mus_calle, mus_num_ext, mus_colonia, mus_cp, mus_alcaldia, mus_descripcion, mus_fec_ap, mus_tematica, mus_g_longitud, mus_g_latitud)
                VALUES
                    (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """
                cursor.execute(query, (
                    row['museo_id'],
                    row['museo_nombre'],
                    row['museo_calle'], 
                    row['museo_num_ext'], 
                    row['museo_colonia'], 
                    row['museo_cp'], 
                    row['nom_mun'], 
                    row['museo_descripcion'], 
                    row['museo_fecha_fundacion'], 
                    row['museo_tematica_n1'], 
                    row['gmaps_longitud'], 
                    row['gmaps_latitud']
                ))
            except mysql.connector.Error as err:
                print(f"Error: {err}")
                continue
    conn.commit()
    print("Museos creados correctamente.")

def cargar_tematicas():
    print("Cargando tematicas...")
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
        try:
            query = """
            INSERT INTO tematicas 
                (tm_nombre)
            VALUES 
                (%s)
            """
            cursor.execute(query, (tematica,))
        except mysql.connector.Error as err:
            print(f"Error: {err}")
            continue
    conn.commit()
    print("Tematicas creadas correctamente.")

def cargar_redes_sociales():
    print("Cargando redes sociales...")
    nombresRedes = [
        "pagina_web",
        "email",
        "facebook",
        "twitter",
        "instagram",
    ]

    cursor.execute("SELECT rds_nombre FROM red_soc")
    redes_existentes = {nombre[0] for nombre in cursor.fetchall()}

    for red in nombresRedes:
        if red not in redes_existentes:
            cursor.execute(
                """
                INSERT INTO red_soc
                    (rds_nombre)
                VALUES
                    (%s)
                """
            ,(red,))
    conn.commit()

    cursor.execute("SELECT rds_cve_rs, rds_nombre FROM red_soc")
    catalogo_redes = {nombre: id_ for id_, nombre in cursor.fetchall()}

    csv_path = "./data/museo-directorio-cdmx.csv"
    with open(csv_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            id_museo = row["museo_id"]

            for red in nombresRedes:
                link = row.get(red)
                if link and link.strip():
                    red_id = catalogo_redes[red]

                    if red == "twitter":
                        link = f"https://x.com/{link.strip()}"

                    cursor.execute(
                        """
                        INSERT INTO museos_have_red_soc
                            (mhrs_mus_id, mhrs_cve_rs, mhrs_link)
                        VALUES
                            (%s, %s, %s)
                        """
                    ,(id_museo, red_id, link.strip()))
                    print(f"Red social {red} cargada para el museo {id_museo}.")
                
            for extra_web in ["pagina_web2", "pagina_web3"]:
                link = row.get(extra_web)
                if link and link.strip():
                    red_id = catalogo_redes["pagina_web"]
                    cursor.execute(
                        """
                        INSERT INTO museos_have_red_soc
                            (mhrs_mus_id, mhrs_cve_rs, mhrs_link)
                        VALUES
                            (%s, %s, %s)
                        """
                    ,(id_museo, red_id, link.strip()))
                    print(f"Extra web {extra_web} cargada para el museo {id_museo}.")
    conn.commit()
    print("Redes sociales creadas correctamente.")

def cargar_preguntas_respuestas():
    print("Cargando preguntas y respuestas...")

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

    def crear_encuesta(cursor, nombre_encuesta):
        query = """
        INSERT INTO encuesta
            (enc_nom)
        VALUES
            (%s)
        """
        cursor.execute(query, (nombre_encuesta,))
        return cursor.lastrowid
    
    def insertar_pregunta(cursor, pregunta, encuesta_id):
        query = """
        INSERT INTO preguntas
            (pregunta, encuesta_enc_cve)
        VALUES
            (%s, %s)
        """
        cursor.execute(query, (pregunta, encuesta_id))
        return cursor.lastrowid
    
    def insertar_servicio(cursor, servicio):
        query = """
        INSERT INTO servicios
            (ser_nombre)
        VALUES
            (%s)
        """
        cursor.execute(query, (servicio,))
        return cursor.lastrowid
    
    def insertar_museo_encuesta(cursor, museo_id, encuesta_id):
        query = """
        INSERT INTO museos_has_encuesta
            (museos_mus_id, encuesta_enc_cve)
        VALUES
            (%s, %s)
        """
        cursor.execute(query, (museo_id, encuesta_id))  

    print("Creando encuesta...")
    encuesta_id = crear_encuesta(cursor, nombre_encuesta)
    print("Encuesta creada con ID:", encuesta_id)
    print("Insertando preguntas...")
    for pregunta in preguntas:
        pregunta_id = insertar_pregunta(cursor, pregunta, encuesta_id)
        print("Pregunta insertada con ID:", pregunta_id)
    print("Insertando servicios...")
    for servicio in servicios:
        servicio_id = insertar_servicio(cursor, servicio)
        print("Servicio insertado con ID:", servicio_id)
    print("Insertando museos en encuesta...")
    with open(csv_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            id_museo = row["museo_id"]
            insertar_museo_encuesta(cursor, id_museo, encuesta_id)
            print("Museo insertado en encuesta con ID:", id_museo)

    conn.commit()
    print("Preguntas y respuestas creadas correctamente.")

def main():
    try:
        cargar_museos()
        cargar_tematicas()
        cargar_redes_sociales()
        cargar_preguntas_respuestas()
        cargar_imagen_principal()
        cargar_galeria()
        cargar_horarios()

        print("Carga de datos finalizada.")
    except mysql.connector.Error as err:
        print(f"Error: {err}")
    finally:
        cursor.close()
        conn.close()
        print("Conexión cerrada.")

if __name__ == "__main__":
    main()