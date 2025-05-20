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

try:
	cursor.execute(
		"INSERT INTO `musedmx`.`tematicas` "
		"VALUES "
			"('Antropología'),"
			"('Arte'),"
			"('Arte Alternativo'),"
			"('Arqueología'),"
			"('Ciencia y Tecnología'),"
			"('Especializado'),"
			"('Historia'),"
			"('Otro');"

		"INSERT INTO `musedmx`.`servicios` (`ser_nombre`) "
		"VALUES "
			"('Tienda'),"
			"('WiFi'),"
			"('Guardarropa'),"
			"('Biblioteca'),"
			"('Estacionamiento'),"
			"('Visita Guiada'),"
			"('Servicio Médico'),"
			"('Baños'),"
			"('Silla de Ruedas'),"
			"('Cafetería'),"
			"('Elevador'),"
			"('Braille'),"
			"('Lenguaje de Señas');"

		"INSERT INTO `musedmx`.`red_soc` (`rds_nombre`) "
		"VALUES "
			"('Facebook'),"
			"('Twitter'),"
			"('Instagram'),"
			"('Página Web');"
	)
except mysql.connector.Error as err:
	print(f"Error: {err}")

conn.commit()
cursor.close()
conn.close()

print("Datos insertados correctamente.")