/* =========================================================
   PORTFOLIO · Alberto Mira
   JavaScript principal: idioma, menú y formulario
   ========================================================= */

/* ---------- 1. Idioma (ES / EN) ---------- */
const raiz = document.documentElement;
// Cada página puede definir su título en <html data-title-es="…" data-title-en="…">
const titulos = {
  es: raiz.dataset.titleEs || 'Alberto Mira · Sistemas y DevOps',
  en: raiz.dataset.titleEn || 'Alberto Mira · Systems and DevOps'
};

function leerIdioma() {
  try {
    const guardado = localStorage.getItem('idioma');
    if (guardado === 'es' || guardado === 'en') return guardado;
  } catch (e) { /* almacenamiento no disponible */ }
  return navigator.language && navigator.language.startsWith('es') ? 'es' : 'en';
}

function aplicarIdioma(idioma) {
  raiz.lang = idioma;
  document.title = titulos[idioma];
  try { localStorage.setItem('idioma', idioma); } catch (e) { /* nada */ }
}

aplicarIdioma(leerIdioma());

const botonIdioma = document.getElementById('langToggle');
if (botonIdioma) {
  botonIdioma.addEventListener('click', () => {
    aplicarIdioma(raiz.lang === 'es' ? 'en' : 'es');
  });
}

/* ---------- 1b. Pie: dice desde dónde se está sirviendo la web ---------- */
const host = location.hostname;
const origen = host.endsWith('github.io')
  ? { es: 'Servida desde GitHub Pages', en: 'Served from GitHub Pages' }
  : (host === '' || host === 'localhost' || host === '127.0.0.1')
    ? null // en local se deja el texto por defecto
    : { es: 'Servida desde mi clúster Kubernetes', en: 'Served from my Kubernetes cluster' };

if (origen) {
  document.querySelectorAll('[data-host-es]').forEach((el) => { el.textContent = origen.es; });
  document.querySelectorAll('[data-host-en]').forEach((el) => { el.textContent = origen.en; });
}

/* ---------- 2. Menú en móvil ---------- */
const botonMenu = document.getElementById('menuToggle');
const nav = document.getElementById('nav');

if (botonMenu && nav) {
  botonMenu.addEventListener('click', () => {
    const abierto = nav.classList.toggle('open');
    botonMenu.setAttribute('aria-expanded', abierto);
  });
  nav.querySelectorAll('a').forEach((enlace) => {
    enlace.addEventListener('click', () => {
      nav.classList.remove('open');
      botonMenu.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---------- 3. Formulario de contacto (Formspree) ---------- */
const textos = {
  es: {
    nombre: 'Escribe tu nombre.',
    email: 'Revisa el email: falta la @ o el dominio.',
    mensaje: 'El mensaje necesita al menos 10 caracteres.',
    consentimiento: 'Marca la casilla de privacidad para poder enviar el mensaje.',
    enviando: 'Enviando…',
    ok: 'Mensaje enviado. Te respondo en menos de 24 horas.',
    error: 'No se ha podido enviar. Prueba otra vez o escríbeme por LinkedIn.'
  },
  en: {
    nombre: 'Enter your name.',
    email: 'Check the email: the @ or the domain is missing.',
    mensaje: 'The message needs at least 10 characters.',
    consentimiento: 'Tick the privacy box to send the message.',
    enviando: 'Sending…',
    ok: 'Message sent. I will reply within 24 hours.',
    error: 'The message could not be sent. Try again or reach me on LinkedIn.'
  }
};

const form = document.getElementById('contactForm');

if (form) {
  const estado = document.getElementById('formStatus');
  const boton = document.getElementById('sendBtn');

  function mostrar(clave, tipo) {
    estado.textContent = textos[raiz.lang][clave];
    estado.className = 'form-status ' + (tipo || '');
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const campos = [
      { el: form.nombre, clave: 'nombre', valido: form.nombre.value.trim().length >= 2 },
      { el: form.email, clave: 'email', valido: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.value.trim()) },
      { el: form.mensaje, clave: 'mensaje', valido: form.mensaje.value.trim().length >= 10 },
      { el: form.consentimiento, clave: 'consentimiento', valido: form.consentimiento.checked }
    ];

    let primerError = null;
    campos.forEach((c) => {
      c.el.setAttribute('aria-invalid', String(!c.valido));
      if (!c.valido && !primerError) primerError = c;
    });

    if (primerError) {
      mostrar(primerError.clave, 'err');
      primerError.el.focus();
      return;
    }

    boton.disabled = true;
    mostrar('enviando');

    try {
      const respuesta = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });
      if (!respuesta.ok) throw new Error(respuesta.status);
      form.reset();
      mostrar('ok', 'ok');
    } catch (err) {
      mostrar('error', 'err');
    } finally {
      boton.disabled = false;
    }
  });
}
