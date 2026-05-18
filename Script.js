(function initPricingSlider() {
  var mobileBreakpoint = 767;
  var sliderRow = document.getElementById("pricingSliderRow");
  var prevButton = document.getElementById("pricingPrev");
  var nextButton = document.getElementById("pricingNext");
  var dotsContainer = document.getElementById("pricingDots");

  if (!sliderRow || !prevButton || !nextButton || !dotsContainer) {
    return;
  }

  var cards = Array.prototype.slice.call(
    sliderRow.querySelectorAll(".package-card"),
  );
  if (!cards.length) {
    return;
  }

  var dots = [];
  var currentIndex = 0;
  var cachedStep = 0;
  var scrollTicking = false;

  function isMobile() {
    return window.innerWidth <= mobileBreakpoint;
  }

  function cacheStep() {
    cachedStep = cards[0].offsetWidth + 16;
  }

  function updateUI() {
    dots.forEach(function (dot, idx) {
      dot.classList.toggle("is-active", idx === currentIndex);
    });
    prevButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex >= cards.length - 1;
    prevButton.style.opacity = currentIndex === 0 ? "0.45" : "1";
    nextButton.style.opacity = currentIndex >= cards.length - 1 ? "0.45" : "1";
  }

  function onScroll() {
    if (!isMobile() || scrollTicking) { return; }
    scrollTicking = true;
    requestAnimationFrame(function () {
      scrollTicking = false;
      if (!cachedStep) { return; }
      var idx = Math.round(sliderRow.scrollLeft / cachedStep);
      idx = Math.max(0, Math.min(cards.length - 1, idx));
      if (idx !== currentIndex) {
        currentIndex = idx;
        updateUI();
      }
    });
  }

  function goTo(idx) {
    if (!isMobile()) { return; }
    idx = Math.max(0, Math.min(cards.length - 1, idx));
    currentIndex = idx;
    sliderRow.scrollTo({ left: idx * cachedStep, behavior: "smooth" });
    updateUI();
  }

  function setupDots() {
    dotsContainer.innerHTML = "";
    dots = cards.map(function (_, idx) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.className = "dot slider-dot";
      dot.addEventListener("click", function () { goTo(idx); });
      dotsContainer.appendChild(dot);
      return dot;
    });
  }

  function onResize() {
    cacheStep();
    updateUI();
  }

  prevButton.addEventListener("click", function () { goTo(currentIndex - 1); });
  nextButton.addEventListener("click", function () { goTo(currentIndex + 1); });
  sliderRow.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize);

  setupDots();
  cacheStep();
  updateUI();
})();

(function initSiteInteractivity() {
  var phoneHref = "tel:+73422979745";
  var phoneSelector =
    ".card-cta, .pack-cta, .pack-cta2, .pack-cta-gold, .card-cta2, .card-cta3, .card-cta-svo, .header-phone, .cta-primary";
  var packIconSelector =
    ".header-top-row img.vector-icon, .header-top-row img.pack-icon-item-soc, .pack-top img.pack-icon-item-soc";

  function bindPhoneAction(el) {
    if (!el || el.dataset.phoneBound === "1") { return; }
    if (el.tagName === "A" && el.getAttribute("href") && el.getAttribute("href").indexOf("tel:") === 0) { return; }
    el.dataset.phoneBound = "1";
    el.style.cursor = "pointer";
    el.addEventListener("click", function () { window.location.href = phoneHref; });
  }

  function applyPackIconSize(img) {
    img.style.setProperty("width", "20px", "important");
    img.style.setProperty("height", "20px", "important");
    img.style.setProperty("min-width", "20px", "important");
    img.style.setProperty("min-height", "20px", "important");
    img.style.setProperty("max-width", "20px", "important");
    img.style.setProperty("max-height", "20px", "important");
    img.style.setProperty("object-fit", "contain", "important");
    img.style.flexShrink = "0";
  }

  function run() {
    document.querySelectorAll(phoneSelector).forEach(bindPhoneAction);
    document.querySelectorAll(packIconSelector).forEach(applyPackIconSize);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
