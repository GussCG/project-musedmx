const swiper = new Swiper('.museo-wrapper', {
    // Optional parameters
    loop: true,
    grabCursor: true,
    centeredSlides: true,
  
    // If we need pagination
    pagination: {
      el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true,
    },
  
    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },

    // Breakpoints para mostrar más o menos slides
    // Si es mayor a 1360px mostrar 3 slides
    // Si es mayor a 768px mostrar 2 slides
    // Si es menor a 768px mostrar 1 slide
    breakpoints: {
        1370: {
            slidesPerView: 3,
            spaceBetween: 50,
        },
        1100: {
            slidesPerView: 2,
            spaceBetween: 100,
        },
        600: {
            slidesPerView: 2,
            spaceBetween: 20,
        },
        0: {
            slidesPerView: 2,
            spaceBetween: 5,
        }
    }
  
  });