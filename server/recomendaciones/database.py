import os
import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv

# Carga .env desde el directorio padre
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

class Database:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.connection = None
            cls._instance._connect()  # Conexión inmediata al crear instancia
        return cls._instance
    
    def _connect(self):
        try:
            self.connection = mysql.connector.connect(
                host=os.getenv("DB_HOST", "localhost"),
                port=int(os.getenv("DB_PORT", 3306)),
                user=os.getenv("DB_USER", "root"),
                password=os.getenv("DB_PASSWORD", ""),  # Maneja contraseña vacía
                database=os.getenv("DB_NAME", "musedmx"),
                autocommit=True
            )
            print("✅ Conexión a MySQL exitosa")
        except Error as e:
            print(f"❌ Error al conectar a MySQL: {e}")
            raise
    
    def get_cursor(self):
        if not self.connection.is_connected():
            self._connect()
        return self.connection.cursor(dictionary=True)
    
    def close(self):
        if self.connection and self.connection.is_connected():
            self.connection.close()
            print("🔌 Conexión cerrada")

# Instancia global (singleton)
db = Database()