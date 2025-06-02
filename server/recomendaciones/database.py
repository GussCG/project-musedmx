import os
from mysql.connector import Error, pooling
from dotenv import load_dotenv

# Carga .env desde el directorio padre
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

class Database:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.pool = None
            cls._instance._connect()  # Conexión inmediata al crear instancia
        return cls._instance
    
    def _connect(self):
        try:
            self.pool = pooling.MySQLConnectionPool(
                pool_name="musedmx_pool",
                pool_size=int(os.getenv("DB_POOL_SIZE", 10)),
                pool_reset_session=True,
                host=os.getenv('DB_HOST', 'localhost'),
                database=os.getenv('DB_NAME', 'musedmx'),
                user=os.getenv('DB_USER', 'root'),
                password=os.getenv('DB_PASSWORD', ''),
                port=int(os.getenv('DB_PORT', 3306))
            )
            print("✅ Pool de conexiones MySQL exitosa")
        except Error as e:
            print(f"❌ Error al crear el pool: {e}")
            raise
    
    def get_cursor(self):
        try:
            conn = self.pool.get_connection()
            return conn.cursor(dictionary=True), conn
        except Error as e:
            print(f"❌ Error al obtener conexión del pool: {e}")
            raise
    
    def close(self, conn):
        """ Cierra solo la conexión individual (devuelta al pool) """
        if conn.is_connected():
            conn.close()

# Instancia global (singleton)
db = Database()