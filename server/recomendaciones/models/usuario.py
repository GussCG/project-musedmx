from typing import Dict, Optional, Any
from ..database import db

def get_usuario(correo: str) -> Optional[Dict[str, Any]]:
    cursor, conn = db.get_cursor()
    try:
        cursor.execute("""
            SELECT 
                * 
            FROM usuarios 
            WHERE usr_correo = %s
        """, (correo,))
        usuario = cursor.fetchone()
        return usuario
    except Exception as e:
        print(f"Error al obtener el usuario: {e}")
        return None
    finally:
        cursor.close()
        db.close(conn)
