import React from 'react'

import buscarimg from '../assets/icons/buscar-icon.png'

function MuseosMapView() {

    // Para el manejo del valor del rango
    const [rangoRadio, setRangoRadio] = React.useState(10);

    // Funcion para manejar el cambio del rango en el input range
    const handleRangeChange = (e) => {
        setRangoRadio(e.target.value);
    }

    // Funcion para manejar la busqueda de museos
    const [ubicacion, setUbicacion] = React.useState('');
    const handleUbicacionChange = (e) => {
        setUbicacion(e.target.value);
    }

  return (
    <div>
        <section className="museos-map-nav">
            <div id="museos-form-nav">
                <div className="museos-nav-section">
                    <button type='submit'>
                        <img 
                            src={buscarimg} 
                            alt="Buscar"
                        />
                    </button>
                    <input 
                        type="text" 
                        name="museos-txt-ubicacion" 
                        id="museos-txt-ubicacion" 
                        placeholder="Introduce tu ubicación" 
                        value={ubicacion}
                        onChange={handleUbicacionChange}
                        />
                </div>
                <div className="museos-nav-section range-section">
                    <label htmlFor="museos-range-ubicacion" id="frm-range-ubicacion"><b>Tamaño de Radio:</b><br/> <output >{rangoRadio}</output> km</label>
                    <input 
                        type="range" 
                        min="10" 
                        max="100" 
                        step="5" 
                        value={rangoRadio} 
                        id="museos-range-ubicacion" 
                        name="museos-range-ubicacion" 
                        placeholder="Rango de Ubicación" 
                        list="museos-range-ubicacion-list"
                        onChange={handleRangeChange} 
                        required />    
                </div>
            </div>
        </section>
        <section className="museos-map-container">
            <div id="museos-map">
                <img src="../images/mapa-placeholder.png" alt="Mapa de Museos" />
            </div>
        </section>

    </div>
  )
}

export default MuseosMapView