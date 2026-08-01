const textos = [
  "",
  "No sé cómo lo hiciste, pero llegaste a mi vida y convertiste los días normales en los más bonitos que he vivido. ",
  "Si me preguntan qué es la felicidad, no diré una palabra. Solo señalaré tu sonrisa, porque ahí encontré mi hogar.",
  "No necesito un cielo lleno de estrellas, si puedo mirar tus ojos. En ellos encontré la luz que siempre estuve buscando.",
  "Cada abrazo tuyo calma mis miedos. Cada te quiero tuyo le da sentido a mi corazón.",
  "No prometo una vida perfecta, pero sí prometo caminar contigo, tomarte de la mano y elegirte todos los días.",
  "Hay flores muy bonitas, pero ninguna tiene tu esencia. Porque tú no solo adornas mi vida, también la haces florecer.",
  "Si algún día dudas de cuánto te quiero, mira el cielo por la noche. No podré contar todas las estrellas, igual que no podría contar las razones por las que te quiero.",
  "Gracias por aparecer en mi camino. No sé qué nos prepare el futuro, pero hoy solo quiero decirte que eres mi lugar favorito en el mundo."
];

const mensajesSecreto = [
  "✨ Hay algo que quiero mostrarte... ✨",
  "✨ Sé que no es la gran cosa ✨",
  "✨ Pero... ✨",
  "✨ Esto te lo hice con mucho amor ✨"
];

function esperar(milisegundos) {
  return new Promise((resolver) => setTimeout(resolver, milisegundos));
}

function abrirCarta(numero) {
  document.getElementById("textoCarta").innerHTML = textos[numero];
  document.getElementById("inicio").style.display = "none";
  document.getElementById("cartaCompleta").style.display = "flex";
}

function cerrarCarta() {
  document.getElementById("cartaCompleta").style.display = "none";
  document.getElementById("inicio").style.display = "flex";
}

function estallarPetalos(boton) {
  const rect = boton.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  for (let i = 0; i < 8; i++) {
    const petalo = document.createElement("span");
    petalo.className = "miniPetalo";
    petalo.textContent = "🌸";
    petalo.style.left = cx + "px";
    petalo.style.top = cy + "px";

    const angulo = (360 / 8) * i + Math.random() * 20;
    const distancia = 60 + Math.random() * 30;
    petalo.style.setProperty("--dx", Math.cos((angulo * Math.PI) / 180) * distancia + "px");
    petalo.style.setProperty("--dy", Math.sin((angulo * Math.PI) / 180) * distancia + "px");

    document.body.appendChild(petalo);
    setTimeout(() => petalo.remove(), 900);
  }
}

const contenedorFlores = document.getElementById("flowers");
if (contenedorFlores) {
  contenedorFlores.addEventListener("click", (evento) => {
    const boton = evento.target.closest(".rose");
    if (!boton) return;

    estallarPetalos(boton);
    boton.classList.add("leida");
    abrirCarta(Number(boton.dataset.index));
  });
}

function crearPetalo() {
  const elementos = [
    "Te quiero ✨",
    "Eres mi vida 🌟",
    "Preciosa 💖",
    "Hermosa ⭐",
    "Mi reina 💫",
    "Mi cielo ☁️✨",
    "Mi amor 🌸💖",
    "Mi eternidad 💗🌟",
    "Mi vida 🌺✨",
    "Mi favorita 🌷💖"
  ];

  const p = document.createElement("span");
  const elemento = elementos[Math.floor(Math.random() * elementos.length)];

  p.innerHTML = elemento;
  p.style.left = Math.random() * 100 + "vw";
  p.style.top = "-80px";
  p.style.fontSize = elemento.length > 14 ? "clamp(0.95rem, 2vw, 1.25rem)" : `${Math.random() * 20 + 18}px`;
  p.style.animationDuration = Math.random() * 2.5 + 3.5 + "s";
  p.style.animationDelay = Math.random() * 0.8 + "s";
  p.style.transform = `rotate(${Math.random() * 360}deg)`;
  p.style.color = elemento.includes("💖") || elemento.includes("💗") || elemento.includes("💝") || elemento.includes("🌙")
    ? "#fff5f8"
    : "#ff7aa2";
  p.style.fontWeight = "600";
  p.style.textShadow = "0 0 10px rgba(255,255,255,0.45)";

  const fondo = document.querySelector(".background");
  fondo.appendChild(p);

  setTimeout(() => {
    p.remove();
  }, 7000);
}

function iniciarLluviaDePetalos() {
  for (let i = 0; i < 40; i++) {
    crearPetalo();
  }
  setInterval(crearPetalo, 220);
}

// --- Sonido de viento generado con Web Audio API (no depende de un mp3 aparte) ---
let contextoAudio = null;
let gananciaViento = null;
let fuenteViento = null;

function iniciarViento() {
  try {
    contextoAudio = new (window.AudioContext || window.webkitAudioContext)();
    const duracion = 4;
    const muestras = contextoAudio.sampleRate * duracion;
    const buffer = contextoAudio.createBuffer(1, muestras, contextoAudio.sampleRate);
    const datos = buffer.getChannelData(0);
    for (let i = 0; i < muestras; i++) {
      datos[i] = Math.random() * 2 - 1;
    }

    fuenteViento = contextoAudio.createBufferSource();
    fuenteViento.buffer = buffer;
    fuenteViento.loop = true;

    const filtro = contextoAudio.createBiquadFilter();
    filtro.type = "lowpass";
    filtro.frequency.value = 500;

    const lfo = contextoAudio.createOscillator();
    const gananciaLfo = contextoAudio.createGain();
    lfo.frequency.value = 0.15;
    gananciaLfo.gain.value = 200;
    lfo.connect(gananciaLfo);
    gananciaLfo.connect(filtro.frequency);
    lfo.start();

    gananciaViento = contextoAudio.createGain();
    gananciaViento.gain.value = 0;

    fuenteViento.connect(filtro);
    filtro.connect(gananciaViento);
    gananciaViento.connect(contextoAudio.destination);

    fuenteViento.start();
    gananciaViento.gain.linearRampToValueAtTime(0.16, contextoAudio.currentTime + 2.2);
  } catch (error) {
    // Si el navegador bloquea el audio generado, seguimos sin sonido de viento
  }
}

function desvanecerViento() {
  if (!gananciaViento || !contextoAudio) return;
  gananciaViento.gain.linearRampToValueAtTime(0, contextoAudio.currentTime + 2.5);
  setTimeout(() => {
    try {
      fuenteViento.stop();
    } catch (error) {
      // ya estaba detenido
    }
  }, 2700);
}

async function mostrarMensajesSecuencia(elemento, mensajes, intervalo = 1400, pausaEntreMensajes = 400) {
  if (!elemento) return;

  for (let i = 0; i < mensajes.length; i++) {
    elemento.textContent = mensajes[i];
    elemento.classList.remove("visible");
    void elemento.offsetWidth;
    elemento.classList.add("visible");

    await esperar(intervalo);

    elemento.classList.remove("visible");

    if (i < mensajes.length - 1) {
      await esperar(pausaEntreMensajes);
    }
  }
}

let intervaloVolumenMusica = null;

function actualizarBotonMusica(estado) {
  if (!botonMusica) return;
  botonMusica.textContent = estado === "reproduciendo" ? "⏸ Pausar música" : "▶ Reproducir música";
  botonMusica.classList.toggle("activo", estado === "reproduciendo");
}

function reproducirMusica() {
  const audio = document.getElementById("musicaFondo");
  if (!audio) return;

  if (!audio.paused) {
    audio.pause();
    actualizarBotonMusica("pausado");
    return;
  }

  if (intervaloVolumenMusica) {
    clearInterval(intervaloVolumenMusica);
    intervaloVolumenMusica = null;
  }

  audio.volume = 0;
  audio.play().catch(() => {});

  let volumenActual = 0;
  intervaloVolumenMusica = setInterval(() => {
    volumenActual += 0.04;
    audio.volume = Math.min(volumenActual, 0.4);
    if (volumenActual >= 0.4) {
      clearInterval(intervaloVolumenMusica);
      intervaloVolumenMusica = null;
    }
  }, 120);

  actualizarBotonMusica("reproduciendo");
}

// --- Secuencia cinematográfica de entrada ---
const botonHuella = document.getElementById("botonHuella");
const botonMusica = document.getElementById("botonMusica");
const entrada = document.getElementById("entrada");
const mensajeEntrada = document.getElementById("mensajeEntrada");
const inicio = document.getElementById("inicio");

async function iniciarExperiencia() {
  mensajeEntrada.classList.remove("oculto");
  mensajeEntrada.classList.add("visible");

  await esperar(1500);
  entrada.classList.add("oculto");

  const escenaNegra = document.getElementById("escenaNegra");
  const mensajeSecreto = document.getElementById("mensajeSecreto");
  const camaraJardin = document.getElementById("camaraJardin");

  escenaNegra.classList.remove("oculto");
  iniciarViento();

  await esperar(600);
  await mostrarMensajesSecuencia(mensajeSecreto, mensajesSecreto);
  await esperar(900);
  escenaNegra.classList.add("saliendo");
  camaraJardin.classList.remove("oculto");
  camaraJardin.classList.add("acercando");

  await esperar(1400);
  escenaNegra.classList.add("oculto");

  document.querySelector(".lunas").classList.add("visible");

  await esperar(1800);
  document.querySelector(".estrellasFugaces").classList.add("visible");

  await esperar(1300);
  document.querySelector(".background").classList.add("visible");
  document.querySelector(".jardinSuelo").classList.add("visible");

  await esperar(2000);
  inicio.classList.remove("oculto");
  inicio.style.display = "flex";

  await esperar(1600);
  desvanecerViento();
  reproducirMusica();
  iniciarLluviaDePetalos();
}

botonHuella.addEventListener("click", () => {
  iniciarExperiencia();
});

if (botonMusica) {
  botonMusica.addEventListener("click", () => {
    reproducirMusica();
  });
}
