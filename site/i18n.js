(function () {
  var DICT = {
    en: {
      // Nav
      "YO": "ME", "Biografía": "Biography", "Estudios": "Studies",
      "Idiomas": "Languages", "Experiencia": "Experience", "IA": "AI",
      // YO / hero
      "Soy": "I'm", "Conoce mi trayectoria": "Discover my journey",
      // Biografía
      "Nombre": "Name", "Ubicación": "Location", "Barcelona, España": "Barcelona, Spain",
      "Enfoque": "Focus", "Emprendedor": "Entrepreneur", "Un poco sobre mí": "A bit about me",
      "Me llamo": "My name is", "Inteligencia Artificial": "Artificial Intelligence",
      ". Actualmente me estoy formando en": ". I'm currently training in",
      ", un campo en constante movimiento que me exige —y me gusta— estar aprendiendo todo el tiempo.": ", a constantly evolving field that demands —and I enjoy— learning all the time.",
      "Así es como funciono: cuando me propongo algo, no busco cumplir el mínimo, busco ir un paso más allá. Soy una persona autoexigente y con curiosidad genuina, dispuesta a meterme de lleno en cualquier reto con tal de seguir creciendo.": "This is how I work: when I set out to do something, I don't aim for the minimum, I aim to go one step further. I'm self-demanding and genuinely curious, ready to dive fully into any challenge in order to keep growing.",
      "Aquí abajo tienes el resto de mi trayectoria.": "Below you'll find the rest of my journey.",
      // Estudios
      "Formación": "Education", "Graduado": "Graduated", "En curso": "In progress",
      "Formación actual": "Current training", "Áreas cursadas:": "Areas studied:",
      "Bachillerato Dual (Bachillerato Inglés) — Modalidad Social": "Dual Baccalaureate (English Baccalaureate) — Social Sciences",
      "Ciclo Superior Formativo — Administración y Finanzas": "Higher Vocational Training — Administration & Finance",
      "Recursos Humanos · Contabilidad · Documentación Jurídica · Atención al Cliente, entre otras.": "Human Resources · Accounting · Legal Documentation · Customer Service, among others.",
      "Creación de Contenido Cinematográfico con IA": "AI Film Content Creation",
      // Idiomas
      "Comunicación": "Communication", "Español": "Spanish", "Catalán": "Catalan",
      "Inglés": "English", "Chino": "Chinese", "Nativo": "Native", "Alto": "High",
      "Avanzado": "Advanced", "Medio-alto": "Upper-intermediate",
      // Experiencia
      "Trayectoria": "Career", "Experiencia Laboral": "Work Experience",
      "Recepcionista — Hotel Ciutadella": "Receptionist — Hotel Ciutadella",
      "Actualidad": "Present",
      "Jornada Completa · Mayo 2025 – Actualidad": "Full-time · May 2025 – Present",
      "· Atención al cliente y al huésped.": "· Customer and guest service.",
      "· Realización de check-in y organización diaria de las habitaciones.": "· Check-in and daily room organization.",
      "· Reposición de amenities y mantenimiento del orden visual.": "· Restocking amenities and keeping things tidy.",
      "· Información y orientación a huéspedes.": "· Guest information and guidance.",
      "· Venta de actividades y servicios adicionales.": "· Selling activities and additional services.",
      "Recepcionista de mañanas — Hotel Ciutadella": "Morning Receptionist — Hotel Ciutadella",
      "Prácticas": "Internship",
      "Noviembre 2024 – Abril 2025": "November 2024 – April 2025",
      "· Atención de llamadas telefónicas y mensajes.": "· Handling phone calls and messages.",
      "· Tareas administrativas con conocimiento de PMS.": "· Administrative tasks with PMS knowledge.",
      "· Información y orientación.": "· Information and guidance.",
      "Encargado de Bazar Oriente": "Manager at Bazar Oriente",
      "Autónomo Colaborador": "Self-employed collaborator",
      "· Aprovisionamiento de productos y contacto con proveedores.": "· Product sourcing and supplier contact.",
      "· Gestión de cobros y control de caja.": "· Payment handling and cash control.",
      "· Atención al cliente.": "· Customer service.",
      "· Descarga de palets.": "· Unloading pallets.",
      "Camarero — Farggi": "Waiter — Farggi",
      "Julio – Agosto 2022": "July – August 2022",
      "· Trabajo en equipo.": "· Teamwork.",
      "· Preparación de platos precocinados.": "· Preparing pre-cooked dishes.",
      "· Reposición de productos.": "· Restocking products.",
      "· Preparación de café.": "· Preparing coffee.",
      "· Limpieza general.": "· General cleaning.",
      "Trabajos puntuales": "Occasional jobs",
      "Venta de comida rápida": "Fast food sales",
      "· Venta de alto volumen en comida rápida.": "· High-volume fast food sales.",
      "· Gestión de cobros a clientes.": "· Handling customer payments.",
      "· Trabajo bajo ritmo alto de servicio.": "· Working under high service pace.",
      "Propio puesto — Evento Sabor Salou 2026": "Own stall — Sabor Salou 2026 Event",
      "Emprendimiento propio": "Own venture",
      "· Planteamiento y organización del negocio.": "· Business planning and organization.",
      "· Gestión de compras y gastos.": "· Managing purchases and expenses.",
      "· Selección de productos.": "· Product selection.",
      "Camarero / Cachimbero — M7 Lounge Local": "Waiter / Hookah attendant — M7 Lounge",
      "Atención y coctelería": "Service and cocktails",
      "· Conocimiento de tabaco para cachimba.": "· Knowledge of hookah tobacco.",
      "· Atención y preparación de comandas.": "· Serving and preparing orders.",
      "· Preparación de cachimbas.": "· Preparing hookahs.",
      // IA
      "Mis trabajos": "My work",
      "En este apartado muestro mis trabajos realizados con inteligencia artificial: piezas de publicidad, dirección de arte y contenido visual generado y compuesto por mí. Cada imagen forma parte de campañas reales donde combino IA, fotografía y diseño para dar vida a una marca.": "In this section I showcase my work made with artificial intelligence: advertising pieces, art direction, and visual content generated and composed by me. Each image is part of real campaigns where I combine AI, photography, and design to bring a brand to life.",
      "— Campaña publicitaria con IA": "— AI advertising campaign",
      "Cartel de producto · Oso Familia Burger": "Product poster · Oso Familia Burger",
      "Bodegón de menú · Bear Chicken": "Menu still life · Bear Chicken",
      "Vídeo · Corn dog": "Video · Corn dog",
      "Vídeo · Campaña Bear Chicken": "Video · Bear Chicken campaign",
      "Vídeo · Spot promocional": "Video · Promo spot",
      "Cartel promocional · Corn dog Os Familia": "Promo poster · Corn dog Os Familia",
      "Contenido social · Local Bear Chicken": "Social content · Bear Chicken venue",
      "Contenido social · UGC": "Social content · UGC",
      "Producto · Alitas Bear Chicken": "Product · Bear Chicken wings",
      "Bodegón · Pollo rebozado con mascota": "Still life · Breaded chicken with mascot",
      "Campaña de verano · Bear Chicken": "Summer campaign · Bear Chicken",
      "Ver": "Watch"
    },
    zh: {
      "YO": "关于我", "Biografía": "传记", "Estudios": "学业",
      "Idiomas": "语言", "Experiencia": "经历", "IA": "AI",
      "Soy": "我是", "Conoce mi trayectoria": "了解我的历程",
      "Nombre": "姓名", "Ubicación": "地点", "Barcelona, España": "西班牙巴塞罗那",
      "Enfoque": "方向", "Emprendedor": "创业者", "Un poco sobre mí": "关于我",
      "Me llamo": "我叫", "Inteligencia Artificial": "人工智能",
      ". Actualmente me estoy formando en": "。目前我正在学习",
      ", un campo en constante movimiento que me exige —y me gusta— estar aprendiendo todo el tiempo.": "，这是一个不断变化的领域，它要求我——而我也乐于——始终保持学习。",
      "Así es como funciono: cuando me propongo algo, no busco cumplir el mínimo, busco ir un paso más allá. Soy una persona autoexigente y con curiosidad genuina, dispuesta a meterme de lleno en cualquier reto con tal de seguir creciendo.": "我就是这样的人：当我下定决心做一件事时，我不满足于最低标准，而是力求更进一步。我对自己要求很高，并怀有真正的好奇心，愿意全身心投入任何挑战，只为不断成长。",
      "Aquí abajo tienes el resto de mi trayectoria.": "下面是我其余的经历。",
      "Formación": "学历", "Graduado": "已毕业", "En curso": "进行中",
      "Formación actual": "当前学习", "Áreas cursadas:": "所学领域：",
      "Bachillerato Dual (Bachillerato Inglés) — Modalidad Social": "双文凭高中（英语高中）— 社会科学方向",
      "Ciclo Superior Formativo — Administración y Finanzas": "高级职业培训 — 工商管理与财务",
      "Recursos Humanos · Contabilidad · Documentación Jurídica · Atención al Cliente, entre otras.": "人力资源 · 会计 · 法律文书 · 客户服务等。",
      "Creación de Contenido Cinematográfico con IA": "AI 影视内容创作",
      "Comunicación": "沟通", "Español": "西班牙语", "Catalán": "加泰罗尼亚语",
      "Inglés": "英语", "Chino": "中文", "Nativo": "母语", "Alto": "高级",
      "Avanzado": "进阶", "Medio-alto": "中高级",
      "Trayectoria": "职业历程", "Experiencia Laboral": "工作经历",
      "Recepcionista — Hotel Ciutadella": "前台接待员 — Ciutadella 酒店",
      "Actualidad": "至今",
      "Jornada Completa · Mayo 2025 – Actualidad": "全职 · 2025年5月 – 至今",
      "· Atención al cliente y al huésped.": "· 客户与宾客服务。",
      "· Realización de check-in y organización diaria de las habitaciones.": "· 办理入住及每日客房安排。",
      "· Reposición de amenities y mantenimiento del orden visual.": "· 补充洗浴用品并保持整洁。",
      "· Información y orientación a huéspedes.": "· 为宾客提供信息与指引。",
      "· Venta de actividades y servicios adicionales.": "· 销售活动及附加服务。",
      "Recepcionista de mañanas — Hotel Ciutadella": "早班前台 — Ciutadella 酒店",
      "Prácticas": "实习",
      "Noviembre 2024 – Abril 2025": "2024年11月 – 2025年4月",
      "· Atención de llamadas telefónicas y mensajes.": "· 处理电话与信息。",
      "· Tareas administrativas con conocimiento de PMS.": "· 使用 PMS 系统的行政工作。",
      "· Información y orientación.": "· 提供信息与指引。",
      "Encargado de Bazar Oriente": "东方百货店负责人",
      "Autónomo Colaborador": "自雇合作者",
      "· Aprovisionamiento de productos y contacto con proveedores.": "· 商品采购及供应商联系。",
      "· Gestión de cobros y control de caja.": "· 收款与现金管理。",
      "· Atención al cliente.": "· 客户服务。",
      "· Descarga de palets.": "· 卸载货板。",
      "Camarero — Farggi": "服务员 — Farggi",
      "Julio – Agosto 2022": "2022年7月 – 8月",
      "· Trabajo en equipo.": "· 团队合作。",
      "· Preparación de platos precocinados.": "· 准备预制菜品。",
      "· Reposición de productos.": "· 补充商品。",
      "· Preparación de café.": "· 制作咖啡。",
      "· Limpieza general.": "· 日常清洁。",
      "Trabajos puntuales": "临时工作",
      "Venta de comida rápida": "快餐销售",
      "· Venta de alto volumen en comida rápida.": "· 高销量快餐销售。",
      "· Gestión de cobros a clientes.": "· 处理客户收款。",
      "· Trabajo bajo ritmo alto de servicio.": "· 在高强度服务节奏下工作。",
      "Propio puesto — Evento Sabor Salou 2026": "自营摊位 — Sabor Salou 2026 活动",
      "Emprendimiento propio": "自主创业",
      "· Planteamiento y organización del negocio.": "· 业务策划与组织。",
      "· Gestión de compras y gastos.": "· 采购与支出管理。",
      "· Selección de productos.": "· 商品挑选。",
      "Camarero / Cachimbero — M7 Lounge Local": "服务员 / 水烟师 — M7 Lounge",
      "Atención y coctelería": "服务与调酒",
      "· Conocimiento de tabaco para cachimba.": "· 熟悉水烟烟草。",
      "· Atención y preparación de comandas.": "· 接待并准备点单。",
      "· Preparación de cachimbas.": "· 准备水烟。",
      "Mis trabajos": "我的作品",
      "En este apartado muestro mis trabajos realizados con inteligencia artificial: piezas de publicidad, dirección de arte y contenido visual generado y compuesto por mí. Cada imagen forma parte de campañas reales donde combino IA, fotografía y diseño para dar vida a una marca.": "在这个部分，我展示我用人工智能完成的作品：广告作品、艺术指导，以及由我生成和合成的视觉内容。每一张图片都属于真实的营销活动，我将 AI、摄影与设计结合，为品牌注入生命力。",
      "— Campaña publicitaria con IA": "— AI 广告活动",
      "Cartel de producto · Oso Familia Burger": "产品海报 · Oso Familia Burger",
      "Bodegón de menú · Bear Chicken": "菜单静物 · Bear Chicken",
      "Vídeo · Corn dog": "视频 · Corn dog",
      "Vídeo · Campaña Bear Chicken": "视频 · Bear Chicken 活动",
      "Vídeo · Spot promocional": "视频 · 宣传短片",
      "Cartel promocional · Corn dog Os Familia": "宣传海报 · Corn dog Os Familia",
      "Contenido social · Local Bear Chicken": "社交内容 · Bear Chicken 门店",
      "Contenido social · UGC": "社交内容 · UGC",
      "Producto · Alitas Bear Chicken": "产品 · Bear Chicken 鸡翅",
      "Bodegón · Pollo rebozado con mascota": "静物 · 裹粉炸鸡与吉祥物",
      "Campaña de verano · Bear Chicken": "夏季活动 · Bear Chicken",
      "Ver": "观看"
    }
  };

  var REV = {};
  (function buildRev() {
    for (var lang in DICT) {
      var d = DICT[lang];
      for (var es in d) {
        REV[d[es].trim()] = es;
      }
    }
  })();

  var currentLang = 'es';
  try { currentLang = localStorage.getItem('siteLang') || 'es'; } catch (e) {}
  var applying = false;

  function translateTree(lang) {
    applying = true;
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (!n.nodeValue || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        var p = n.parentNode;
        if (p && (p.tagName === 'SCRIPT' || p.tagName === 'STYLE')) return NodeFilter.FILTER_REJECT;
        if (p && p.closest && p.closest('.lang-switch')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var n;
    while ((n = walker.nextNode())) {
      var raw = n.nodeValue;
      var trimmed = raw.trim();
      var esKey = REV[trimmed] || trimmed; // recover Spanish source whatever the current state
      var target;
      if (lang === 'es') {
        target = esKey;
      } else {
        var t = DICT[lang] && DICT[lang][esKey];
        target = (t != null) ? t : esKey;
      }
      var next = raw.replace(trimmed, target);
      if (n.nodeValue !== next) n.nodeValue = next;
    }
    applying = false;
  }

  function apply(lang) {
    currentLang = lang;
    translateTree(lang);
    document.documentElement.lang = lang;
    updateBtns(lang);
    try { localStorage.setItem('siteLang', lang); } catch (e) {}
  }

  function updateBtns(lang) {
    var btns = document.querySelectorAll('.lang-btn');
    for (var i = 0; i < btns.length; i++) {
      var on = btns[i].getAttribute('data-lang') === lang;
      btns[i].style.background = on ? '#ffffff' : 'transparent';
      btns[i].style.color = on ? '#111827' : 'rgba(255,255,255,0.72)';
    }
  }

  window.setLang = function (l) { apply(l); };

  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('.lang-btn');
    if (!btn) return;
    e.preventDefault();
    var l = btn.getAttribute('data-lang');
    if (l) apply(l);
  });

  var reapplyScheduled = false;
  function scheduleReapply() {
    if (applying || currentLang === 'es' || reapplyScheduled) return;
    reapplyScheduled = true;
    requestAnimationFrame(function () {
      reapplyScheduled = false;
      translateTree(currentLang);
      updateBtns(currentLang);
    });
  }

  function observe() {
    var obs = new MutationObserver(scheduleReapply);
    obs.observe(document.body, { childList: true, characterData: true, subtree: true });
  }

  function init() {
    apply(currentLang);
    observe();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
