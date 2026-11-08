/* =====================================================================
   quiz.js — Quiz de 5 preguntas sobre salud mental

   Al elegir una opción:
   - la correcta se pinta de verde
   - la elegida incorrecta se pinta de rojo
   - aparece una explicación breve
   Al final se muestra el resultado y el mensaje correspondiente.
   ===================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  // Elementos de la actividad
  var cuerpo = document.getElementById('quizCuerpo');
  var progreso = document.getElementById('quizProgreso');
  var resultado = document.getElementById('quizResultado');
  var puntajeTexto = document.getElementById('quizPuntaje');
  var mensajeTexto = document.getElementById('quizMensaje');
  var botonReiniciar = document.getElementById('botonReiniciar');
  var quiz = document.getElementById('quiz');

  // Si falta algo, no seguimos
  if (!cuerpo || !resultado || !botonReiniciar) return;

  /* ---------------------------------------------------------------
     PREGUNTAS
     Cada opción tiene un texto y "correcta": true/false.
     --------------------------------------------------------------- */
  var PREGUNTAS = [
    {
      texto: 'Si te sientes mal, ¿qué es lo más útil que puedes hacer?',
      opciones: [
        { texto: 'Aguantar en silencio hasta que se pase solo', correcta: false },
        { texto: 'Contarlo a alguien de confianza y pedir apoyo', correcta: true },
        { texto: 'Tomar más café para seguir funcionando', correcta: false },
        { texto: 'Borrar todas las redes y esconderte', correcta: false }
      ],
      explicacion: 'Contarlo a alguien de confianza hace que el peso se reparta. No tienes que esperar a estar «muy mal» para hacerlo.'
    },
    {
      texto: '¿Cuál es una señal de que necesitas descansar o pedir ayuda?',
      opciones: [
        { texto: 'Tener malas notas en un solo examen', correcta: false },
        { texto: 'Sentirme cansado después de un día normal', correcta: false },
        { texto: 'Varias señales juntos y durante más de dos semanas', correcta: true },
        { texto: 'Querer ver a mis amigos el sábado', correcta: false }
      ],
      explicacion: 'Una señal aislada es normal. Lo importante es el patrón: varias señales que se mantienen en el tiempo.'
    },
    {
      texto: '¿Por qué puede ayudar escribir en un diario?',
      opciones: [
        { texto: 'Porque te hace olvidar lo que pasó', correcta: false },
        { texto: 'Porque poner en palabras lo que sientes ordena la mente', correcta: true },
        { texto: 'Porque sustituye a ir al médico', correcta: false },
        { texto: 'Porque así nadie puede enterarse de nada', correcta: false }
      ],
      explicacion: 'Escribir ayuda a sacar lo que tienes dentro de forma ordenada. Pero un diario NO sustituye a un profesional.'
    },
    {
      texto: 'Cuando respiras 4 segundos inando y 4 segundos exhalando, ¿qué ocurre?',
      opciones: [
        { texto: 'El corazón se detiene un momento', correcta: false },
        { texto: 'El sistema nervioso se calma y baja el ritmo', correcta: true },
        { texto: 'Pierdes el oxígeno de la sangre', correcta: false },
        { texto: 'Nada, es solo un truco sin efecto real', correcta: false }
      ],
      explicacion: 'Es una forma sencilla de bajar la activación del cuerpo. Es útil, pero no sustituye tratamiento si hay algo más serio.'
    },
    {
      texto: 'Un amigo te dice «no sé qué me pasa» y está mal. ¿Qué haces?',
      opciones: [
        { texto: 'Decirle que seguro es algo pasajero y se le pasa', correcta: false },
        { texto: 'Contarle que está exagerando', correcta: false },
        { texto: 'Escucharlo sin juzgar y animarle a hablar con un adulto', correcta: true },
        { texto: 'No hacer nada, cada uno tiene sus problemas', correcta: false }
      ],
      explicacion: 'Escuchar sin juzgar es el primer paso. No tienes que arreglarlo: solo estar ahí y ayudarle a buscar a alguien que le pueda ayudar más.'
    }
  ];

  // Variables de estado
  var indicePregunta = 0; // en qué pregunta estamos
  var aciertos = 0;       // respuestas correctas acumuladas

  /* ---------------------------------------------------------------
     DIBUJO DE LA PREGUNTA
     --------------------------------------------------------------- */
  function pintarPregunta() {
    var pregunta = PREGUNTAS[indicePregunta];

    // Actualiza el progreso (ej: "Pregunta 2 de 5")
    progreso.textContent = 'Pregunta ' + (indicePregunta + 1) + ' de ' + PREGUNTAS.length;

    // Construye el HTML de la pregunta y sus opciones
    var html = '';

    html += '<h4 class="quiz__pregunta">' + pregunta.texto + '</h4>';
    html += '<div class="quiz__opciones" id="quizOpciones">';

    // Un botón por opción
    pregunta.opciones.forEach(function (opcion, indice) {
      html += '<button type="button" class="quiz__opcion" data-indice="' + indice + '">';
      html += opcion.texto;
      html += '</button>';
    });

    html += '</div>';
    // Espacio para el mensaje de retroalimentación
    html += '<div id="quizFeedback"></div>';

    // Pinta en el contenedor
    cuerpo.innerHTML = html;

    // Asigna el clic a cada botón de opción
    document.getElementById('quizOpciones')
      .querySelectorAll('.quiz__opcion')
      .forEach(function (botonOpcion) {
        botonOpcion.addEventListener('click', function () {
          // Al clic le pasamos el índice que guardamos en data-indice
          responder(Number(botonOpcion.dataset.indice), botonOpcion);
        });
      });
  }

  /* ---------------------------------------------------------------
     RESPUESTA — la retroalimentación visual
     --------------------------------------------------------------- */
  function responder(indiceElegido, botonElegido) {
    var pregunta = PREGUNTAS[indicePregunta];
    var botones = document.getElementById('quizOpciones').querySelectorAll('.quiz__opcion');

    // 1) Bloquea todos los botones para que no se pueda volver a responder
    botones.forEach(function (b) {
      b.disabled = true;
    });

    // 2) Localiza el índice de la opción correcta
    var indiceCorrecto = -1;
    pregunta.opciones.forEach(function (opcion, i) {
      if (opcion.correcta) indiceCorrecto = i;
    });

    // 3) Marca en verde la correcta
    botones[indiceCorrecto].classList.add('correcta');

    // 4) Si el usuario falló, marca en rojo lo que eligió
    if (indiceElegido !== indiceCorrecto) {
      botonElegido.classList.add('incorrecta');
    } else {
      // Solo cuenta si acertó
      aciertos++;
    }

    // 5) Mensaje de retroalimentación
    var contenedorFeedback = document.getElementById('quizFeedback');
    var feedback = document.createElement('p');

    if (indiceElegido === indiceCorrecto) {
      feedback.className = 'quiz__feedback ok';
      // Feedback con icono Feather (check): nada de símbolos a texto plano
      feedback.innerHTML = '<svg class="icono-titulo" aria-hidden="true" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>¡Correcto! ' + pregunta.explicacion;
    } else {
      feedback.className = 'quiz__feedback mal';
      feedback.innerHTML = '<svg class="icono-titulo" aria-hidden="true" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>No es esa. La respuesta correcta es la que está en verde. ' + pregunta.explicacion;
    }

    contenedorFeedback.appendChild(feedback);

    // 6) Botón para continuar
    var botonSiguiente = document.createElement('button');
    botonSiguiente.type = 'button';
    botonSiguiente.className = 'boton boton--primario';
    botonSiguiente.textContent = indicePregunta === PREGUNTAS.length - 1
      ? 'Ver resultado'
      : 'Siguiente pregunta';
    botonSiguiente.style.marginTop = '18px';

    botonSiguiente.addEventListener('click', siguiente);
    contenedorFeedback.appendChild(botonSiguiente);

    // Da el foco al botón para poder seguir con Enter
    botonSiguiente.focus();
  }

  /* ---------------------------------------------------------------
     NAVEGACIÓN ENTRE PREGUNTAS
     --------------------------------------------------------------- */
  function siguiente() {
    indicePregunta++;

    if (indicePregunta < PREGUNTAS.length) {
      // Aún quedan preguntas
      pintarPregunta();
    } else {
      // Se acabaron: mostrar resultado
      mostrarResultado();
    }
  }

  /* ---------------------------------------------------------------
     RESULTADO FINAL
     --------------------------------------------------------------- */
  function mostrarResultado() {
    // Oculta el área de preguntas
    cuerpo.innerHTML = '';
    progreso.textContent = '';

    // Recompensa: el contenedor del quiz hace el "pop" y muestra el
    // trofeo (lo estila el CSS con .completado)
    if (quiz) quiz.classList.add('completado');

    // Muestra la caja de resultado con su recompensa visual
    resultado.hidden = false;

    // Puntaje numérico
    puntajeTexto.textContent = aciertos + ' / ' + PREGUNTAS.length;

    // Mensaje según lo obtenido (nunca humillante)
    var mensajes = [
      { min: 5, texto: '¡Perfecto! Tienes muy claros los conceptos. Sigue cuidando de ti y de tus amigos.' },
      { min: 3, texto: '¡Vas bien! Repasa sobre todo las preguntas que fallaste: ya las tienes frescas.' },
      { min: 0, texto: 'No te preocupes: esto es información, no un examen. Vuelve a leer los mitos y las señales de alerta.' }
    ];

    var elegido = mensajes[mensajes.length - 1];
    for (var i = 0; i < mensajes.length; i++) {
      if (aciertos >= mensajes[i].min) {
        elegido = mensajes[i];
        break;
      }
    }

    mensajeTexto.textContent = elegido.texto;
  }

  /* ---------------------------------------------------------------
     REINICIAR
     --------------------------------------------------------------- */
  function reiniciar() {
    indicePregunta = 0;
    aciertos = 0;
    resultado.hidden = true;
    if (quiz) quiz.classList.remove('completado');
    pintarPregunta();
  }

  botonReiniciar.addEventListener('click', reiniciar);

  // Estado inicial
  pintarPregunta();

});