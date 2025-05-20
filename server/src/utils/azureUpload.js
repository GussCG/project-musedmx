import { BlobServiceClient } from "@azure/storage-blob";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();
const AZURE_STORAGE_CONNECTION_STRING =
  process.env.AZURE_STORAGE_CONNECTION_STRING;

export async function uploadToAzure(containerName, filePath, blobName) {
  try {
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      AZURE_STORAGE_CONNECTION_STRING
    );
    const containerClient = blobServiceClient.getContainerClient(containerName);

    const exists = await containerClient.exists();
    if (!exists) {
      await containerClient.create();
    }

    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    const uploadBlobResponse = await blockBlobClient.uploadFile(filePath);
    fs.unlinkSync(filePath); // Eliminar el archivo local después de subirlo

    return blockBlobClient.url; // URL del blob subido
  } catch (error) {
    console.error("Error uploading to Azure:", error);
    throw new Error("Error uploading to Azure");
  }
}
