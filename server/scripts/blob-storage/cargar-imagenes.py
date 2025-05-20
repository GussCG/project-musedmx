from azure.storage.blob import BlobServiceClient
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv(dotenv_path="../../.env")
AZURE_STORAGE_CONNECTION_STRING = os.getenv("AZURE_STORAGE_CONNECTION_STRING")

# Conexion a Azure Blob Storage
connect_str = AZURE_STORAGE_CONNECTION_STRING
container_name = "imagenes-museos"

# Cliente del contenedor
blob_service_client = BlobServiceClient.from_connection_string(connect_str)
container_client = blob_service_client.get_container_client(container_name)

# Ruta de la carpeta de las imagenes
ruta_imagenes = "../images"

for museo in os.listdir(ruta_imagenes):
    print(f"Subiendo {museo}...")

    museo_path = os.path.join(ruta_imagenes, museo)

    if os.path.isdir(museo_path):
        # Subir todas las imagenes del museo
        for imagen in os.listdir(museo_path):
            imagen_path = os.path.join(museo_path, imagen)
            carpeta_museo = museo.replace(" ", "_").replace(":", "").replace("y", "Y").title()
            blob_name = f"{carpeta_museo}/{imagen}"
            print(f"Subiendo {blob_name}...")

            with open(imagen_path, "rb") as data:
                container_client.upload_blob(name=blob_name, data=data, overwrite=True)

print("Subida de imagenes finalizada.")