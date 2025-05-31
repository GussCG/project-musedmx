from typing import List
from ..database import db

def get_favoritos_by_usuario(correo: str) -> List[int]:
    cursor, conn = db.get_cursor()
    try:
        cursor.execute("""
            SELECT 
                fav_mus_id 
            FROM favoritos 
            WHERE fav_usr_correo = %s
        """, (correo,))
        return [row['fav_mus_id'] for row in cursor.fetchall()]
    except Exception as e:
        print(f"Error al obtener los favoritos: {e}")
        return []
    finally:
        cursor.close()
        db.close(conn)        

def get_all_favoritos_count() -> dict:
    cursor, conn = db.get_cursor()
    try:
        cursor.execute("""
            SELECT 
                fav_mus_id, COUNT(*) as count 
            FROM favoritos 
            GROUP BY fav_mus_id
        """)
        return {row['fav_mus_id']: row['count'] for row in cursor.fetchall()}
    except Exception as e:
        print(f"Error al obtener los conteos de favoritos: {e}")
        return {}
    finally:
        cursor.close()
        db.close(conn)