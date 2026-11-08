/* =====================================================================
   menu.js — Menú hamburguesa y tarjetas «mitos y verdades»
   Sin dependencias. Se ejecuta al cargar el documento.
   ===================================================================== */

// Ejecutamos el código cuando el HTML ya está listo
document.addEventListener('DOMContentLoaded', function () {

  /* ---------------------------------------------------------------
     PARTE 1: MENÚ HAMBURGUESA (solo móvil)
     --------------------------------------------------------------- */

  // Referencias a los elementos del menú
  var botonMenu = document.getElementById('botonMenu');
  var menu = document.getElementById('menuNav');

  // Si no existen, no hay nada que hacer
  if (botonMenu && menu) {

    // Alterna el menú: abre o cierra
    function alternarMenu() {
      var abierto = menu.classList.toggle('abierto');
      botonMenu.classList.toggle('activo', abierto);
      botonMenu.setAttribute('aria-expanded', abierto ? 'true' : 'false');
      botonMenu.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú de navegación');
    }

    // Cierra el menú
    function cerrarMenu() {
      menu.classList.remove('abierto');
      botonMenu.classList.remove('activo');
      botonMenu.setAttribute('aria-expanded', 'false');
      botonMenu.setAttribute('aria-label', 'Abrir menú de navegación');
    }

    // 1) Clic en el botón hamburguesa
    botonMenu.addEventListener('click', alternarMenu);

    // 2) Clic en cualquier enlace del menú: cierra tras saltar al ancla
    menu.querySelectorAll('a').forEach(function (enlace) {
      enlace.addEventListener('click', cerrarMenu);
    });

    // 3) Clic fuera del menú: también lo cierra
    document.addEventListener('click', function (evento) {
      var dentroDelMenu = menu.contains(evento.target);
      var dentroDelBoton = botonMenu.contains(evento.target);

      if (!dentroDelMenu && !dentroDelBoton && menu.classList.contains('abierto')) {
        cerrarMenu();
      }
    });

    // 4) Tecla Escape: cierra el menú (accesibilidad)
    document.addEventListener('keydown', function (evento) {
      if (evento.key === 'Escape') {
        cerrarMenu();
      }
    });

    // 5) Si se ensancha la ventana, el menú vuelve a la versión de escritorio
    window.addEventListener('resize', function () {
      if (window.innerWidth > 860) {
        cerrarMenu();
      }
    });
  }


  /* ---------------------------------------------------------------
     PARTE 2: TARJETAS «MITOS Y VERDADES» (giro 3D)
     --------------------------------------------------------------- */

  // Todas las tarjetas volteables del sitio
  var tarjetas = document.querySelectorAll('.volteable');

  // Alterna el giro de una tarjeta
  function voltear(tarjeta) {
    tarjeta.classList.toggle('girado');
  }

  tarjetas.forEach(function (tarjeta) {

    // Clic y toque
    tarjeta.addEventListener('click', function () {
      voltear(tarjeta);
    });

    // Teclado: Enter o Espacio también voltean (accesibilidad)
    tarjeta.addEventListener('keydown', function (evento) {
      if (evento.key === 'Enter' || evento.key === ' ') {
        evento.preventDefault(); // evita hacer scroll con la barra espaciadora
        voltear(tarjeta);
      }
    });
  });

});