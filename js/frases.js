/* =====================================================================
   frases.js — Rotador de frases de apoyo

   Cambia de frase automáticamente cada X segundos y también
   cuando el usuario pulsa el botón.
   ===================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  // Elementos
  var texto = document.getElementById('textoFrase');
  var boton = document.getElementById('botonFrase');

  // Si falta algo, no seguimos
  if (!texto || !boton) return;

  /* ---------------------------------------------------------------
     FRASES — todas escritas en lenguaje sencillo y en positivo
     --------------------------------------------------------------- */
  var FRASES = [
    'Sentir miedo antes de un examen es normal. Tu cuerpo se está preparando, no fallando.',
    'No necesitas tener un mal día para tener derecho a descansar.',
    'Pedir ayuda no te hace débil. Te hace alguien que sabe lo que hace.',
    'Un mal día no es tu vida entera. Los días difíciles también pasan.',
    'Compara tu día 1 con tu día 100, no con el día 1 de nadie más.',
    'Lo que sientes no es permanente, aunque ahora mismo se sienta enorme.',
    'Tus errores no te definen. Tus intentos sí.',
    'Puedes estar cansado y todavía así ser suficiente.',
    'Hablar de lo que te pasa le quita peso, no le añade.',
    'Si hoy solo pudiste sobrevivir al día, eso ya es un avance.',
    'No tienes que explicar todo para pedir ayuda. Con «no estoy bien» basta.',
    'Que esperes sentir algo no significa que no lo sientas.'
  ];

  // Cada cuánto cambian solas (en milisegundos)
  var INTERVALO = 8000;

  // Última frase mostrada, para no repetirla seguido
  var indiceActual = 0;
  var temporizador = null;

  /* ---------------------------------------------------------------
     FUNCIONES
     --------------------------------------------------------------- */

  // Elige un índice distinto al actual al azar
  function indiceAleatorio() {
    var nuevo;
    // Intenta varias veces hasta salir uno distinto
    for (var intento = 0; intento < 10; intento++) {
      nuevo = Math.floor(Math.random() * FRASES.length);
      if (nuevo !== indiceActual) return nuevo;
    }
    // Si falló (pocas frases), avanza una posición
    return (indiceActual + 1) % FRASES.length;
  }

  // Muestra la frase y programa la siguiente
  function mostrarFrase() {
    indiceActual = indiceAleatorio();
    texto.textContent = '«' + FRASES[indiceActual] + '»';

    // Reinicia el temporizador automático
    clearInterval(temporizador);
    temporizador = setInterval(mostrarFrase, INTERVALO);
  }

  /* ---------------------------------------------------------------
     EVENTOS
     --------------------------------------------------------------- */

  // El botón muestra otra frase al instante
  boton.addEventListener('click', mostrarFrase);

  // Empieza el ciclo automático
  mostrarFrase();

});