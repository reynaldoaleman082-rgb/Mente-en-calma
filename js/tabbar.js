/* =====================================================================
   tabbar.js — Estilo de aplicación nativa en móvil

   Solo afecta a pantallas ≤520px (el CSS mantiene todo oculto o
   inerte en escritorio, así que allá no cambia nada):

   1) Inyecta una barra de navegación inferior fija (Bottom Tab Bar)
      con 4 accesos: Inicio, Señales, Actividades y Ayuda. Los enlaces
      hacen scroll suave (lo aporta el CSS, html { scroll-behavior }).
   2) Agrupa las 4 tarjetas de actividades dentro de un carrusel
      horizontal (.bento-carrusel) para que el CSS le aplique
      scroll-snap y las tarjetas se "imanten" al centro.
   3) Scroll-spy ligero: marca como activa la pestaña de la sección
      que está en pantalla.
   ===================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------------------------------------------------------------
     PARTE 1: BARRA INFERIOR (Bottom Tab Bar)
     --------------------------------------------------------------- */

  // Iconos inline (Feather Icons), 24x24, currentColor
  var ICONOS = {
    inicio: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>',
    senales: '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>',
    actividades: '<polyline points="22 12 18 12 15 21 9 3 6 12 1 12"></polyline>',
    ayuda: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>'
  };

  // [id de la sección, etiqueta visible]
  var ITEMS = [
    ['inicio', 'Inicio'],
    ['senales', 'Señales'],
    ['actividades', 'Actividades'],
    ['ayuda', 'Ayuda']
  ];

  var barra = document.createElement('nav');
  barra.className = 'tab-bar';
  barra.id = 'tabBar';
  barra.setAttribute('aria-label', 'Navegación inferior');

  var marcado = '';
  ITEMS.forEach(function (item) {
    marcado +=
      '<a class="tab-bar__item" href="#' + item[0] + '" data-seccion="' + item[0] + '">' +
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" ' +
          'fill="none" stroke="currentColor" stroke-width="1.75" ' +
          'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
          ICONOS[item[0]] +
        '</svg>' +
        '<span>' + item[1] + '</span>' +
      '</a>';
  });
  barra.innerHTML = marcado;
  document.body.appendChild(barra);

  /* ---------------------------------------------------------------
     PARTE 2: CARRUSEL DE ACTIVIDADES
     Agrupa las 4 tarjetas en un contenedor con scroll horizontal.
     El CSS lo convierte en carrusel imantado en móvil; en escritorio
     el contenedor tiene display: contents y no altera el bento box.
     --------------------------------------------------------------- */

  var contenedor = document.querySelector('#actividades .contenedor');

  if (contenedor && !document.querySelector('.bento-carrusel')) {
    var carrusel = document.createElement('div');
    carrusel.className = 'bento-carrusel';
    carrusel.setAttribute('aria-label', 'Actividades: desliza para ver la siguiente');

    // Sacamos las 4 tarjetas de la rejilla y las metemos en el carrusel
    var tarjeta;
    while ((tarjeta = contenedor.querySelector('article.actividad'))) {
      carrusel.appendChild(tarjeta);
    }

    // El carrusel queda al final: el título y la intro siguen arriba
    contenedor.appendChild(carrusel);
  }

  /* ---------------------------------------------------------------
     PARTE 3: SCROLL-SPY (resaltar la pestaña activa)
     --------------------------------------------------------------- */

  if (!('IntersectionObserver' in window)) return;

  var pestañas = barra.querySelectorAll('.tab-bar__item');
  var secciones = [];

  ITEMS.forEach(function (item) {
    var seccion = document.getElementById(item[0]);
    if (seccion) secciones.push(seccion);
  });

  // Observa una franja vertical centrada: si una sección la cruza,
  // es la sección "actual"
  var espia = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (!entrada.isIntersecting) return;

      pestañas.forEach(function (pestaña) {
        var esLaActiva = pestaña.getAttribute('data-seccion') === entrada.target.id;
        pestaña.classList.toggle('activo', esLaActiva);
      });
    });
  }, {
    rootMargin: '-40% 0px -50% 0px'
  });

  secciones.forEach(function (seccion) {
    espia.observe(seccion);
  });

});
