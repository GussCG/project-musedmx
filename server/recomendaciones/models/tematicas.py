from typing import List
from ..database import db

temticas_a_id = {
    "Antropología": 1,
    "Arte": 2,
    "Arte Alternativo": 3,
    "Arqueología": 4,
    "Ciencia y Tecnología": 5,
    "Especializado": 6,
    "Historia": 7,
    "Otro": 8,
}

def get_preferencias_by_usuario(correo: str) -> List[int]:
    cursor = db.get_cursor()
    try:
        cursor.execute("""
            SELECT
                tematicas_tm_nombre
            FROM usuarios_has_tematicas
            WHERE usuarios_usr_correo = %s
        """, (correo,))
        resultados = cursor.fetchall()
        return [
            temticas_a_id[row['tematicas_tm_nombre']] for row in resultados if row['tematicas_tm_nombre'] in temticas_a_id
        ]
    except Exception as e:
        print(f"Error al obtener las preferencias: {e}")
        return []
    finally:
        cursor.close()
        db.close()
