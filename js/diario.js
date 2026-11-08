/* =====================================================================
   diario.js — Diario de emociones con localStorage

   Clave de almacenamiento: "mente-en-calma-diario"
   El texto se guarda solo en este dispositivo, no se envía a ningún sitio.
   ===================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  // Clave única en localStorage
  var CLAVE = 'mente-en-calma-diario';

  // Elementos de la actividad
  var area = document.getElementById('areaDiario');
  var botonGuardar = document.getElementById('botonGuardar');
  var botonBorrar = document.getElementById('botonBorrar');
  var estado = document.getElementById('estadoDiario');

  // Si falta algo, no seguimos
  if (!area || !botonGuardar || !botonBorrar || !estado) return;

  /* ---------------------------------------------------------------
     UTILIDADES
     --------------------------------------------------------------- */

  // Muestra un mensaje temporal junto a los botones
  function mostrarMensaje(texto, esError) {
    estado.textContent = texto;
    estado.style.color = esError ? '#D96A5E' : 'var(--menta)';

    // Borra el mensaje a los 2,5 segundos
    setTimeout(function () {
      estado.textContent = '';
    }, 2500);
  }

  /* ---------------------------------------------------------------
     CHECK VISUAL — confirmación con física elástica
     Un aspa de verificación en SVG al estilo Feather que nace con
     la curva --rebote del sitio, se queda visible 2 segundos y se
     desvanece. Es puramente decorativo: aria-hidden.
     --------------------------------------------------------------- */
  var DURACION_CHECK = 2000;

  function mostrarCheck() {
    // Si un check anterior sigue animando, sale inmediatamente
    var previo = estado.querySelector('.diario__check');
    if (previo) previo.remove();

    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    svg.classList.add('diario__check');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2.5');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');

    var aspa = document.createElementNS(ns, 'path');
    aspa.setAttribute('d', 'M20 6 L9 17 L5 13');
    svg.appendChild(aspa);

    estado.appendChild(svg);

    // 2s visible + 0.4s de desvanecido (el fade va en el CSS), y fuera
    setTimeout(function () {
      var check = estado.querySelector('.diario__check');
      if (check) check.remove();
    }, DURACION_CHECK + 400);
  }

  /* ---------------------------------------------------------------
     CARGAR — recupera lo que había quedado guardado
     --------------------------------------------------------------- */
  function cargar() {
    try {
      var guardado = localStorage.getItem(CLAVE);
      if (guardado) {
        area.value = guardado;
        estado.textContent = 'Recuperado tu última entrada.';
      }
    } catch (error) {
      // Puede pasar si el navegador bloquea el almacenamiento
      console.warn('No se pudo leer el diario:', error);
    }
  }

  /* ---------------------------------------------------------------
     GUARDAR — escribe el texto en localStorage
     --------------------------------------------------------------- */
  function guardar() {
    var texto = area.value.trim();

    // No guardamos si está vacío
    if (texto === '') {
      mostrarMensaje('Escribe algo antes de guardar.', true);
      return;
    }

    try {
      localStorage.setItem(CLAVE, texto);
      mostrarMensaje('Guardado', false);
      mostrarCheck();
    } catch (error) {
      console.warn('No se pudo guardar el diario:', error);
      mostrarMensaje('No se pudo guardar en este dispositivo.', true);
    }
  }

  /* ---------------------------------------------------------------
     BORRAR — vacía el texto y elimina la clave guardada
     --------------------------------------------------------------- */
  function borrar() {
    var hayTexto = area.value.trim() !== '';

    if (!hayTexto) {
      mostrarMensaje('El diario ya está vacío.', false);
      return;
    }

    // Confirmación sencilla: un segundo clic en "Borrar todo" confirma
    if (botonBorrar.dataset.confirmando !== '1') {
      botonBorrar.dataset.confirmando = '1';
      botonBorrar.textContent = '¿Seguro? Toca otra vez';
      return;
    }

    // Segundo clic: sí se borra
    area.value = '';

    try {
      localStorage.removeItem(CLAVE);
    } catch (error) {
      console.warn('No se pudo borrar el diario:', error);
    }

    delete botonBorrar.dataset.confirmando;
    botonBorrar.textContent = 'Borrar todo';
    mostrarMensaje('Diario borrado.', false);
    area.focus();
  }

  /* ---------------------------------------------------------------
     AUTOGUARDADO — si el usuario cierra la página sin pulsar guardar
     --------------------------------------------------------------- */
  function autoguardar() {
    try {
      var texto = area.value.trim();
      if (texto === '') {
        localStorage.removeItem(CLAVE);
      } else {
        localStorage.setItem(CLAVE, texto);
      }
    } catch (error) {
      console.warn('Autoguardado fallido:', error);
    }
  }

  /* ---------------------------------------------------------------
     EVENTOS
     --------------------------------------------------------------- */
  botonGuardar.addEventListener('click', guardar);
  botonBorrar.addEventListener('click', borrar);

  // Autoguardado con una pequeña espera para no escribir en cada tecla
  var espera = null;
  area.addEventListener('input', function () {
    clearTimeout(espera);
    espera = setTimeout(autoguardar, 800);
  });

  // Al salir de la ventana, se guarda sin más espera
  window.addEventListener('beforeunload', autoguardar);

  // Si el botón de borrar queda en modo "confirmar" y pasa el rato,
  // vuelve a su texto original.
  botonBorrar.addEventListener('mouseleave', function () {
    if (botonBorrar.dataset.confirmando === '1') {
      delete botonBorrar.dataset.confirmando;
      botonBorrar.textContent = 'Borrar todo';
    }
  });

  // Estado inicial
  cargar();

});