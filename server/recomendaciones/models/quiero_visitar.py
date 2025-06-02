from typing import List
from ..database import db

def get_qv_by_usuario(correo: str) -> List[int]:
    cursor, conn = db.get_cursor()
    try:
        cursor.execute("""
            SELECT 
                qv_mus_id 
            FROM quiero_visitar
            WHERE qv_usr_correo = %s
        """, (correo,))
        return [row['qv_mus_id'] for row in cursor.fetchall()]
    except Exception as e:
        print(f"Error al obtener las visitas: {e}")
        return []
    finally:
        cursor.close()
        db.close(conn)
        