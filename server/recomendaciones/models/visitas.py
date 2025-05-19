from typing import List
from ..database import db

def get_visitas_by_usuario(correo: str) -> List[int]:
    cursor = db.get_cursor()
    try:
        cursor.execute("""
            SELECT vi_mus_id FROM visitas 
            WHERE vi_usr_correo = %s
        """, (correo,))
        return [row['vi_mus_id'] for row in cursor.fetchall()]
    except Exception as e:
        print(f"Error al obtener las visitas: {e}")
        return []
    finally:
        cursor.close()
        db.close()

def get_visitas_agrupadas() -> List[List[int]]:
    cursor = db.get_cursor()
    try:
        cursor.execute("""
            SELECT 
                vi_usr_correo,
                GROUP_CONCAT(vi_mus_id) AS museos_ids
            FROM visitas
            GROUP BY vi_usr_correo
        """)
        return [
            [int(mus_id) for mus_id in row['museos_ids'].split(',')]
            for row in cursor.fetchall()
            if row['museos_ids']
        ]
    except Exception as e:
        print(f"Error al obtener las visitas agrupadas: {e}")
        return []
    finally:
        cursor.close()
        db.close()

def get_all_visitas_count() -> dict:
    cursor = db.get_cursor()
    try:
        cursor.execute("""
            SELECT 
                vi_mus_id, COUNT(*) as count 
            FROM visitas 
            GROUP BY vi_mus_id
        """)
        return {row['vi_mus_id']: row['count'] for row in cursor.fetchall()}
    except Exception as e:
        print(f"Error al obtener los conteos de visitas: {e}")
        return {}
    finally:
        cursor.close()
        db.close()