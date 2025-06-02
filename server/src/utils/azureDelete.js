import { BlobServiceClient } from "@azure/storage-blob";
import dotenv from "dotenv";

dotenv.config();

const AZURE_STORAGE_CONNECTION_STRING =
  process.env.AZURE_STORAGE_CONNECTION_STRING;

/**
 * Elimina un blob de Azure Storage.
 * @param {string} containerName = Nombre del contenedor de Azure.
 * @param {string} blobName = Nombre del blob a eliminar.
 * @return {boolean} Retorna true si la eliminación fue exitosa, false en caso contrario.
 */
export async function deleteFromAzure(containerName, blobName) {
  try {
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      AZURE_STORAGE_CONNECTION_STRING
    );
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    const exists = await blockBlobClient.exists();
    if (!exists) {
      console.log(
        `Blob ${blobName} no existe en el contenedor ${containerName}.`
      );
      return false; // El blob no existe, no hay nada que eliminar
    }

    await blockBlobClient.delete();
    console.log(
      `Blob ${blobName} eliminado exitosamente del contenedor ${containerName}.`
    );
    return true; // Eliminación exitosa
  } catch (error) {
    console.error("Error deleting from Azure:", error);
    throw new Error("Error deleting from Azure");
  }
}
