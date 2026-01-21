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

  // === Contacto: validación y envío ===
  const initContactForm = (form) => {
    if (!form || form.dataset.mcInit === '1') return;
    form.dataset.mcInit = '1';

    const checkbox = form.querySelector('#privacy');
    const submitBtn = form.querySelector('#submitBtn');
    const nombre = form.querySelector('#nombre');
    const telefono = form.querySelector('#telefono');
    const email = form.querySelector('#email');
    const mensaje = form.querySelector('#mensaje');

    if (checkbox && submitBtn) {
      const toggle = () => { submitBtn.disabled = !checkbox.checked; };
      checkbox.addEventListener('change', toggle);
      toggle();
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const formData = {
        nombre: nombre?.value || '',
        telefono: telefono?.value || '',
        email: email?.value || '',
        mensaje: mensaje?.value || ''
      };

      if (submitBtn) {
        submitBtn.innerHTML = 'Enviando...';
        submitBtn.disabled = true;
      }

      setTimeout(() => {
        alert('¡Gracias! Tu consulta ha sido enviada correctamente. Nos pondremos en contacto contigo pronto.');
        this.reset();
        if (checkbox) checkbox.checked = false;
        if (submitBtn) {
          submitBtn.innerHTML = 'Enviar Consulta';
          submitBtn.disabled = true;
        }
      }, 1500);
    });

    form.querySelectorAll('input, textarea').forEach((input) => {
      input.addEventListener('blur', function () {
        if (this.hasAttribute('required') && !this.value.trim()) {
          this.style.borderColor = '#e74c3c';
        } else {
          this.style.borderColor = '#e1e5e9';
        }
      });
    });

    if (email) {
      email.addEventListener('blur', function () {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (this.value && !emailRegex.test(this.value)) {
          this.style.borderColor = '#e74c3c';
        }
      });
    }
  };

  document.querySelectorAll('form#contactForm').forEach(initContactForm);

    // --- Lógica para el equipo (sección Nuestro Equipo) ---
  document.querySelectorAll('.info-item').forEach(item => {
    item.addEventListener('click', () => {
      const isExpanded = item.classList.contains('expandido');

      document.querySelectorAll('.info-item.expandido').forEach(opened => {
        opened.classList.remove('expandido');
      });

      if (!isExpanded) {
        item.classList.add('expandido');
        const bio = item.querySelector('.bio');
        if (bio && !bio.dataset.loaded) {
          bio.textContent = item.dataset.extra || 'Información adicional próximamente.';
          bio.dataset.loaded = '1';
        }
      }
    });
  });

});

  // === BLOG: integración ===
/*   const blogData = { /* <-- aquí irían los posts que me pasaste */
    /* "posts": */ /* [
      {
        "id": 1,
        "title": "5 estrategias de marketing jurídico que todo despacho debe aplicar en 2025",
        "category": "marketing jurídico",
        "date": "2025-09-15",
        "author": "Germán Ruiz – Socio Fundador y Experto en Marketing Jurídico",
        "image": "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&h=400&fit=crop",
        "excerpt": "En un mercado cada vez más competitivo, los despachos necesitan aplicar estrategias de marketing jurídico modernas, efectivas y éticas para crecer y captar clientes.",
        "content": [
          "En un mercado cada vez más competitivo, los despachos de abogados ya no pueden depender solo del boca-oreja o de referencias profesionales. Para crecer y sobrevivir, es esencial aplicar estrategias de marketing jurídico modernas, efectivas y éticas.",
          "A continuación, te comparto cinco tácticas que estamos aplicando en Jurídika y que están dando resultados reales.",
          "1. Posicionamiento SEO local especializado: No basta con 'abogado en Madrid'; hay que apuntar a nichos concretos como 'abogado penalista en L’Hospitalet' o 'bufete divorcios Barcelona'. Optimiza tu ficha de Google Business, crea páginas locales y publica contenidos con enfoque geográfico.",
          "2. Contenido educativo que resuelve problemas: Publicar artículos que respondan preguntas reales de tus clientes (por ejemplo, '¿Cuánto cuesta una herencia en Cataluña?') te posiciona como autoridad y atrae tráfico cualificado hacia tu despacho.",
          "3. Embudo de captación con lead magnets jurídicos: Una guía práctica (por ejemplo: 'Claves del procedimiento de desahucio') puede servir como imán para captar correos electrónicos. Después, puedes nutrir esos leads con emails, seminarios o asesorías personalizadas.",
          "4. Publicidad dirigida (Google Ads + LinkedIn Ads): Una campaña bien dirigida con palabras clave jurídicas te ayuda a aparecer justo delante de clientes que ya están buscando tus servicios. Google Ads y LinkedIn Ads son los más efectivos en el sector legal.",
          "5. Presencia estratégica en medios y colaboraciones: Escribe columnas en medios locales, participa en podcasts especializados y colabora con revistas jurídicas. Cada aparición refuerza tu reputación y atrae enlaces a tu sitio web, mejorando tu SEO.",
          "Conclusión: Estas cinco estrategias son complementarias: juntas construyen visibilidad, credibilidad y una captación constante de clientes. En Jurídika podemos ayudarte a implementar cada una con rigor y adaptarlas a tu despacho.",
          "✍️ Germán Ruiz – Socio Fundador y Experto en Marketing Jurídico"
        ]
      }, */
      /* {
        "id": 2,
        "title": "10 Destinos Imperdibles en Europa",
        "category": "viajes",
        "date": "2025-09-20",
        "author": "Carlos Martínez",
        "image": "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=400&fit=crop",
        "excerpt": "Una guía completa de los lugares más hermosos...",
        "content": [
          "Europa ofrece una increíble diversidad...",
          "En esta guía, te presentamos 10 destinos...",
          "Prepara tu pasaporte y tu cámara..."
        ]
      }, */
      /* {
        "id": 3,
        "title": "Recetas Mediterráneas para el Verano",
        "category": "cocina",
        "date": "2025-09-25",
        "author": "Ana López",
        "image": "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&h=400&fit=crop",
        "excerpt": "Deliciosas recetas frescas y saludables inspiradas en la cocina mediterránea.",
        "content": [
          "La dieta mediterránea es reconocida mundialmente por sus beneficios para la salud y su increíble sabor. Con ingredientes frescos y preparaciones sencillas, puedes crear platos extraordinarios.",
          "En este artículo compartimos recetas que capturan la esencia del verano mediterráneo: ensaladas frescas, pescados a la parrilla, y postres ligeros que te transportarán a las costas del Mediterráneo.",
          "Estas recetas no solo son deliciosas, sino también nutritivas y perfectas para disfrutar en días calurosos con familia y amigos."
        ]
      }, */
      /* {
        "id": 4,
        "title": "Desarrollo Web Responsive: Guía Completa",
        "category": "tecnología",
        "date": "2025-09-28",
        "author": "Pedro Sánchez",
        "image": "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&h=400&fit=crop",
        "excerpt": "Todo lo que necesitas saber sobre diseño responsive y mejores prácticas.",
        "content": [
          "El diseño responsive ya no es opcional en el desarrollo web moderno. Con la diversidad de dispositivos disponibles, es crucial que tu sitio web se vea perfecto en cualquier pantalla.",
          "Aprenderás sobre media queries, flexbox, CSS Grid y otras técnicas esenciales para crear experiencias web que se adapten perfectamente a móviles, tablets y escritorios.",
          "Implementar un diseño responsive no solo mejora la experiencia del usuario, sino que también beneficia tu SEO y aumenta las conversiones."
        ]
      } */
      // ... (los demás posts que me pasaste)
    /* ]
  }; */

let blogData = null;

// Función para cargar los posts en el listado
function loadPosts(posts) {
  const container = document.getElementById('posts-container');
  const loading = document.querySelector('.loading');
  if (!container) return;

  if (loading) loading.style.display = 'none';
  container.innerHTML = '';

  posts.forEach(post => {
    const postCard = document.createElement('div');
    postCard.className = 'post-card';
    postCard.onclick = () => showArticle(post.id);

    postCard.innerHTML = `
      <img src="${post.image}" alt="${post.title}" class="post-image">
      <div class="post-content">
        <span class="post-category">${post.category}</span>
        <h2 class="post-title">${post.title}</h2>
        <div class="post-meta">${post.date} • ${post.author}</div>
        <p class="post-excerpt">${post.excerpt}</p>
        <span class="read-more">Leer más →</span>
      </div>
    `;
    container.appendChild(postCard);
  });
}

// Función para mostrar un artículo individual
function showArticle(id) {
  const post = blogData.posts.find(p => p.id === id);
  if (!post) return;

  const articleView = document.getElementById('article-view');
  const articleContent = document.getElementById('article-content');
  const blogList = document.getElementById('blog-list');
  if (!articleView || !articleContent || !blogList) return;

  const contentHTML = post.content.map(p => `<p>${p}</p>`).join('');

  articleContent.innerHTML = `
    <div class="article-header">
      <span class="post-category">${post.category}</span>
      <h1 class="article-title">${post.title}</h1>
      <div class="post-meta">${post.date} • Por ${post.author}</div>
    </div>
    <img src="${post.image}" alt="${post.title}" class="article-image">
    <div class="article-body">
      ${contentHTML}
    </div>
  `;

  // Cambiar vista
  blogList.style.display = 'none';
  articleView.classList.add('active');
  window.scrollTo(0, 0);
}

// Función para volver al listado
function showHome() {
  const articleView = document.getElementById('article-view');
  const blogList = document.getElementById('blog-list');
  if (!articleView || !blogList) return;

  articleView.classList.remove('active');
  blogList.style.display = 'block';
  window.scrollTo(0, 0);
}

// Función para filtrar por categoría
function filterCategory(category) {
  const filtered = blogData.posts.filter(post => post.category === category);
  loadPosts(filtered);
  showHome();
}

// Cargar datos del JSON
fetch('blog.json')
  .then(response => response.json())
  .then(data => {
    blogData = data;
    loadPosts(data.posts);
  })
  .catch(error => {
    console.error('Error cargando el blog:', error);
    document.querySelector('.loading').textContent = 'Error al cargar los artículos';
  });
