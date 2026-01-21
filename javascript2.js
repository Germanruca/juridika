document.addEventListener("DOMContentLoaded", () => {
  // --- Ocultar Header al hacer scroll ---
  const header = document.querySelector("header");
  let lastScrollY = window.scrollY;

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      header.style.transform = "translateY(-100%)";
    } else {
      header.style.transform = "translateY(0)";
    }

    lastScrollY = currentScrollY;
  });

  // --- Chart.js Pie Charts on Scroll ---
  const chartsData = [
    { id: "chart1", percent: 75 },
    { id: "chart2", percent: 55 },
    { id: "chart3", percent: 33 },
    { id: "chart4", percent: 25 },
  ];

  const createGradient = (ctx) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, "#33cb98ff");
    gradient.addColorStop(1, "#6599ffff");
    return gradient;
  };

  const initChart = (id, percent) => {
    const canvas = document.getElementById(id);
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const gradient = createGradient(ctx);

    new Chart(ctx, {
      type: "doughnut",
      data: {
        datasets: [{
          data: [percent, 100 - percent],
          backgroundColor: [gradient, "#f0f0f0"],
          borderWidth: 0
        }]
      },
      options: {
        responsive: false,
        cutout: "70%",
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }
        }
      }
    });
  };

  const target = document.getElementById("estadisticas-final");
  if (target) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          chartsData.forEach(({ id, percent }) => {
            const canvas = document.getElementById(id);
            if (canvas && !canvas.dataset.rendered) {
              initChart(id, percent);
              canvas.dataset.rendered = true;
            }
          });
          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });

    observer.observe(target);
  }

  // --- Zoom imagen en scroll ---
  const zoomImg = document.querySelector('.zoom-on-scroll');
  if (zoomImg) {
    const observerZoom = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          zoomImg.classList.add('zoom-visible');
          observer.unobserve(zoomImg);
        }
      });
    }, { threshold: 0.4 });
    observerZoom.observe(zoomImg);
  }

  // --- Lógica para sección Nuestro Equipo (solo si existe) ---
  const galeria = document.getElementById("galeria");
  const prev = document.getElementById("prev");
  const next = document.getElementById("next");
  const perfilExpandido = document.getElementById("perfilExpandido");
  const fotoPerfil = document.getElementById("fotoPerfil");
  const nombrePerfil = document.getElementById("nombrePerfil");
  const cargoPerfil = document.getElementById("cargoPerfil");
  const bioTexto = document.getElementById("bioTexto");
  const volver = document.getElementById("volver");

  if (galeria && prev && next && perfilExpandido && fotoPerfil && nombrePerfil && cargoPerfil && bioTexto && volver) {
    const miembros = [
      {
        nombre: "Diana Caballero",
        cargo: "Abogada y Especialista en Marketing",
        imagen: "img/diana.webp",
        bio: "Diana lidera el equipo con visión y pasión, aportando más de 15 años de experiencia en derecho penal y extranjería. ..."
      },
      {
        nombre: "Germán Ruiz",
        cargo: "Especialista en Marketing, Desarrollo Web y IA",
        imagen: "img/german.webp",
        bio: "Germán impulsa la transformación digital de los proyectos con un enfoque creativo y analítico..."
      },
      {
        nombre: "Liz Otálora",
        cargo: "Especialista en Digitalización y Estrategia de Ventas",
        imagen: "img/liz.webp",
        bio: "Liz aporta una visión estratégica y orientada a resultados..."
      },
      {
        nombre: "Víctor Pérez",
        cargo: "Experto en Desarrollo de Aplicaciones y Web",
        imagen: "img/victor.webp",
        bio: "Víctor combina precisión técnica con visión funcional..."
      },
      {
        nombre: "Carlos Tortajada",
        cargo: "Especialista en Ley de Protección de Datos",
        imagen: "img/carlos.webp",
        bio: "Carlos garantiza la seguridad y el cumplimiento normativo..."
      }
    ];

    let index = 0;

    function expandPerfil(miembro) {
      perfilExpandido.classList.add("visible");
      fotoPerfil.style.backgroundImage = `url(${miembro.imagen})`;
      nombrePerfil.textContent = miembro.nombre;
      cargoPerfil.textContent = miembro.cargo;
      bioTexto.textContent = miembro.bio;
    }

    function renderGaleria() {
      galeria.innerHTML = "";

      for (let i = 0; i < 3; i++) {
        const miembro = miembros[(index + i) % miembros.length];
        const card = document.createElement("div");
        card.className = "card entrada";
        card.style.zIndex = 3 - i;
        card.style.left = `${i * 30}px`;
        card.style.transform = `scale(${1 - i * 0.1}) translateX(${i * 20}px)`;
        card.style.backgroundImage = `url(${miembro.imagen})`;

        card.innerHTML = `
          <div class="card-info">
            <h4>${miembro.nombre}</h4>
            <p>${miembro.cargo}</p>
          </div>
        `;

        card.addEventListener("click", () => expandPerfil(miembro));
        galeria.appendChild(card);

        void card.offsetWidth;
        setTimeout(() => {
          card.classList.remove("entrada");
        }, 20);
      }
    }

    prev.addEventListener("click", () => {
      index = (index - 1 + miembros.length) % miembros.length;
      renderGaleria();
    });

    next.addEventListener("click", () => {
      index = (index + 1) % miembros.length;
      renderGaleria();
    });

    volver.addEventListener("click", () => {
      perfilExpandido.classList.remove("visible");
    });

    renderGaleria();
  }

  // --- Acordeón de servicios ---
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const content = header.nextElementSibling;
      const icon = header.querySelector('.icon');

      document.querySelectorAll('.accordion-content').forEach(item => {
        if (item !== content) {
          item.classList.remove('open');
          item.previousElementSibling.classList.remove('active');
          const otherIcon = item.previousElementSibling.querySelector('.icon');
          if (otherIcon) otherIcon.textContent = '+';
        }
      });

      content.classList.toggle('open');
      header.classList.toggle('active');
      if (icon) {
        icon.textContent = content.classList.contains('open') ? '×' : '+';
      }
    });
  });
});