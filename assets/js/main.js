/* Chapa y Pintura Miguel Mascarell — demo */
(() => {
  const WA = "34697220267";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const waUrl = (m) => `https://wa.me/${WA}?text=${encodeURIComponent(m)}`;

  $$(".js-wa").forEach(a => { a.href = waUrl(a.dataset.msg); a.target = "_blank"; a.rel = "noopener"; });

  /* ---------- Antes / después ---------- */
  const ad = $(".js-ad");
  const rango = $(".js-ad-rango");
  const pon = (v) => ad.style.setProperty("--pos", `${v}%`);
  rango.addEventListener("input", () => { pon(rango.value); ad.classList.add("is-tocado"); });
  // Pequeña demostración al entrar en pantalla: 50 → 22 → 78 → 50
  let demo = false;
  const io0 = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting || demo || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    demo = true; io0.disconnect();
    const puntos = [50, 22, 78, 50];
    let t0 = null;
    const dur = 2600;
    const paso = (t) => {
      if (ad.classList.contains("is-tocado")) return;
      t0 ??= t;
      const k = Math.min(1, (t - t0) / dur) * (puntos.length - 1);
      const i = Math.min(puntos.length - 2, Math.floor(k));
      const f = k - i, e2 = f < .5 ? 2 * f * f : 1 - (-2 * f + 2) ** 2 / 2;
      const v = puntos[i] + (puntos[i + 1] - puntos[i]) * e2;
      pon(v); rango.value = v;
      if (k < puntos.length - 1) requestAnimationFrame(paso);
    };
    setTimeout(() => requestAnimationFrame(paso), 700);
  }, { threshold: .5 });
  io0.observe(ad);

  /* ---------- Presupuesto ---------- */
  const form = $(".js-presu");
  const prev = $(".js-presu-prev");
  const zonasTxt = $(".js-zonas-txt");
  const zonas = new Set();

  $$(".js-zonas button").forEach(b => b.addEventListener("click", () => {
    const z = b.dataset.z;
    zonas.has(z) ? zonas.delete(z) : zonas.add(z);
    b.classList.toggle("is-on", zonas.has(z));
    b.setAttribute("aria-pressed", zonas.has(z));
    pinta();
  }));

  const lista = (arr) => arr.length < 2 ? arr.join("") : `${arr.slice(0, -1).join(", ")} y ${arr.at(-1)}`;

  function mensaje() {
    const d = new FormData(form);
    const veh = d.get("veh");
    const danos = d.getAll("dano");
    const modelo = (d.get("modelo") || "").trim();
    const z = [...zonas];
    let m = `Hola Miguel 👋 Quería presupuesto para mi ${veh}${modelo ? ` (${modelo})` : ""}.`;
    if (z.length) m += ` Zona: ${lista(z)}.`;
    if (danos.length) m += ` Tiene ${lista(danos)}.`;
    m += " Te mando fotos ahora.";
    return m;
  }
  const mapaCoche = $(".js-zonas");
  function pinta() {
    const esMoto = new FormData(form).get("veh") === "moto";
    mapaCoche.hidden = esMoto;
    if (esMoto && zonas.size) {
      zonas.clear();
      $$("button", mapaCoche).forEach(b => { b.classList.remove("is-on"); b.setAttribute("aria-pressed", "false"); });
    }
    zonasTxt.hidden = esMoto;
    prev.textContent = mensaje();
    zonasTxt.textContent = zonas.size ? `Marcado: ${lista([...zonas])}.` : "Toca una o varias zonas del coche.";
  }
  form.addEventListener("input", pinta);
  form.addEventListener("submit", (e) => { e.preventDefault(); window.open(waUrl(mensaje()), "_blank", "noopener"); });
  pinta();

  /* ---------- Mapa bajo demanda ---------- */
  $(".js-mapa-btn").addEventListener("click", () => {
    const f = document.createElement("iframe");
    f.src = "https://www.google.com/maps?q=" + encodeURIComponent("Chapa y Pintura Miguel Mascarell, Calle Hércules 50, 03006 Alicante") + "&z=16&output=embed";
    f.title = "Mapa: Calle Hércules, 50, Alicante";
    f.loading = "lazy";
    $(".js-mapa").replaceChildren(f);
  });

  /* ---------- Selector de tono (demo) ---------- */
  function ponTono(t) {
    document.documentElement.dataset.tema = t;
    $$(".tonos button").forEach(b => b.classList.toggle("is-on", b.dataset.t === t));
    try { localStorage.setItem("mascarell-tono", t); } catch (_) {}
  }
  $$(".tonos button").forEach(b => b.addEventListener("click", () => ponTono(b.dataset.t)));
  try { const t = localStorage.getItem("mascarell-tono"); if (t) ponTono(t); } catch (_) {}

  /* ---------- Revelado ---------- */
  const rv = $$(".titulo, .serv__item, .op, .presu__form, .cifras__in > div");
  rv.forEach(el => el.classList.add("rv"));
  const io = new IntersectionObserver((es) => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
  }), { rootMargin: "0px 0px -8% 0px" });
  rv.forEach(el => io.observe(el));

  $(".js-anio").textContent = new Date().getFullYear();
})();
