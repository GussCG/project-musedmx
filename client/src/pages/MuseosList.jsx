import React from 'react'
import {useState} from "react"

import MenuFiltroMuseo from '../components/MenuFiltroMuseo'
import { useSearchParams } from 'react-router'

import mapaButton from '../assets/icons/mapa-icon.png'
import listButton from '../assets/icons/cartas-icon.png'
import filtrarButton from '../assets/icons/filtrar-icon.png'
import NavBar from '../components/NavBar'
import MuseoCard from '../components/MuseoCard'
import MuseosMapView from './MuseosMapView'

function MuseosList({titulo, MuseosMostrados}) {

    // Para obtener el input de busqueda
    const [searchParams] = useSearchParams()
    let tituloBusqueda = `${searchParams.get('search')}`

    if (tituloBusqueda === 'null') {
        tituloBusqueda = titulo
    }

    // Para obtener los museos del backend
    const [museos, setMuseos] = useState(MuseosMostrados)
    // Para cambiar la vista entre lista y mapa
    const [isMapView, setIsMapView] = useState(false)
    // Estado para controlar la visibilidad del menu de filtro
    const [menuVisible, setMenuVisible] = useState(false)

    const abrirMenu = () => {
        setMenuVisible(true)
    }

    const museoEjemplo = {
        id: 1,
        nombre: "Museo de Historia Natural",
        horarios: {
            Lunes: "9:00 - 18:00",
            Martes: "10:00 - 18:00",
            Miercoles: "9:00 - 18:00",
            Jueves: "10:00 - 18:00",
            Viernes: "10:00 - 18:00",
            Sabado: "10:00 - 18:00",
            Domingo: "13:00 - 18:00"
        },
        img: "../assets/images/others/museo-main-1.jpg",
        calificacion: 4,
        costo: 0
    }

    const museoEjemplo2 = {
        id: 2,
        nombre: "Museo del Perfume",
        horarios: {
            Lunes: "9:00 - 18:00",
            Martes: "10:00 - 18:00",
            Miercoles: "9:00 - 18:00",
            Jueves: "10:00 - 18:00",
            Viernes: "10:00 - 18:00",
            Sabado: "10:00 - 18:00",
            Domingo: "9:00 - 18:00"
        },
        img: "../assets/images/others/museo-main-2.jpg",
        calificacion: 5,
        costo: 2
    }

    const museoEjemplo3 = {
        id: 3,
        nombre: "Museo del Castillo de Chapultepec",
        horarios: {
            Lunes: "9:00 - 18:00",
            Martes: "10:00 - 18:00",
            Miercoles: "9:00 - 18:00",
            Jueves: "10:00 - 18:00",
            Viernes: "10:00 - 18:00",
            Sabado: "10:00 - 18:00",
            Domingo: ""
        },
        img: "../assets/images/others/museo-main-2.jpg",
        calificacion: 5,
        costo: 3
    }

    MuseosMostrados = [museoEjemplo, museoEjemplo2, museoEjemplo3]

  return (
    <>
        <NavBar />
        <MenuFiltroMuseo menuVisible={menuVisible} setMenuVisible={setMenuVisible} />
        <main id="vermuseos-main">
        <section className="museos-header-section">
            <div className="museos-header-section-left">
                <h1>{tituloBusqueda}</h1>
                <button onClick={() => setIsMapView(!isMapView)}>
                    <img 
                        src={isMapView ? listButton : mapaButton}
                        alt=" Cambiar a vista de mapa" 
                    />
                </button>
            </div>
            <div className="museos-header-section-right">
                <a href="#">
                    Generar Recomendaciones
                </a>
                <button 
                    className="museos-header-section-right-button"
                    onClick={abrirMenu}
                >
                    <img 
                        src={filtrarButton} 
                        alt="Filtrar" 
                        id="filtrar-button" 
                    />
                </button>
            </div>
        </section>
        <section className="museos-container-section">
            { isMapView ? (
                <MuseosMapView museos={museos} />
            ):(
                MuseosMostrados.map((museo) => (
                    <MuseoCard key={museo.id} museo={museo} />
                ))
            )}
        </section>  
        </main>
    </>
  )
}

export default MuseosList