import React, { useState } from 'react'

import CerrarButton from '../assets/icons/salir-icon.png'

import { FaStar } from 'react-icons/fa'

function MenuFiltroResena({menuVisible, setMenuVisible}) {

    const [rating, setRating] = useState(null)
    const [hover, setHover] = useState(null)

    // Para manejar los radio buttons de fecha
    const [radioFecha, setRadioFecha] = useState([false, false])

    const handleBorrar = () => {
        setRating(null)
        setRadioFecha([false, false])
    }

    const handleFiltrar = () => {
    }

    const cerrarMenu = () => {
        setMenuVisible(false)
        handleBorrar()
    }

  return (
    <div>
        <div 
            className={`bg-opaco ${menuVisible ? 'open' : ''}`} 
            id="fondo-opaco">
        </div>
        <div 
            className={`filtro-menu-container ${menuVisible ? 'open' : ''}`} 
            id="filtro-menu"
            >
            <div className="filtro-menu-header">
                <button 
                    className="filtro-menu-close-button"
                    onClick={cerrarMenu}
                    >
                    <img 
                        src={CerrarButton} 
                        alt="Cerrar" 
                        id="filtro-menu-close-button" 
                    />
                </button>
                <h1>Filtro</h1>
            </div>
            <div className="filtro-menu-filter">
                <div className="filtro-menu-filter-header">
                    <h2>Calificación</h2>
                </div>
                <div 
                className='filtro-menu-filter-body open'
                id="calificacion-menu"
                >
                    <div className="stars-rate-container">
                        {[...Array(5)].map((star, index) => {
                            const currentRate = index + 1
                            return (
                                <label className='stars-rate' key={currentRate}>
                                    <input 
                                        type="radio" 
                                        name='rating'
                                        value={currentRate}
                                        onClick={() => setRating(currentRate)}
                                    />
                                    <FaStar 
                                        className='stars-checkbox-span' 
                                        size={50} 
                                        color={currentRate <= (hover || rating) ? "#000" : "#d9d9d9"}
                                        onMouseEnter={() => setHover(currentRate)}
                                        onMouseLeave={() => setHover(null)}
                                    />
                                </label>
                                )
                            }
                        )}
                    </div>
                </div>  
            </div>
            <div className="filtro-menu-filter">
                <div className="filtro-menu-filter-header">
                    <h2>Fecha</h2>
                </div>
                <div 
                    className='filtro-menu-filter-body open'
                    id="fecha-menu"
                >
                    <div className="filtro-menu-filter-body-item">
                        <label htmlFor="fecha-1">Ordenar más antiguo a reciente</label>
                        <label className="filtro-rad">
                            <input 
                                type="radio" 
                                name="fecha-filter" 
                                id="fecha-1" 
                                checked={radioFecha[0]}
                                onChange={() => setRadioFecha([true, false])}
                            />
                            <span className="radio-filter-span"></span>
                        </label>
                    </div>
                    <div className="filtro-menu-filter-body-item">
                        <label htmlFor="fecha-2">Ordenar más reciente a antiguo</label>
                        <label className="filtro-rad">
                            <input 
                                type="radio" 
                                name="fecha-filter" 
                                id="fecha-2" 
                                checked={radioFecha[1]}
                                onChange={() => setRadioFecha([false, true])}
                                />
                            <span className="radio-filter-span"></span>
                        </label>
                    </div>
                </div>
            </div>
            <div className="filtro-menu-botones">
                <button 
                    className="filtro-menu-boton gray" 
                    id="limpiar-button"
                    onClick={handleBorrar}
                >Borrar</button>
                <button 
                    className="filtro-menu-boton black"
                    onClick={handleFiltrar}
                >Listo</button>
            </div>
        </div>
    </div>
  )
}

export default MenuFiltroResena