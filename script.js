(function () {
  const site = window.SITE || {};
  const contact = site.contact || {};
  const photos = site.gallery || [];
  const $ = (id) => document.getElementById(id);

  // ── Language (taken from <html lang>) ──────────────────────
  const lang = document.documentElement.lang === "en" ? "en" : "mk";
  const STRINGS = {
    mk: {
      openMenu: "Отвори мени", closeMenu: "Затвори мени",
      soon: "Фотографиите доаѓаат наскоро", photoAlt: "Фотографија од настан",
      email: "Е-пошта", phone: "Телефон", whatsapp: "Пишете ни", area: "Регион",
      nameMissing: "Ве молиме внесете го вашето име за да знаеме кому да одговориме.",
      sent: "Вашата апликација за е-пошта треба да се отвори. Само притиснете „Испрати“ и ќе ви се јавиме.",
      fName: "Име", fEvent: "Настан", fDate: "Датум", fVenue: "Локација / град",
      noDate: "сè уште не е одреден", subject: "Барање за резервација"
    },
    en: {
      openMenu: "Open menu", closeMenu: "Close menu",
      soon: "Photos coming soon", photoAlt: "Event photo",
      email: "Email", phone: "Phone", whatsapp: "Message us", area: "Area",
      nameMissing: "Please add your name so we know who to reply to.",
      sent: "Your email app should open now. Just press send and we'll be in touch.",
      fName: "Name", fEvent: "Event", fDate: "Date", fVenue: "Venue / city",
      noDate: "not decided yet", subject: "Booking enquiry"
    }
  };
  const t = STRINGS[lang];
  // Config texts may be a plain string or { mk: "...", en: "..." }
  const pick = (v) => (v && typeof v === "object" ? v[lang] || v.mk || v.en || "" : v || "");

  $("year").textContent = new Date().getFullYear();

  // ── Nav ────────────────────────────────────────────────────
  const nav = $("nav"), toggle = $("navToggle"), links = $("navLinks");
  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const setMenu = (open) => {
    links.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? t.closeMenu : t.openMenu);
  };
  toggle.addEventListener("click", () => setMenu(!links.classList.contains("is-open")));
  links.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });

  // ── Gallery ────────────────────────────────────────────────
  const grid = $("galleryGrid");
  const PLACEHOLDERS = 8;
  const phoneIcon =
    '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M5 12c0-3 5-5 11-5s11 2 11 5v2h-6v-3H11v3H5z"/><path d="M11 14l-3 11h16l-3-11"/><circle cx="16" cy="20" r="3"/></svg>';

  if (photos.length) {
    photos.forEach((photo, i) => {
      const tile = document.createElement("button");
      tile.type = "button";
      tile.className = "tile reveal" + (photo.tall ? " tile--tall" : "") + (photo.wide ? " tile--wide" : "");
      const img = document.createElement("img");
      img.src = "assets/gallery/" + photo.src;
      img.alt = pick(photo.caption) || t.photoAlt;
      img.loading = "lazy";
      tile.appendChild(img);
      if (pick(photo.caption)) {
        const cap = document.createElement("span");
        cap.className = "tile__cap";
        cap.textContent = pick(photo.caption);
        tile.appendChild(cap);
      }
      tile.addEventListener("click", () => openLightbox(i));
      grid.appendChild(tile);
    });
  } else {
    // Shown until real photos are listed in config.js
    for (let i = 0; i < PLACEHOLDERS; i++) {
      const tile = document.createElement("div");
      tile.className = "tile tile--empty reveal" + (i === 0 ? " tile--tall" : "") + (i === 3 ? " tile--wide" : "");
      tile.innerHTML = phoneIcon + "<span>" + t.soon + "</span>";
      grid.appendChild(tile);
    }
  }

  // ── Lightbox ───────────────────────────────────────────────
  const lb = $("lightbox"), lbImg = $("lbImg"), lbCap = $("lbCap");
  let current = 0, lastFocus = null;

  function show(i) {
    current = (i + photos.length) % photos.length;
    const photo = photos[current];
    lbImg.src = "assets/gallery/" + photo.src;
    lbImg.alt = pick(photo.caption) || t.photoAlt;
    lbCap.textContent = pick(photo.caption);
  }
  function openLightbox(i) {
    lastFocus = document.activeElement;
    show(i);
    lb.hidden = false;
    document.body.style.overflow = "hidden";
    $("lbClose").focus();
  }
  function closeLightbox() {
    lb.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }
  $("lbClose").addEventListener("click", closeLightbox);
  $("lbPrev").addEventListener("click", () => show(current - 1));
  $("lbNext").addEventListener("click", () => show(current + 1));
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLightbox(); });
  document.addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });

  // ── Contact details ────────────────────────────────────────
  const list = $("contactList");
  const addRow = (label, text, href) => {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.textContent = label;
    li.appendChild(span);
    const el = document.createElement(href ? "a" : "div");
    el.textContent = text;
    if (href) {
      el.href = href;
      if (href.startsWith("http")) { el.target = "_blank"; el.rel = "noopener"; }
    }
    li.appendChild(el);
    list.appendChild(li);
  };
  if (contact.email) addRow(t.email, contact.email, "mailto:" + contact.email);
  if (contact.phone) addRow(t.phone, contact.phone, "tel:" + contact.phone.replace(/[^\d+]/g, ""));
  if (contact.whatsapp) addRow("WhatsApp", t.whatsapp, "https://wa.me/" + contact.whatsapp.replace(/\D/g, ""));
  if (contact.instagram) addRow("Instagram", "@" + contact.instagram, "https://instagram.com/" + contact.instagram);
  if (pick(contact.area)) addRow(t.area, pick(contact.area));

  // ── Booking form → opens the visitor's email app ───────────
  const form = $("bookingForm"), note = $("formNote");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = (data.get("name") || "").trim();
    if (!name) {
      note.textContent = t.nameMissing;
      note.classList.add("is-error");
      form.elements.name.focus();
      return;
    }
    note.classList.remove("is-error");
    const body = [
      t.fName + ": " + name,
      t.fEvent + ": " + data.get("event"),
      t.fDate + ": " + (data.get("date") || t.noDate),
      t.fVenue + ": " + (data.get("venue") || "-"),
      "",
      data.get("message") || ""
    ].join("\n");
    const subject = t.subject + ": " + data.get("event") + (data.get("date") ? ", " + data.get("date") : "");
    window.location.href =
      "mailto:" + (contact.email || "") +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);
    note.textContent = t.sent;
  });

  // ── Scroll reveal ──────────────────────────────────────────
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }
})();
