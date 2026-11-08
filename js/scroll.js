/* =====================================================================
   scroll.js — Botón "volver arriba" y animaciones de entrada

   1) El botón aparece cuando el usuario baja más de 400 px y
      desaparece al volver arriba. Al pulsarlo, la página sube suave.
   2) Un IntersectionObserver añade la clase .visible a los elementos
      con .revelar cuando entran en pantalla, con un retraso escalonado
      de 100 ms entre ellos (animación tipo "staggered").
   ===================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------------------------------------------------------------
     PARTE 1: BOTÓN VOLVER ARRIBA
     --------------------------------------------------------------- */

  var boton = document.getElementById('volverArriba');

  // Distancia de scroll (en píxeles) a partir de la cual se muestra
  var UMBRAL = 400;

  if (boton) {

    // Comprueba si toca mostrar u ocultar el botón
    function actualizarBoton() {
      if (window.scrollY > UMBRAL) {
        boton.classList.add('visible');
      } else {
        boton.classList.remove('visible');
      }
    }

    // Clic: sube suave al inicio de la página
    boton.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: 'smooth' // desplazamiento suave
      });
    });

    // Se llama al hacer scroll (el evento no dispara por scrolls de teclado
    // de formata distinta, por eso también comprobamos al cargar y al redimensionar)
    window.addEventListener('scroll', actualizarBoton, { passive: true });
    window.addEventListener('resize', actualizarBoton);

    // Estado inicial
    actualizarBoton();
  }


  /* ---------------------------------------------------------------
     PARTE 2: ANIMACIONES DE ENTRADA (IntersectionObserver)
     Los elementos aparecen escalonados: si varios entran a la vez,
     el primero tarda 0ms, el segundo 100ms, el tercero 200ms...
     --------------------------------------------------------------- */

  // Si el navegador no soporta IntersectionObserver, no animamos
  // (así el contenido nunca se queda invisible por error)
  if (!('IntersectionObserver' in window)) return;

  var RETRASO_ESCALONADO = 100; // ms entre cada elemento del lote
  var DURACION_REVELADO = 700;  // dura la transición de .revelar en CSS

  var elementos = document.querySelectorAll('.revelar');

  // margin negativo: el elemento ya está "dentro" un poco antes de
  // tocar el borde, para que la animación no se note tardía
  var observador = new IntersectionObserver(function (entradas) {

    // Del lote de actualización, solo los que acaban de entrar
    var nuevos = [];
    entradas.forEach(function (entrada) {
      if (entrada.isIntersecting) {
        nuevos.push(entrada);
      }
    });

    // Escalera de entrada: 0ms, 100ms, 200ms...
    nuevos.forEach(function (entrada, orden) {
      var elemento = entrada.target;
      var retraso = orden * RETRASO_ESCALONADO;

      // Retraso dinámico en estilo inline (esto es lo que escalona)
      elemento.style.transitionDelay = retraso + 'ms';
      elemento.classList.add('visible');
      // Deja de observarlo: no hace falta volver a comprobarlo
      observador.unobserve(elemento);

      // Al terminar la animación, quita el retraso inline para que
      // no arrastre las micro-interacciones (hovers, giros, etc.)
      window.setTimeout(function () {
        elemento.style.transitionDelay = '';
      }, retraso + DURACION_REVELADO);
    });
  }, {
    threshold: 0.1,   // se activa cuando se ve el 10% del elemento
    rootMargin: '0px 0px -40px 0px'
  });

  // Empezamos a observar todos los elementos .revelar
  elementos.forEach(function (elemento) {
    observador.observe(elemento);
  });

});