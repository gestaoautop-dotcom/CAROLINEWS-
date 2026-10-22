/* ============ EFEITO DE DIGITAÇÃO ============ */
(function () {
  const el = document.getElementById("typed-text");
  if (!el) return;

  const words = ["A Developer.", "A Designer."];
  const typeSpeed = 110;     // ms por letra digitada
  const deleteSpeed = 60;    // ms por letra apagada
  const pauseAfterWord = 1600;
  const pauseBeforeNext = 400;

  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    const current = words[wordIndex];

    if (!deleting) {
      charIndex++;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        return setTimeout(tick, pauseAfterWord);
      }
      return setTimeout(tick, typeSpeed);
    }

    charIndex--;
    el.textContent = current.slice(0, charIndex);
    if (charIndex === 0) {
      deleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      return setTimeout(tick, pauseBeforeNext);
    }
    setTimeout(tick, deleteSpeed);
  }

  tick();
})();

/* ============ NAVBAR: muda ao rolar ============ */
(function () {
  const nav = document.querySelector(".custom-nav");
  if (!nav) return;

  function onScroll() {
    nav.classList.toggle("nav-scrolled", window.scrollY > 60);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
})();

/* ============ NAVBAR: item ativo conforme a seção ============ */
(function () {
  const links = document.querySelectorAll(".navbar-nav .nav-link");
  const items = document.querySelectorAll(".navbar-nav .nav-item");

  links.forEach(function (link, i) {
    link.addEventListener("click", function () {
      items.forEach(function (li) { li.classList.remove("active"); });
      items[i].classList.add("active");

      // fecha o menu no mobile
      const menu = document.getElementById("navbarCollapse");
      if (menu && menu.classList.contains("show")) {
        bootstrap.Collapse.getOrCreateInstance(menu).hide();
      }
    });
  });
})();
