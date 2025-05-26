import csv
import random
import datetime
from faker import Faker
import bcrypt
import os

fake = Faker('es_MX')
random.seed(42)

# IDs reales de algunos jugadores de la NBA (actualizado 2024)
nba_player_ids = [
    "1630618", "1630163", "1629627", "1629029", "1627759",
    "1630162", "1629028", "1629630", "203076", "201939",
    "203999", "201935", "1628369", "1630579", "1630543",
    "1629631", "1630624", "201566", "1629027", "202699"
]

def obtener_foto_nba():
    player_id = random.choice(nba_player_ids)
    return f"https://cdn.nba.com/headshots/nba/latest/1040x760/{player_id}.png"

CALIFICACIONES_RUBROS = {
    5: [{"valor": 3, "titulo": "Adultos"}, {"valor": 2, "titulo": "Familiar"}, {"valor": 1, "titulo": "Niños"}],
    1: [{"valor": 5, "titulo": "Muy Interesante"}, {"valor": 4, "titulo": "Interesante"}, {"valor": 3, "titulo": "Poco Interesante"}, {"valor": 2, "titulo": "Aburrido"}],
    2: [{"valor": 1, "titulo": "Limpio"}, {"valor": 0, "titulo": "Sucio"}],
    3: [{"valor": 1, "titulo": "Entendible"}, {"valor": 0, "titulo": "Difícil"}],
    4: [{"valor": 4, "titulo": "Muy Caro"}, {"valor": 3, "titulo": "Caro"}, {"valor": 2, "titulo": "Barato"}, {"valor": 1, "titulo": "Gratis"}],
}

tematicas = [
    "Antropología", "Arqueología", "Arte", "Arte Alternativo",
    "Ciencia y Tecnología", "Especializado", "Historia", "Otro"
]

servicios = [
    "Tienda de regalos", "Wi-Fi", "Guardarropa", "Biblioteca", "Estacionamiento",
    "Visitas guiadas", "Servicio Médico", "Baños", "Sillas de ruedas", "Cafetería",
    "Elevador", "Braille", "Lenguaje de señas"
]

# Leer museos
csv_path = "./data/museo-directorio-cdmx.csv"
with open(csv_path, "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    museos = [row for row in reader]

def generar_telefono():
    return f"{random.randint(100,999)}-{random.randint(100,999)}-{random.randint(1000,9999)}"

def bcrypt_hash(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

usuarios = []
usuarios_tematicas = []
correos = []

for _ in range(20):
    correo = fake.email()
    nombre = fake.first_name()
    ap_pat = fake.last_name()
    ap_mat = fake.last_name()
    password = bcrypt_hash("password123")
    fecha_nac = fake.date_of_birth(minimum_age=18, maximum_age=80)
    telefono = generar_telefono()
    foto = obtener_foto_nba()
    tipo = 1

    usuarios.append([
        correo, nombre, ap_pat, ap_mat,
        password, fecha_nac, telefono,
        foto, tipo
    ])
    correos.append(correo)

    temas = random.sample(tematicas, 3)
    for tema in temas:
        usuarios_tematicas.append([correo, tema])

visitas = []
respuestas = []
calificaciones = []
respuestas_serv = []
resenias = []
quiero_visitar = set()
favoritos = set()

res_id_counter = 1
resenia_id_counter = 1
encuesta_cve = 1

mod_correo = "mod@musedmx.com"

for museo in random.sample(museos, 30):
    mus_id = int(museo["museo_id"])
    for usuario in correos:
        fecha = fake.date_time_this_year()
        visitas.append([fecha, usuario, mus_id])

        for preg_id in range(1, 6):
            opciones = CALIFICACIONES_RUBROS[preg_id]
            valores_validos = [str(op["valor"]) for op in opciones]
            valor = random.choice(valores_validos)

            respuestas.append([res_id_counter, valor, preg_id, encuesta_cve])
            calificaciones.append([
                fecha, usuario, mus_id,
                res_id_counter, preg_id, encuesta_cve
            ])
            res_id_counter += 1

        serv_indices = random.sample(range(len(servicios)), k=3)
        for idx in serv_indices:
            respuestas_serv.append([fecha, usuario, mus_id, idx + 1])

        resenias.append([
            resenia_id_counter, fake.sentence(nb_words=8),
            mod_correo, 1, random.randint(1, 5),
            usuario, mus_id, fecha
        ])
        resenia_id_counter += 1

        if random.choice([True, False]):
            quiero_visitar.add((usuario, mus_id))
        if random.choice([True, False]):
            favoritos.add((usuario, mus_id))

def guardar_csv(nombre, cabeceras, datos):
    os.makedirs(os.path.dirname(nombre), exist_ok=True)
    with open(nombre, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(cabeceras)
        writer.writerows(datos)

guardar_csv("./csvpruebas/usuarios.csv", [
    "usr_correo", "usr_nombre", "usr_ap_paterno", "usr_ap_materno",
    "usr_contrasenia", "usr_fecha_nac", "usr_telefono", "usr_foto", "usr_tipo"
], usuarios)

guardar_csv("./csvpruebas/usuarios_has_tematicas.csv", [
    "usuarios_usr_correo", "tematicas_tm_nombre"
], usuarios_tematicas)

guardar_csv("./csvpruebas/visitas.csv", ["vi_fechahora", "vi_usr_correo", "vi_mus_id"], visitas)
guardar_csv("./csvpruebas/respuestas.csv", ["res_id", "res_respuesta", "preguntas_preg_id", "preguntas_encuesta_enc_cve"], respuestas)
guardar_csv("./csvpruebas/calificaciones.csv", [
    "visitas_vi_fechahora", "visitas_vi_usr_correo", "visitas_vi_mus_id",
    "respuestas_res_id", "respuestas_preguntas_preg_id", "respuestas_preguntas_encuesta_enc_cve"
], calificaciones)
guardar_csv("./csvpruebas/respuestas_servicios.csv", ["visitas_vi_fechahora", "visitas_vi_usr_correo", "visitas_vi_mus_id", "servicios_ser_id"], respuestas_serv)
guardar_csv("./csvpruebas/resenia.csv", [
    "res_id_res", "res_comentario", "res_mod_correo", "res_aprobado",
    "res_calif_estrellas", "visitas_vi_usr_correo", "visitas_vi_mus_id", "visitas_vi_fechahora"
], resenias)
guardar_csv("./csvpruebas/quiero_visitar.csv", ["qv_usr_correo", "qv_mus_id"], list(quiero_visitar))
guardar_csv("./csvpruebas/favoritos.csv", ["fav_usr_correo", "fav_mus_id"], list(favoritos))

print("✅ Archivos generados correctamente con contraseñas encriptadas y fotos de jugadores NBA.")
