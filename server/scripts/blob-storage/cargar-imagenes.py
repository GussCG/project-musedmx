from azure.storage.blob import BlobServiceClient
from PIL import Image
import os
from io import BytesIO
from dotenv import load_dotenv

# Load environment variables
load_dotenv(dotenv_path="../../.env")
AZURE_STORAGE_CONNECTION_STRING = os.getenv("AZURE_STORAGE_CONNECTION_STRING")

# Azure setup
connect_str = AZURE_STORAGE_CONNECTION_STRING
container_name = "imagenes-museos"
blob_service_client = BlobServiceClient.from_connection_string(connect_str)
container_client = blob_service_client.get_container_client(container_name)

# Carpeta de imágenes
ruta_imagenes = "../images"

# Calidad deseada (0-100). Puedes probar con 60, 40, etc.
CALIDAD_IMAGEN = 85

for museo in os.listdir(ruta_imagenes):
    print(f"Procesando {museo}...")
    museo_path = os.path.join(ruta_imagenes, museo)

    if os.path.isdir(museo_path):
        for imagen in os.listdir(museo_path):
            imagen_path = os.path.join(museo_path, imagen)

            # Preparar nombre del blob
            carpeta_museo = museo.replace(" ", "_").replace(":", "").replace("y", "Y").title()
            blob_name = f"{carpeta_museo}/{imagen}"
            print(f"Subiendo {blob_name}...")

            # Comprimir imagen antes de subir
            try:
                with Image.open(imagen_path) as img:
                    img = img.convert("RGB")  # Asegurar formato estándar
                    buffer = BytesIO()
                    img.save(buffer, format="JPEG", quality=CALIDAD_IMAGEN)
                    buffer.seek(0)
                    container_client.upload_blob(name=blob_name, data=buffer, overwrite=True)
            except Exception as e:
                print(f"Error con {imagen_path}: {e}")

print("✅ Subida de imágenes finalizada con compresión.")
