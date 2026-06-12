// ═══════════════════════════════════════════════════════════════════
//  SOLARA Brand Documentation Portal — Interactive Engine v2.0
//  Premium Coastal Luxury SPA with Theme Switching, Chart.js,
//  Ambient Canvas, Counter Animations & Glass-Card Glow Tracking
// ═══════════════════════════════════════════════════════════════════

document.addEventListener("DOMContentLoaded", () => {
  // ── Core Navigation & Sections ──
  initNavigation();
  initMobileMenu();

  // ── Premium Visual Upgrades ──
  initThemeSwitcher();
  initGlassCardGlow();
  initAmbientCanvas();
  initAnimateCounters();

  // ── Content & Data Sections ──
  initSWOT();
  initCalendar();
  initCompetitorCharts();
  initViewModeToggle();
  initChartJS();
  initBeforeAfterSlider();
  initUGCBriefs();
  initTimer();
  initGallery();
  initLightbox();
});

// ═══════════════════════════════════════════════════════════════════
//  §1  NAVIGATION PANEL CONTROLS
// ═══════════════════════════════════════════════════════════════════
function initNavigation() {
  const navItems = document.querySelectorAll(".nav-item");
  const sections = document.querySelectorAll(".page-section");

  navItems.forEach(item => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const targetSectionId = item.getAttribute("data-section");

      // Set active nav item
      navItems.forEach(nav => nav.classList.remove("active"));
      item.classList.add("active");

      // Set active page section
      sections.forEach(sec => {
        if (sec.id === targetSectionId) {
          sec.classList.add("active");
        } else {
          sec.classList.remove("active");
        }
      });

      // Close mobile sidebar if open
      const sidebar = document.getElementById("sidebar");
      if (sidebar && sidebar.classList.contains("mobile-open")) {
        sidebar.classList.remove("mobile-open");
      }

      // Auto-scroll to top of main content
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

// ═══════════════════════════════════════════════════════════════════
//  §1.1  MOBILE MENU TOGGLE
// ═══════════════════════════════════════════════════════════════════
function initMobileMenu() {
  const toggleBtn = document.getElementById("mobileMenuToggle");
  const sidebar = document.getElementById("sidebar");

  if (!toggleBtn || !sidebar) return;

  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("mobile-open");
  });

  // Close sidebar on outside click (mobile)
  document.addEventListener("click", (e) => {
    if (sidebar.classList.contains("mobile-open") &&
        !sidebar.contains(e.target) &&
        !toggleBtn.contains(e.target)) {
      sidebar.classList.remove("mobile-open");
    }
  });
}

// ═══════════════════════════════════════════════════════════════════
//  §2  THEME SWITCHER (localStorage Backed)
// ═══════════════════════════════════════════════════════════════════
function initThemeSwitcher() {
  const themeButtons = document.querySelectorAll(".btn-theme-selector");
  if (!themeButtons.length) return;

  // Load saved theme or default to deepsea
  const savedTheme = localStorage.getItem("solara-theme") || "deepsea";
  applyTheme(savedTheme);

  // Mark the saved theme button as active
  themeButtons.forEach(btn => {
    const btnTheme = btn.getAttribute("data-theme");
    if (btnTheme === savedTheme) {
      btn.classList.add("active");
      btn.style.border = `1px solid var(--color-sand)`;
      btn.style.background = `rgba(var(--color-sand-rgb), 0.15)`;
      btn.style.color = `var(--color-sand)`;
    } else {
      btn.classList.remove("active");
      btn.style.border = `1px solid var(--glass-border)`;
      btn.style.background = `rgba(14,24,38,0.3)`;
      btn.style.color = `var(--color-text-soft)`;
    }
  });

  themeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const theme = btn.getAttribute("data-theme");

      // Update active states
      themeButtons.forEach(b => {
        b.classList.remove("active");
        b.style.border = `1px solid var(--glass-border)`;
        b.style.background = `rgba(14,24,38,0.3)`;
        b.style.color = `var(--color-text-soft)`;
      });
      btn.classList.add("active");
      btn.style.border = `1px solid var(--color-sand)`;
      btn.style.background = `rgba(var(--color-sand-rgb), 0.15)`;
      btn.style.color = `var(--color-sand)`;

      applyTheme(theme);
      localStorage.setItem("solara-theme", theme);

      // Re-render Chart.js if active to pick up new theme colors
      if (document.getElementById("interactiveContainer") &&
          document.getElementById("interactiveContainer").style.display !== "none") {
        destroyCharts();
        initChartJS();
      }
    });
  });
}

function applyTheme(theme) {
  document.body.classList.remove("theme-deepsea", "theme-sunset", "theme-ivory");
  document.body.classList.add(`theme-${theme}`);
}

// ═══════════════════════════════════════════════════════════════════
//  §3  GLASS CARD MOUSE-HOVER GLOW TRACKING
// ═══════════════════════════════════════════════════════════════════
function initGlassCardGlow() {
  // Use event delegation on the main content area for performance
  const mainContent = document.querySelector(".main-content");
  if (!mainContent) return;

  mainContent.addEventListener("mousemove", (e) => {
    const card = e.target.closest(".glass-card");
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty("--glow-x", `${x}px`);
    card.style.setProperty("--glow-y", `${y}px`);
  });
}

// ═══════════════════════════════════════════════════════════════════
//  §4  ANIMATED COUNTERS (IntersectionObserver)
// ═══════════════════════════════════════════════════════════════════
function initAnimateCounters() {
  const counters = document.querySelectorAll(".counter");
  if (!counters.length) return;

  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        counters.forEach(counter => {
          const target = parseInt(counter.getAttribute("data-target"), 10);
          if (isNaN(target)) return;

          const duration = 2000; // 2 seconds
          const startTime = performance.now();
          const startValue = 0;

          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease-out cubic for smooth deceleration
            const eased = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.round(startValue + (target - startValue) * eased);

            counter.textContent = currentValue.toLocaleString("en-US");

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              counter.textContent = target.toLocaleString("en-US");
            }
          }

          requestAnimationFrame(updateCounter);
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.05 });

  // Observe the dashboard section (parent of the counters)
  const dashboard = document.getElementById("dashboard");
  if (dashboard) {
    observer.observe(dashboard);
  }
}

// ═══════════════════════════════════════════════════════════════════
//  §5  AMBIENT FLOATING CANVAS (Beach Dust Particles)
// ═══════════════════════════════════════════════════════════════════
let ambientAnimFrame = null;

function initAmbientCanvas() {
  const canvas = document.getElementById("ambientCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let particles = [];
  const PARTICLE_COUNT = 50;

  function resize() {
    const parent = canvas.parentElement;
    canvas.width = parent.offsetWidth;
    canvas.height = parent.offsetHeight;
  }

  window.addEventListener("resize", resize);
  resize();

  // Get theme-aware particle color
  function getParticleColor() {
    const sandRGB = getComputedStyle(document.documentElement)
      .getPropertyValue("--color-sand-rgb").trim();
    return sandRGB || "223, 183, 118";
  }

  // Create particles
  function createParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2.5 + 0.5,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.4 + 0.1,
        opacityDir: Math.random() > 0.5 ? 1 : -1,
        opacitySpeed: Math.random() * 0.003 + 0.001,
      });
    }
  }

  createParticles();

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const rgb = getParticleColor();

    particles.forEach(p => {
      // Twinkle opacity
      p.opacity += p.opacityDir * p.opacitySpeed;
      if (p.opacity >= 0.5) { p.opacityDir = -1; }
      if (p.opacity <= 0.05) { p.opacityDir = 1; }

      // Move
      p.x += p.speedX;
      p.y += p.speedY;

      // Wrap around
      if (p.x < -10) p.x = canvas.width + 10;
      if (p.x > canvas.width + 10) p.x = -10;
      if (p.y < -10) p.y = canvas.height + 10;
      if (p.y > canvas.height + 10) p.y = -10;

      // Draw
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rgb}, ${p.opacity})`;
      ctx.fill();
    });

    ambientAnimFrame = requestAnimationFrame(animate);
  }

  animate();
}

// ═══════════════════════════════════════════════════════════════════
//  §6  INTERACTIVE SWOT QUADRANTS
// ═══════════════════════════════════════════════════════════════════
function initSWOT() {
  const swotCards = document.querySelectorAll(".swot-quadrant");

  swotCards.forEach(card => {
    card.addEventListener("click", () => {
      // Toggle a small glow effect
      card.style.transform = "scale(1.03)";
      setTimeout(() => {
        card.style.transform = "scale(1.02)";
      }, 200);
    });
  });
}

// ═══════════════════════════════════════════════════════════════════
//  §7  CALENDAR ENGINE (Filters & Search)
// ═══════════════════════════════════════════════════════════════════
function initCalendar() {
  const container = document.getElementById("calendarGrid");
  const platformSelect = document.getElementById("platformFilter");
  const searchInput = document.getElementById("searchCalendar");

  // Render calendar cards
  function renderCalendar(filteredData) {
    container.innerHTML = "";

    if (filteredData.length === 0) {
      container.innerHTML = `<div class="glass-card" style="grid-column: 1/-1; text-align: center; color: var(--color-text-soft);">لا توجد منشورات تطابق البحث أو التصنيف المحدد.</div>`;
      return;
    }

    filteredData.forEach(dayData => {
      dayData.posts.forEach(post => {
        const card = document.createElement("div");
        card.className = "glass-card calendar-card";

        const platClass = "platform-" + post.platform.toLowerCase();

        card.innerHTML = `
          <div class="calendar-header">
            <span class="day-badge">اليوم ${dayData.day}</span>
            <span class="platform-badge ${platClass}">${post.platform.toUpperCase()}</span>
          </div>
          <div class="post-meta-row">
            <span>الجمهور: ${post.persona_framework.split(' ')[0]}</span>
            <span>النموذج: ${post.persona_framework.split(' ')[1] || 'STORY'}</span>
          </div>
          <div class="post-caption" id="caption-d${dayData.day}-${post.platform}">${post.caption || 'لا يوجد نص'}</div>
          <div class="post-visual"><strong>التوجيه البصري:</strong><br>${post.visual_brief}</div>
          <div class="post-hashtags">${post.hashtags || ''}</div>
          <div class="post-actions">
            <button class="btn-copy" onclick="copyCaption('caption-d${dayData.day}-${post.platform}')">نسخ النص</button>
          </div>
        `;
        container.appendChild(card);
      });
    });
  }

  // Filter calendar
  function filterCalendar() {
    const selectedPlatform = platformSelect.value.toLowerCase();
    const query = searchInput.value.toLowerCase();

    const filtered = contentPlanData.map(day => {
      // Deep copy to prevent mutating raw data
      const postsCopy = day.posts.filter(post => {
        const matchPlatform = selectedPlatform === "all" || post.platform.toLowerCase() === selectedPlatform;
        const matchQuery = !query ||
          post.caption.toLowerCase().includes(query) ||
          post.visual_brief.toLowerCase().includes(query) ||
          post.persona_framework.toLowerCase().includes(query) ||
          `اليوم ${day.day}`.includes(query);
        return matchPlatform && matchQuery;
      });
      return { ...day, posts: postsCopy };
    }).filter(day => day.posts.length > 0);

    renderCalendar(filtered);
  }

  // Bind inputs
  if (platformSelect && searchInput) {
    platformSelect.addEventListener("change", filterCalendar);
    searchInput.addEventListener("input", filterCalendar);
  }

  // Initial render
  if (typeof contentPlanData !== "undefined") {
    renderCalendar(contentPlanData);
  }
}

// Global Caption Copy Helper
window.copyCaption = function(elementId) {
  const captionElement = document.getElementById(elementId);
  if (!captionElement) return;

  const textToCopy = captionElement.innerText;
  navigator.clipboard.writeText(textToCopy).then(() => {
    showToast("تم نسخ الكابشن بنجاح! 📋");
  }).catch(err => {
    console.error("فشل النسخ: ", err);
  });
}

function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.innerText = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

// ═══════════════════════════════════════════════════════════════════
//  §8  COMPETITORS METRICS (Rival IQ Tab Changer)
// ═══════════════════════════════════════════════════════════════════
function initCompetitorCharts() {
  const chartButtons = document.querySelectorAll(".btn-chart-tab");
  const chartImages = {
    instagram: [
      { id: "img-posts", src: "../05 - Website, SEO & Competitors/Rival IQ Competitor Performance Charts/Instagram/البوستات خلال الشهر.png", title: "معدل نشر البوستات (إنستجرام)" },
      { id: "img-eng", src: "../05 - Website, SEO & Competitors/Rival IQ Competitor Performance Charts/Instagram/عدد التفاعل خلال الشهر.png", title: "حجم التفاعل الإجمالي (إنستجرام)" },
      { id: "img-followers", src: "../05 - Website, SEO & Competitors/Rival IQ Competitor Performance Charts/Instagram/عدد المتابعين.png", title: "نمو وحجم المتابعين (إنستجرام)" },
      { id: "img-eng-rate", src: "../05 - Website, SEO & Competitors/Rival IQ Competitor Performance Charts/Instagram/نسبة التفاعل بالنسبة للمتابعين خلال الشهر.png", title: "نسبة التفاعل لكل بوست (إنستجرام)" }
    ],
    facebook: [
      { id: "img-posts", src: "../05 - Website, SEO & Competitors/Rival IQ Competitor Performance Charts/Facebook/البوستات خلال الشهر.png", title: "معدل نشر البوستات (فيسبوك)" },
      { id: "img-eng", src: "../05 - Website, SEO & Competitors/Rival IQ Competitor Performance Charts/Facebook/عدد التفاعل خلال الشهر.png", title: "حجم التفاعل الإجمالي (فيسبوك)" },
      { id: "img-followers", src: "../05 - Website, SEO & Competitors/Rival IQ Competitor Performance Charts/Facebook/عدد المتابعين.png", title: "نمو وحجم المتابعين (فيسبوك)" },
      { id: "img-eng-rate", src: "../05 - Website, SEO & Competitors/Rival IQ Competitor Performance Charts/Facebook/نسبة التفاعل بالنسبة للمتابعين خلال الشهر.png", title: "نسبة التفاعل لكل بوست (فيسبوك)" }
    ],
    tiktok: [
      { id: "img-posts", src: "../05 - Website, SEO & Competitors/Rival IQ Competitor Performance Charts/TikTok/البوستات خلال الشهر.png", title: "معدل نشر الفيديوهات (تيك توك)" },
      { id: "img-eng", src: "../05 - Website, SEO & Competitors/Rival IQ Competitor Performance Charts/TikTok/عدد التفاعل خلال الشهر.png", title: "حجم التفاعل الإجمالي (تيك توك)" },
      { id: "img-followers", src: "../05 - Website, SEO & Competitors/Rival IQ Competitor Performance Charts/TikTok/عدد المتابعين.png", title: "نمو وحجم المتابعين (تيك توك)" },
      { id: "img-eng-rate", src: "../05 - Website, SEO & Competitors/Rival IQ Competitor Performance Charts/TikTok/نسبة التفاعل بالنسبة للمتابعين خلال الشهر.png", title: "نسبة التفاعل لكل فيديو (تيك توك)" }
    ],
    crosschannel: [
      { id: "img-posts", src: "../05 - Website, SEO & Competitors/Rival IQ Competitor Performance Charts/مجموع المنصات/البوستات خلال الشهر.png", title: "إجمالي المنشورات عبر كافة المنصات" },
      { id: "img-eng", src: "../05 - Website, SEO & Competitors/Rival IQ Competitor Performance Charts/مجموع المنصات/عدد التفاعل خلال الشهر.png", title: "إجمالي التفاعل عبر كافة المنصات" },
      { id: "img-followers", src: "../05 - Website, SEO & Competitors/Rival IQ Competitor Performance Charts/مجموع المنصات/عدد المتابعين.png", title: "إجمالي حجم المتابعين الكلي للمنافسين" },
      { id: "img-eng-rate", src: "../05 - Website, SEO & Competitors/Rival IQ Competitor Performance Charts/مجموع المنصات/الكومنتات خلال الشهر.png", title: "معدل كتابة التعليقات وتفاعل الجمهور" }
    ]
  };

  chartButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      chartButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const platform = btn.getAttribute("data-platform");
      const currentList = chartImages[platform];

      if (currentList) {
        currentList.forEach(item => {
          const imgEl = document.getElementById(item.id);
          if (!imgEl) return;
          const titleEl = imgEl.nextElementSibling;

          imgEl.src = item.src;
          if (titleEl) titleEl.innerText = item.title;
        });
      }
    });
  });
}

// ═══════════════════════════════════════════════════════════════════
//  §8.1  VIEW MODE TOGGLE (Rival IQ Static vs Chart.js Interactive)
// ═══════════════════════════════════════════════════════════════════
function initViewModeToggle() {
  const viewButtons = document.querySelectorAll(".btn-view-mode");
  const rivaliqContainer = document.getElementById("rivaliqContainer");
  const interactiveContainer = document.getElementById("interactiveContainer");

  if (!viewButtons.length || !rivaliqContainer || !interactiveContainer) return;

  viewButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const mode = btn.getAttribute("data-mode");

      // Update button styles
      viewButtons.forEach(b => {
        b.classList.remove("active");
        b.style.border = `1px solid var(--glass-border)`;
        b.style.background = `transparent`;
        b.style.color = `var(--color-text-soft)`;
      });
      btn.classList.add("active");
      btn.style.border = `1px solid var(--color-sand)`;
      btn.style.background = `rgba(var(--color-sand-rgb), 0.15)`;
      btn.style.color = `var(--color-sand)`;

      if (mode === "rivaliq") {
        rivaliqContainer.style.display = "";
        interactiveContainer.style.display = "none";
      } else if (mode === "interactive") {
        rivaliqContainer.style.display = "none";
        interactiveContainer.style.display = "grid";
        // Ensure charts are initialized on first view
        initChartJS();
      }
    });
  });
}

// ═══════════════════════════════════════════════════════════════════
//  §9  CHART.JS INTERACTIVE COMPETITOR CHARTS
// ═══════════════════════════════════════════════════════════════════
let chartInstances = {};

function destroyCharts() {
  Object.values(chartInstances).forEach(chart => {
    if (chart) chart.destroy();
  });
  chartInstances = {};
}

function initChartJS() {
  if (typeof Chart === "undefined") return;

  // Don't re-initialize if charts already exist
  if (Object.keys(chartInstances).length > 0) return;

  // Get theme-aware colors
  const styles = getComputedStyle(document.documentElement);
  const sandColor = styles.getPropertyValue("--color-sand").trim() || "#dfb776";
  const terracottaColor = styles.getPropertyValue("--color-terracotta").trim() || "#c4703f";
  const textSoft = styles.getPropertyValue("--color-text-soft").trim() || "#8ea3b8";
  const pearlColor = styles.getPropertyValue("--color-pearl").trim() || "#faf8f5";
  const gridColor = styles.getPropertyValue("--glass-border").trim() || "rgba(223, 183, 118, 0.15)";

  // Common chart styling
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: textSoft,
          font: { family: "'Cairo', sans-serif", size: 11 },
          padding: 16,
          usePointStyle: true,
          pointStyleWidth: 12,
        },
      },
      tooltip: {
        backgroundColor: "rgba(6, 12, 19, 0.95)",
        titleFont: { family: "'Cairo', sans-serif", size: 13, weight: "bold" },
        bodyFont: { family: "'Montserrat', sans-serif", size: 12 },
        titleColor: sandColor,
        bodyColor: "#e0e0e0",
        borderColor: sandColor,
        borderWidth: 1,
        cornerRadius: 10,
        padding: 12,
        displayColors: true,
      },
    },
    scales: {
      x: {
        ticks: {
          color: textSoft,
          font: { family: "'Cairo', sans-serif", size: 11 },
        },
        grid: { color: gridColor, drawBorder: false },
      },
      y: {
        ticks: {
          color: textSoft,
          font: { family: "'Montserrat', sans-serif", size: 11 },
        },
        grid: { color: gridColor, drawBorder: false },
      },
    },
  };

  // Competitor labels
  const labels = ["سولارا (SOLARA)", "كوفا (KOFFA)", "خوص (Khoos)", "سيمبليستي", "الأزياء السريعة"];

  // Chart color palette per competitor
  const chartColors = [
    sandColor,                        // SOLARA — brand gold
    "#6ec6ff",                        // KOFFA — ocean blue
    "#81c784",                        // Khoos — eco green
    "#ba68c8",                        // Simplicity — art purple
    terracottaColor,                  // Fast Fashion — terracotta
  ];

  const chartColorsBg = chartColors.map(c => c + "33");

  // ── Chart 1: Total Followers (Bar) ──
  const followersCtx = document.getElementById("followersChart");
  if (followersCtx) {
    chartInstances.followers = new Chart(followersCtx.getContext("2d"), {
      type: "bar",
      data: {
        labels: labels,
        datasets: [{
          label: "إجمالي المتابعين (Cross-Platform)",
          data: [2800, 185000, 64000, 12500, 950000],
          backgroundColor: chartColors.map(c => c + "CC"),
          borderColor: chartColors,
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
        }],
      },
      options: {
        ...commonOptions,
        plugins: {
          ...commonOptions.plugins,
          legend: { display: false },
        },
        scales: {
          ...commonOptions.scales,
          y: {
            ...commonOptions.scales.y,
            ticks: {
              ...commonOptions.scales.y.ticks,
              callback: (val) => {
                if (val >= 1000000) return (val / 1000000).toFixed(1) + "M";
                if (val >= 1000) return (val / 1000).toFixed(0) + "K";
                return val;
              },
            },
          },
        },
      },
    });
  }

  // ── Chart 2: Monthly Posts (Radar) ──
  const postsCtx = document.getElementById("postsChart");
  if (postsCtx) {
    chartInstances.posts = new Chart(postsCtx.getContext("2d"), {
      type: "radar",
      data: {
        labels: ["إنستجرام", "فيسبوك", "تيك توك", "قصص", "ريلز"],
        datasets: [
          {
            label: "سولارا (SOLARA)",
            data: [28, 20, 24, 45, 30],
            borderColor: sandColor,
            backgroundColor: sandColor + "25",
            borderWidth: 2,
            pointBackgroundColor: sandColor,
            pointRadius: 4,
          },
          {
            label: "كوفا (KOFFA)",
            data: [22, 18, 8, 30, 20],
            borderColor: "#6ec6ff",
            backgroundColor: "#6ec6ff20",
            borderWidth: 2,
            pointBackgroundColor: "#6ec6ff",
            pointRadius: 4,
          },
          {
            label: "خوص (Khoos)",
            data: [16, 14, 4, 12, 8],
            borderColor: "#81c784",
            backgroundColor: "#81c78420",
            borderWidth: 2,
            pointBackgroundColor: "#81c784",
            pointRadius: 4,
          },
        ],
      },
      options: {
        ...commonOptions,
        scales: {
          r: {
            grid: { color: gridColor },
            angleLines: { color: gridColor },
            pointLabels: {
              color: textSoft,
              font: { family: "'Cairo', sans-serif", size: 11 },
            },
            ticks: {
              color: textSoft,
              backdropColor: "transparent",
              font: { size: 9 },
            },
          },
        },
      },
    });
  }

  // ── Chart 3: Engagement Rate (Doughnut) ──
  const engCtx = document.getElementById("engagementChart");
  if (engCtx) {
    chartInstances.engagement = new Chart(engCtx.getContext("2d"), {
      type: "doughnut",
      data: {
        labels: labels,
        datasets: [{
          label: "نسبة التفاعل لكل بوست (%)",
          data: [4.8, 2.1, 3.5, 1.9, 0.4],
          backgroundColor: chartColors.map(c => c + "CC"),
          borderColor: chartColors,
          borderWidth: 2,
          hoverOffset: 12,
        }],
      },
      options: {
        ...commonOptions,
        cutout: "60%",
        scales: {},
        plugins: {
          ...commonOptions.plugins,
          tooltip: {
            ...commonOptions.plugins.tooltip,
            callbacks: {
              label: (ctx) => `${ctx.label}: ${ctx.parsed}%`,
            },
          },
        },
      },
    });
  }
}

// ═══════════════════════════════════════════════════════════════════
//  §10  BEFORE & AFTER PHOTOGRAPHY SLIDER
// ═══════════════════════════════════════════════════════════════════
function initBeforeAfterSlider() {
  const sliderContainer = document.getElementById("photoSlider");
  if (!sliderContainer) return;

  const beforeContainer = document.querySelector(".img-before");
  const handle = document.querySelector(".slider-handle");
  if (!beforeContainer || !handle) return;

  const beforeImg = beforeContainer.querySelector("img");

  const selectButtons = document.querySelectorAll(".btn-slider-select");

  const photoPairs = {
    abdeldayem: {
      before: "../07 - Product Photography/Abdeldayem/Old/76.jpg",
      after: "../07 - Product Photography/Abdeldayem/New/Gemini_Generated_Image_5k9jfd5k9jfd5k9j.png"
    },
    adham: {
      before: "../07 - Product Photography/Adham/Before/78.jpg",
      after: "../07 - Product Photography/Adham/After/Gemini_Generated_Image_8wymi98wymi98wym.png"
    },
    khaled: {
      before: "../07 - Product Photography/Khaled/Old/100.jpg",
      after: "../07 - Product Photography/Khaled/New/Gemini_Generated_Image_wy53fuwy53fuwy53.png"
    },
    yussuf: {
      before: "../07 - Product Photography/Yussuf/Before/85.jpg",
      after: "../07 - Product Photography/Yussuf/After/Gemini_Generated_Image_ye1pr2ye1pr2ye1p.png"
    }
  };

  // Change active pair
  selectButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      selectButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const pairKey = btn.getAttribute("data-pair");
      const pair = photoPairs[pairKey];

      if (pair) {
        const afterImg = document.querySelector(".img-after img");
        beforeImg.src = pair.before;
        afterImg.src = pair.after;

        // Reset slider to middle
        updateSliderWidth(50);
      }
    });
  });

  // Slider Dragging Mechanics
  let isDragging = false;

  function updateSliderWidth(percent) {
    if (percent < 0) percent = 0;
    if (percent > 100) percent = 100;

    beforeContainer.style.width = percent + "%";
    handle.style.left = percent + "%";
  }

  function handleMove(e) {
    if (!isDragging) return;

    const rect = sliderContainer.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const percent = (x / rect.width) * 100;

    updateSliderWidth(percent);
  }

  sliderContainer.addEventListener("mousedown", () => isDragging = true);
  window.addEventListener("mouseup", () => isDragging = false);
  sliderContainer.addEventListener("mousemove", handleMove);

  // Mobile support
  sliderContainer.addEventListener("touchstart", () => isDragging = true);
  window.addEventListener("touchend", () => isDragging = false);
  sliderContainer.addEventListener("touchmove", handleMove);

  // Set initial fixed size for inner before image to prevent compression
  function adjustImageSizes() {
    const containerWidth = sliderContainer.offsetWidth;
    beforeImg.style.width = containerWidth + "px";
  }

  window.addEventListener("resize", adjustImageSizes);
  adjustImageSizes();
}

// ═══════════════════════════════════════════════════════════════════
//  §11  UGC VIDEO & SCRIPT SELECTOR
// ═══════════════════════════════════════════════════════════════════
function initUGCBriefs() {
  const briefCards = document.querySelectorAll(".ugc-brief-card");
  const briefText = document.getElementById("ugcBriefText");
  const videoPlayer = document.getElementById("campaignVideo");

  const scripts = {
    teasing: {
      src: "../08 - Videos & UGC Campaigns/Teasing Campaign/VID_20260609_040809_113_bsl.mp4",
      text: `🎬 **حملة التشويق الغامض (Teaser Campaign Brief)**
      
**الهدف**: إثارة فضول المتابعين لمعرفة معنى اسم SOLARA وتصميماته.
**المنصات**: Instagram Reels + TikTok.
**التوجيه البصري**: شاشة سوداء يظهر عليها حروف متباعدة بالتدريج بأسلوب غامض، تليها لقطة ASMR لشخص يكتب على رمل البحر.
**سكريبت الـ UGC**:
- (صوت بحر هادئ)
- الفتاة في الفيديو: "الصيف ده فيه سر هينزل على الرمل ومحدش مستعد له..."
- (لقطة مقربة لصندوق أزرق فاخر على الرمل)
- "اسم واحد هيلخص حكاية صيفك كله.. تفتكروا إيه؟ اكتبوا في الكومنتات!"`
    },
    ai_reels: {
      src: "../08 - Videos & UGC Campaigns/hf_20260608_224824_d1beb5d5-1a67-44bd-b72b-6ce2b11deddb.mp4",
      text: `🎬 **حملة التخصيص عبر الذكاء الاصطناعي (AI Customization Ad Brief)**
      
**الهدف**: إبراز هوية التخصيص بالاسم والشنط المطرزة يدويًا.
**المنصات**: Instagram Reels + Multi-channel.
**التوجيه البصري**: تنقل سريع بين لقطات تفصيلية للجلد، نقش الأسماء بالليزر، خيوط كتان طبيعية مع إضاءة الشمس الذهبية.
**سكريبت الـ UGC**:
- "تخيل إن الشنطة اللي بتشيلها على البحر مكتوب عليها اسمك أنت لوحدك؟"
- (لقطة للمعدن الفاخر المحفور بالليزر)
- "براند SOLARA بيعمل شنط صيفية بتطريز وحفر ليزر مخصوص عشان تحسي إنها معمولة لشخص واحد بس.. صيفك بطابعك المفضل!"`
    },
    unboxing: {
      src: "../08 - Videos & UGC Campaigns/hf_20260609_001608_256116a6-6490-4d1e-8afa-5e5164b05890.mp4",
      text: `🎬 **ريلز فتح الهدية وتجربة العميل (Unboxing & Gifting Campaign Brief)**
      
**الهدف**: التركيز على القيمة العاطفية للإهداء والتغليف الفاخر.
**المنصات**: TikTok + Instagram Stories.
**التوجيه البصري**: فتاة تفتح علبة زرقاء فاخرة، يظهر الورق الحريري، ثم تخرج الشنطة والستيكر المخصص وكارت الشكر باسمها.
**سكريبت الـ UGC**:
- "لما صحبتي بعتتلي الهدية دي مصدقتش عيني!"
- (مشهد unboxing حقيقي ومتحمس)
- "العلبة ريحتها صيف وبحر، والشنطة الخوص الجلد محفور عليها حروفي.. أحلى هدية صيفية شفتها في حياتي!"`
    }
  };

  briefCards.forEach(card => {
    card.addEventListener("click", () => {
      briefCards.forEach(c => c.classList.remove("active"));
      card.classList.add("active");

      const briefKey = card.getAttribute("data-brief");
      const data = scripts[briefKey];

      if (data) {
        // Update video source
        videoPlayer.src = data.src;
        videoPlayer.load();

        // Parse markdown-like bold text for display
        let htmlText = data.text
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\n/g, '<br>');
        briefText.innerHTML = htmlText;
      }
    });
  });
}

// ═══════════════════════════════════════════════════════════════════
//  §12  PITCH COUNTDOWN TIMER
// ═══════════════════════════════════════════════════════════════════
function initTimer() {
  const timerDisplay = document.getElementById("timerDisplay");
  const btnStart = document.getElementById("btnTimerStart");
  const btnPause = document.getElementById("btnTimerPause");
  const btnReset = document.getElementById("btnTimerReset");

  let durationSeconds = 20 * 60; // 20 minutes default
  let timerInterval = null;
  let isTimerRunning = false;

  function updateDisplay(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    timerDisplay.innerText =
      (min < 10 ? "0" + min : min) + ":" + (sec < 10 ? "0" + sec : sec);
  }

  function startTimer() {
    if (isTimerRunning) return;
    isTimerRunning = true;
    timerInterval = setInterval(() => {
      if (durationSeconds > 0) {
        durationSeconds--;
        updateDisplay(durationSeconds);
      } else {
        clearInterval(timerInterval);
        isTimerRunning = false;
        timerDisplay.style.color = "#f44336"; // Turn red when finished
        showToast("انتهى وقت مناقشة العرض (20 دقيقة)! 🎓");
      }
    }, 1000);
  }

  function pauseTimer() {
    clearInterval(timerInterval);
    isTimerRunning = false;
  }

  function resetTimer() {
    clearInterval(timerInterval);
    isTimerRunning = false;
    durationSeconds = 20 * 60;
    timerDisplay.style.color = "var(--color-sand)";
    updateDisplay(durationSeconds);
  }

  if (btnStart && btnPause && btnReset) {
    btnStart.addEventListener("click", startTimer);
    btnPause.addEventListener("click", pauseTimer);
    btnReset.addEventListener("click", resetTimer);
  }
}

// ═══════════════════════════════════════════════════════════════════
//  §13  FULL PRODUCT GALLERY TAB SWITCHER & DYNAMIC RENDERING
// ═══════════════════════════════════════════════════════════════════
function initGallery() {
  const tabs = document.querySelectorAll(".product-tab-btn");
  const container = document.getElementById("galleryContent");

  if (!tabs.length || !container || typeof productGalleryData === "undefined") return;

  function renderGallery(memberKey) {
    const data = productGalleryData[memberKey];
    if (!data) return;

    container.innerHTML = `
      <div class="glass-card">
        <h3 style="color: var(--color-sand); font-size: 20px; font-weight: 700; margin-bottom: 6px;">${data.name}</h3>
        <p class="section-subtitle" style="margin-bottom: 24px; color: var(--color-text-soft); font-size: 14px;">${data.description}</p>
        
        <div class="product-gallery-section-title" style="font-size: 16px; font-weight: 700; color: var(--color-sand-light); margin-bottom: 16px; border-bottom: 1px solid var(--glass-border); padding-bottom: 8px;">صور ما قبل المعالجة (Before Raw)</div>
        <div class="product-gallery-grid" id="beforeGrid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 32px;"></div>
        
        <div class="product-gallery-section-title" style="font-size: 16px; font-weight: 700; color: var(--color-sand-light); margin-bottom: 16px; border-bottom: 1px solid var(--glass-border); padding-bottom: 8px;">صور الكتالوج المعالجة بالذكاء الاصطناعي (After AI Retouch)</div>
        <div class="product-gallery-grid" id="afterGrid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px;"></div>
      </div>
    `;

    const beforeGrid = document.getElementById("beforeGrid");
    const afterGrid = document.getElementById("afterGrid");

    if (data.before && data.before.length > 0) {
      data.before.forEach(img => {
        const card = document.createElement("div");
        card.className = "product-gallery-card glass-card";
        card.style.padding = "12px";
        card.style.marginBottom = "0";
        card.innerHTML = `
          <div class="product-gallery-img-container" style="aspect-ratio: 1; overflow: hidden; border-radius: var(--radius-md); border: 1px solid var(--glass-border);">
            <img src="${img.src}" alt="${img.label}" class="product-gallery-img lightbox-trigger" style="width: 100%; height: 100%; object-fit: cover; transition: var(--transition-smooth); cursor: pointer;" loading="lazy">
          </div>
          <div class="product-gallery-title" style="text-align: center; margin-top: 10px; font-size: 13px; font-weight: 600; color: var(--color-sand-light);">${img.label}</div>
        `;
        beforeGrid.appendChild(card);
      });
    } else {
      beforeGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--color-text-soft); padding: 20px;">لا توجد صور متوفرة في هذا القسم.</p>`;
    }

    if (data.after && data.after.length > 0) {
      data.after.forEach(img => {
        const card = document.createElement("div");
        card.className = "product-gallery-card glass-card";
        card.style.padding = "12px";
        card.style.marginBottom = "0";
        card.innerHTML = `
          <div class="product-gallery-img-container" style="aspect-ratio: 1; overflow: hidden; border-radius: var(--radius-md); border: 1px solid var(--glass-border);">
            <img src="${img.src}" alt="${img.label}" class="product-gallery-img lightbox-trigger" style="width: 100%; height: 100%; object-fit: cover; transition: var(--transition-smooth); cursor: pointer;" loading="lazy">
          </div>
          <div class="product-gallery-title" style="text-align: center; margin-top: 10px; font-size: 13px; font-weight: 600; color: var(--color-sand-light);">${img.label}</div>
        `;
        afterGrid.appendChild(card);
      });
    } else {
      afterGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--color-text-soft); padding: 20px;">لا توجد صور معالجة متوفرة في هذا القسم.</p>`;
    }

    // Re-bind lightbox events for newly created images
    bindLightboxTriggers();
  }

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      const member = tab.getAttribute("data-member");
      renderGallery(member);
    });
  });

  // Render first member by default
  const activeTab = document.querySelector(".product-tab-btn.active");
  if (activeTab) {
    renderGallery(activeTab.getAttribute("data-member"));
  }
}

// ═══════════════════════════════════════════════════════════════════
//  §14  PREMIUM FULLSCREEN IMAGE LIGHTBOX & SLIDESHOW
// ═══════════════════════════════════════════════════════════════════
let currentLightboxIndex = 0;
let lightboxImages = [];

function bindLightboxTriggers() {
  const triggers = document.querySelectorAll(".lightbox-trigger");
  triggers.forEach((trigger) => {
    trigger.removeEventListener("click", openLightboxHandler);
    trigger.addEventListener("click", openLightboxHandler);
  });
}

function openLightboxHandler(e) {
  const clickedImg = e.currentTarget;
  // Re-collect all active lightbox triggers on the active page to build the gallery array
  lightboxImages = Array.from(document.querySelectorAll(".lightbox-trigger")).filter(img => {
    // Only include images that are currently displayed/visible
    const rect = img.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  });

  currentLightboxIndex = lightboxImages.indexOf(clickedImg);
  if (currentLightboxIndex === -1) {
    lightboxImages = [clickedImg];
    currentLightboxIndex = 0;
  }

  updateLightbox();
  document.getElementById("lightboxOverlay").classList.add("active");
}

function updateLightbox() {
  const overlay = document.getElementById("lightboxOverlay");
  const imgEl = document.getElementById("lightboxImg");
  const captionEl = document.getElementById("lightboxCaption");

  if (lightboxImages.length === 0 || !lightboxImages[currentLightboxIndex]) return;

  const currentImg = lightboxImages[currentLightboxIndex];
  imgEl.src = currentImg.src;

  // Try to get a meaningful label/caption
  let captionText = currentImg.alt;
  if (!captionText) {
    const parentCard = currentImg.closest(".glass-card");
    if (parentCard) {
      const titleEl = parentCard.querySelector(".product-gallery-title, .asset-name, .chart-title");
      if (titleEl) captionText = titleEl.innerText;
    }
  }
  captionEl.innerText = captionText || "عرض الصورة المعالجة لمنتجات سولارا";

  const prevBtn = document.getElementById("lightboxPrev");
  const nextBtn = document.getElementById("lightboxNext");
  if (lightboxImages.length > 1) {
    prevBtn.style.display = "flex";
    nextBtn.style.display = "flex";
  } else {
    prevBtn.style.display = "none";
    nextBtn.style.display = "none";
  }
}

function initLightbox() {
  const overlay = document.getElementById("lightboxOverlay");
  const closeBtn = document.getElementById("lightboxClose");
  const prevBtn = document.getElementById("lightboxPrev");
  const nextBtn = document.getElementById("lightboxNext");

  if (!overlay || !closeBtn) return;

  closeBtn.addEventListener("click", () => {
    overlay.classList.remove("active");
  });

  // Close when clicking background outside image/controls
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.classList.remove("active");
    }
  });

  prevBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (lightboxImages.length <= 1) return;
    currentLightboxIndex = (currentLightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
    updateLightbox();
  });

  nextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (lightboxImages.length <= 1) return;
    currentLightboxIndex = (currentLightboxIndex + 1) % lightboxImages.length;
    updateLightbox();
  });

  // Keyboard controls
  document.addEventListener("keydown", (e) => {
    if (!overlay.classList.contains("active")) return;

    if (e.key === "Escape") {
      overlay.classList.remove("active");
    } else if (e.key === "ArrowLeft") {
      nextBtn.click();
    } else if (e.key === "ArrowRight") {
      prevBtn.click();
    }
  });

  // Bind initial triggers
  bindLightboxTriggers();
}
