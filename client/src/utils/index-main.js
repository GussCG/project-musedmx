import image1 from '../assets/images/others/museo-main-1.jpg';
import image2 from '../assets/images/others/museo-main-2.jpg';
import image3 from '../assets/images/others/museo-main-3.jpg';
import image4 from '../assets/images/others/museo-main-4.jpg';
import image5 from '../assets/images/others/museo-main-5.jpg';

// Para el cambio de imagen de fondo
const images = [
    image1,
    image2,
    image3,
    image4,
    image5
];

const museoNombres = [
    'Museo Nacional de Antropología',
    'Museo Soumaya',
    'Museo del Perfume',
    'Museo Jumex',
    'Museo Nacional de Historia Castillo de Chapultepec'
];

let currentImageIndex = 0;

export function changeBackgroundImage() {

    const bgElement = document.querySelector('#index-main-bg');
    const museoNombreElement = document.querySelector('#index-main-nombre-museo');

    bgElement.style.backgroundImage = `url(${images[currentImageIndex]})`;
    museoNombreElement.textContent = museoNombres[currentImageIndex];

    currentImageIndex = (currentImageIndex + 1) % images.length;
}

