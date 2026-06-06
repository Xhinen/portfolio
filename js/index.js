const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

  function validarEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

  document.getElementById('whForm').addEventListener('submit', function(e) {
    e.preventDefault();
    let ok = true;
    const nombre = document.getElementById('nombre');
    const email = document.getElementById('email');
    const mensaje = document.getElementById('mensaje');

    function marca(campo, errId, malo) {
      const err = document.getElementById(errId);
      if (malo) { campo.classList.add('err'); err.classList.add('show'); }
      else { campo.classList.remove('err'); err.classList.remove('show'); }
      return malo;
    }

    if (marca(nombre, 'err-nombre', nombre.value.trim().length < 2)) ok = false;
    if (marca(email, 'err-email', !validarEmail(email.value.trim()))) ok = false;
    if (marca(mensaje, 'err-mensaje', mensaje.value.trim().length < 10)) ok = false;

    if (ok) {
      this.style.display = 'none';
      document.getElementById('whSuccess').classList.add('show');
    }
  });