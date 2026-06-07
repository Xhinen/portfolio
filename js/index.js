/* =========================================================
   PORTFOLIO · Alberto Mira (xhinen)
   JavaScript principal (válido para todas las páginas)
   ========================================================= */


/* ---------------------------------------------------------
   1. Animación al hacer scroll (scroll reveal)
   Añade .vis a los elementos .reveal cuando entran en pantalla.
   --------------------------------------------------------- */
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('vis');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));


/* ---------------------------------------------------------
   2. Menú hamburguesa (móvil / tablet)
   Solo se activa si existen los elementos en la página.
   --------------------------------------------------------- */
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  // Cerrar el menú al elegir una sección
  navLinks.querySelectorAll('a').forEach((enlace) => {
    enlace.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}


/* ---------------------------------------------------------
   3. Validación del formulario de contacto (DOM)
   Solo se ejecuta si el formulario existe en la página.
   --------------------------------------------------------- */

// Comprueba que el email tenga un formato básico válido
function validarEmail(valor) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
}

const formulario = document.getElementById('whForm');

if (formulario) {
  formulario.addEventListener('submit', function (e) {
    e.preventDefault();

    let valido = true;

    const nombre = document.getElementById('nombre');
    const email = document.getElementById('email');
    const mensaje = document.getElementById('mensaje');

    // Marca/desmarca un campo como erróneo y muestra su mensaje
    function marcar(campo, idError, esErroneo) {
      const error = document.getElementById(idError);

      if (esErroneo) {
        campo.classList.add('err');
        error.classList.add('show');
      } else {
        campo.classList.remove('err');
        error.classList.remove('show');
      }

      return esErroneo;
    }

    // Reglas de validación
    if (marcar(nombre, 'err-nombre', nombre.value.trim().length < 2)) {
      valido = false;
    }
    if (marcar(email, 'err-email', !validarEmail(email.value.trim()))) {
      valido = false;
    }
    if (marcar(mensaje, 'err-mensaje', mensaje.value.trim().length < 10)) {
      valido = false;
    }

    // Si todo es correcto, ocultamos el formulario y mostramos el éxito
    if (valido) {
      formulario.style.display = 'none';
      document.getElementById('whSuccess').classList.add('show');
    }
  });
}
