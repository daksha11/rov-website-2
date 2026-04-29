import type { BrandKitData } from "@/lib/brand-kit/types";

export function generateJS(data: BrandKitData): string {
  const enabledSections = data.sections
    .filter((s) => s.enabled)
    .sort((a, b) => a.order - b.order);

  const sectionIds = enabledSections.map((s) => `'${s.id}'`).join(", ");
  const isWarm = data.template === "warm-earth";
  const navSelector = isWarm ? ".pill-nav" : ".side-nav";
  const navShowClass = isWarm ? "show" : "visible";

  const tokenLines = data.colors.swatches
    .map((s) => `  ${s.cssVariable}: ${s.hex};`)
    .join("\n");
  const gradientLines = data.gradients
    .map((g, i) => `  --gradient-${String(i + 1).padStart(2, "0")}: ${g.css};`)
    .join("\n");
  const allTokens = `:root {
  /* ${data.brandInfo.name || "Brand"} — Brand Tokens */
${tokenLines}

${gradientLines}

  --font-display: '${data.typography.displayFont.name}', ${data.typography.displayFont.fallback};
  --font-body: '${data.typography.bodyFont.name}', ${data.typography.bodyFont.fallback};
}`;

  return `
(function () {
  'use strict';

  // ── Toast ──
  var toast = document.getElementById('toast');
  var toastTimer;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function() { toast.classList.remove('show'); }, 2000);
  }
  function copyFallback(text, label) {
    try {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.top = '0';
      ta.style.left = '0';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      document.body.removeChild(ta);
      showToast(ok ? (label || 'Copied') + ' ✓' : 'Copy blocked — press ⌘/Ctrl+C');
    } catch (e) {
      showToast('Copy blocked by browser');
    }
  }
  function copyText(text, label) {
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      copyFallback(text, label);
      return;
    }
    navigator.clipboard.writeText(text).then(function() {
      showToast((label || 'Copied') + ' ✓');
    }, function() {
      copyFallback(text, label);
    });
  }

  // ── Download helpers ──
  function downloadDataUrl(dataUrl, filename) {
    var a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  // ── Color conversions ──
  function hexToRgb(hex) {
    var h = hex.replace('#', '');
    return {
      r: parseInt(h.substring(0, 2), 16),
      g: parseInt(h.substring(2, 4), 16),
      b: parseInt(h.substring(4, 6), 16)
    };
  }
  function rgbString(hex) {
    var c = hexToRgb(hex);
    return 'rgb(' + c.r + ', ' + c.g + ', ' + c.b + ')';
  }
  function hslString(hex) {
    var c = hexToRgb(hex);
    var rn = c.r / 255, gn = c.g / 255, bn = c.b / 255;
    var max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
    var h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case rn: h = (gn - bn) / d + (gn < bn ? 6 : 0); break;
        case gn: h = (bn - rn) / d + 2; break;
        default: h = (rn - gn) / d + 4;
      }
      h /= 6;
    }
    return 'hsl(' + Math.round(h * 360) + ', ' + Math.round(s * 100) + '%, ' + Math.round(l * 100) + '%)';
  }

  // ── Color swatches: unit toggle + click to copy + CSS variable copy ──
  document.querySelectorAll('.color-swatch').forEach(function(swatch) {
    var hex = swatch.dataset.hex;
    var cssVar = swatch.dataset.var;
    var name = swatch.dataset.name;
    var display = swatch.querySelector('.swatch-hex');
    var unitBtns = swatch.querySelectorAll('.swatch-unit button');
    var copyCssBtn = swatch.querySelector('.swatch-copy-css');
    var currentUnit = 'hex';

    function render(unit) {
      currentUnit = unit;
      if (unit === 'rgb') display.textContent = rgbString(hex);
      else if (unit === 'hsl') display.textContent = hslString(hex);
      else display.textContent = hex;
    }

    unitBtns.forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        unitBtns.forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        render(btn.dataset.unit);
      });
    });
    if (display) {
      display.style.cursor = 'pointer';
      display.addEventListener('click', function(e) {
        e.stopPropagation();
        copyText(display.textContent, display.textContent + ' copied');
      });
    }
    if (copyCssBtn) {
      copyCssBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        var value = currentUnit === 'rgb' ? rgbString(hex) : currentUnit === 'hsl' ? hslString(hex) : hex;
        var cssDecl = cssVar + ': ' + value + ';';
        copyText(cssDecl, name + ' CSS var copied');
      });
    }
  });

  // ── Gradient cards: click + button to copy CSS ──
  document.querySelectorAll('.gradient-card').forEach(function(card) {
    card.addEventListener('click', function(e) {
      if (e.target.closest('.gradient-copy-btn')) return;
      var css = 'background: ' + card.dataset.css + ';';
      copyText(css, 'Gradient CSS copied');
    });
  });
  document.querySelectorAll('.gradient-copy-btn').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      var css = 'background: ' + btn.dataset.css + ';';
      copyText(css, 'Gradient CSS copied');
    });
  });
  document.querySelectorAll('.gradient-css').forEach(function(label) {
    label.style.cursor = 'pointer';
    label.addEventListener('click', function() {
      copyText(label.dataset.css, 'Gradient value copied');
    });
  });

  // ── Typography: editable samples with reset ──
  document.querySelectorAll('.type-cell').forEach(function(cell) {
    var text = cell.querySelector('[contenteditable]');
    var resetBtn = cell.querySelector('.type-reset-btn');
    if (!text) return;

    if (resetBtn) {
      resetBtn.addEventListener('click', function() {
        text.textContent = text.dataset.default || '';
        showToast('Text reset ✓');
      });
    }

    text.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        text.blur();
      }
    });
  });

  // ── Font download ──
  document.querySelectorAll('.font-download-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var customFont = btn.dataset.customFont;
      var googleFont = btn.dataset.googleFont;

      if (customFont && customFont.length > 10) {
        downloadDataUrl(customFont, btn.dataset.filename || 'font.woff2');
        showToast('Font downloaded ✓');
      } else if (googleFont) {
        var url = 'https://fonts.google.com/specimen/' + encodeURIComponent(googleFont.replace(/\\s+/g, '+'));
        window.open(url, '_blank', 'noopener');
        showToast('Opened Google Fonts ✓');
      }
    });
  });

  // ── Logo download ──
  document.querySelectorAll('.logo-download-btn').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      var file = btn.dataset.file;
      var filename = btn.dataset.filename || 'logo';
      if (file) {
        downloadDataUrl(file, filename);
        showToast('Logo downloaded ✓');
      }
    });
  });

  // ── Scroll-based navigation ──
  var sections = [${sectionIds}].map(function(id) {
    return document.getElementById(id);
  }).filter(Boolean);
  var nav = document.querySelector('${navSelector}');
  var floatActions = document.querySelector('.float-actions');
  var navLinks = nav ? nav.querySelectorAll('a') : [];

  function onScroll() {
    var scrollY = window.scrollY || window.pageYOffset;
    var showNav = scrollY > window.innerHeight * 0.6;
    if (nav) nav.classList.toggle('${navShowClass}', showNav);
    if (floatActions) floatActions.classList.toggle('show', showNav);

    var activeIdx = 0;
    var triggerY = window.innerHeight * 0.5;
    sections.forEach(function(sec, i) {
      if (!sec) return;
      var top = sec.getBoundingClientRect().top;
      if (top <= triggerY) activeIdx = i;
    });
    var docBottom = document.documentElement.scrollHeight;
    if (scrollY + window.innerHeight >= docBottom - 120) {
      activeIdx = sections.length - 1;
    }
    navLinks.forEach(function(link, i) {
      link.classList.toggle('active', i === activeIdx);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  // ── Logo background toggle ──
  document.querySelectorAll('.logo-bg-switcher').forEach(function(toggle) {
    var cell = toggle.closest('.logo-cell');
    toggle.querySelectorAll('button').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        cell.style.background = btn.dataset.color;
        var hex = btn.dataset.color.replace('#', '');
        var r = parseInt(hex.substring(0,2),16);
        var g = parseInt(hex.substring(2,4),16);
        var b = parseInt(hex.substring(4,6),16);
        var lum = (0.299*r + 0.587*g + 0.114*b) / 255;
        cell.style.color = lum > 0.5 ? '#1a1a1a' : '#f5f5f5';
      });
    });
  });

  // ── Reveal on scroll ──
  var reveals = document.querySelectorAll('.reveal');
  var revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });
  reveals.forEach(function(el) { revealObserver.observe(el); });

  // ── Print / PDF ──
  var printBtn = document.getElementById('printBtn');
  if (printBtn) printBtn.addEventListener('click', function() { window.print(); });

  // ── Copy all tokens ──
  var copyTokensBtn = document.getElementById('copyTokensBtn');
  if (copyTokensBtn) {
    copyTokensBtn.addEventListener('click', function() {
      copyText(${JSON.stringify(allTokens)}, 'All brand tokens copied');
    });
  }

  // ── Keyboard shortcuts ──
  document.addEventListener('keydown', function(e) {
    if (e.target.isContentEditable || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    var idx = parseInt(e.key, 10) - 1;
    if (idx >= 0 && idx < sections.length && sections[idx]) {
      sections[idx].scrollIntoView({ behavior: 'smooth' });
    }
  });

  // ── TOC smooth scroll ──
  document.querySelectorAll('.cover-toc a').forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      var target = document.querySelector(link.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });
})();
`;
}
