import React, { useState } from 'react'

import closeIcon from '../assets/icons/close-icon.png'

function LightBox({lightBoxVisible, setLightBoxVisible, currentImage}) {

    const closeLightBox = () => {
        setLightBoxVisible(false)
    }

    if (!lightBoxVisible) {
        return null
    }

  return (
    <div className="lightbox show">
        <button 
            className="btn-close"
            onClick={closeLightBox}
        >
            <img 
                src={closeIcon}
                alt="Cerrar" 
            />
        </button>
        <img 
            src={currentImage} 
            className="show-img"
        />
    </div>
  )
}

export default LightBox