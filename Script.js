(function initPricingSlider() {
  var mobileBreakpoint = 767;
  var sliderRow =
    document.getElementById("pricingSliderRow") ||
    document.querySelector(".slider-row") ||
    document.getElementById("sliderTrack");
  var prevButton =
    document.getElementById("pricingPrev") ||
    document.querySelector(".slider-prev") ||
    document.querySelector(".arrow-left");
  var nextButton =
    document.getElementById("pricingNext") ||
    document.querySelector(".slider-next") ||
    document.querySelector(".arrow-right");
  var dotsContainer =
    document.getElementById("pricingDots") ||
    document.querySelector(".slider-dots") ||
    document.querySelector(".slider-nav");

  if (!sliderRow || !prevButton || !nextButton || !dotsContainer) {
    return;
  }

  var cards = Array.prototype.slice.call(
    sliderRow.querySelectorAll(
      ".pricing-card, .package-social, .package-standard, .package-premium",
    ),
  );
  cards = cards.filter(function (card, index) {
    return cards.indexOf(card) === index;
  });
  if (!cards.length) {
    return;
  }

  var dots = [];
  var currentIndex = 0;
  var touchStartX = 0;
  var touchCurrentX = 0;
  var swipeThreshold = 50;
  var transformMode = false;

  function isMobile() {
    return window.innerWidth <= mobileBreakpoint;
  }

  function getCardStyleGap() {
    var computed = window.getComputedStyle(sliderRow);
    var gap = parseFloat(computed.columnGap || computed.gap || "0");
    return Number.isNaN(gap) ? 0 : gap;
  }

  function getStep() {
    if (!cards[0]) {
      return 0;
    }
    return cards[0].offsetWidth + getCardStyleGap();
  }

  function debugIndex(reason) {
    console.log("[pricing-slider]", reason, "index:", currentIndex);
  }

  function updateDots() {
    dots.forEach(function (dot, index) {
      dot.classList.toggle("is-active", index === currentIndex);
      dot.classList.toggle("active", index === currentIndex);
      dot.setAttribute("aria-selected", index === currentIndex ? "true" : "false");
    });
  }

  function updateButtons() {
    var atStart = currentIndex === 0;
    var atEnd = currentIndex >= cards.length - 1;
    prevButton.disabled = atStart;
    nextButton.disabled = atEnd;
    prevButton.style.opacity = atStart ? "0.45" : "1";
    nextButton.style.opacity = atEnd ? "0.45" : "1";
  }

  function setMobileScrollState() {
    sliderRow.style.transform = "none";
    sliderRow.style.transition = "";
    transformMode = false;
  }

  function setDesktopState() {
    currentIndex = 0;
    sliderRow.scrollLeft = 0;
    sliderRow.style.transform = "";
    sliderRow.style.transition = "";
    transformMode = false;
    updateDots();
    prevButton.style.opacity = "1";
    nextButton.style.opacity = "1";
    prevButton.disabled = false;
    nextButton.disabled = false;
    debugIndex("desktop mode");
  }

  function syncFromScroll() {
    if (!isMobile()) {
      return;
    }
    if (transformMode) {
      return;
    }
    var step = getStep();
    if (!step) {
      return;
    }
    var index = Math.round(sliderRow.scrollLeft / step);
    currentIndex = Math.max(0, Math.min(cards.length - 1, index));
    updateDots();
    updateButtons();
    debugIndex("scroll");
  }

  function scrollToCard(index) {
    if (!isMobile()) {
      return;
    }
    currentIndex = Math.max(0, Math.min(cards.length - 1, index));
    var firstOffset = cards[0].offsetLeft;
    var targetLeft = cards[currentIndex].offsetLeft - firstOffset;
    var canScroll = sliderRow.scrollWidth > sliderRow.clientWidth + 1;

    if (canScroll) {
      transformMode = false;
      sliderRow.style.transform = "";
      sliderRow.style.transition = "";
      sliderRow.scrollTo({
        left: targetLeft,
        behavior: "smooth",
      });
    } else {
      transformMode = true;
      sliderRow.style.transition = "transform 0.35s ease";
      sliderRow.style.transform = "translateX(" + -targetLeft + "px)";
    }

    updateDots();
    updateButtons();
    console.log(
      "[pricing-slider] goto",
      "index:",
      currentIndex,
      "targetLeft:",
      targetLeft,
      "canScroll:",
      canScroll,
      "transformMode:",
      transformMode,
    );
  }

  function setupDots() {
    var existingDots = Array.prototype.slice.call(
      dotsContainer.querySelectorAll(".dot, .slider-dot"),
    );
    if (existingDots.length >= cards.length) {
      dots = existingDots.slice(0, cards.length);
    } else {
      dotsContainer.innerHTML = "";
      dots = cards.map(function (_, index) {
        var dot = document.createElement("button");
        dot.type = "button";
        dot.className = "dot slider-dot";
        dot.setAttribute("aria-label", "Перейти к карточке " + (index + 1));
        dotsContainer.appendChild(dot);
        return dot;
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        scrollToCard(index);
      });
    });
    updateDots();
  }

  function handleTouchStart(event) {
    if (!isMobile()) {
      return;
    }
    setMobileScrollState();
    touchStartX = event.touches[0].clientX;
    touchCurrentX = touchStartX;
  }

  function handleTouchMove(event) {
    if (!isMobile()) {
      return;
    }
    touchCurrentX = event.touches[0].clientX;
  }

  function handleTouchEnd() {
    if (!isMobile()) {
      return;
    }
    var deltaX = touchStartX - touchCurrentX;
    if (Math.abs(deltaX) < swipeThreshold) {
      return;
    }
    if (deltaX > 0) {
      scrollToCard(currentIndex + 1);
    } else {
      scrollToCard(currentIndex - 1);
    }
  }

  function onResize() {
    if (!isMobile()) {
      setDesktopState();
      return;
    }
    setMobileScrollState();
    updateDots();
    updateButtons();
    debugIndex("resize mobile");
  }

  prevButton.addEventListener("click", function () {
    scrollToCard(currentIndex - 1);
  });
  nextButton.addEventListener("click", function () {
    scrollToCard(currentIndex + 1);
  });
  sliderRow.addEventListener("scroll", syncFromScroll, { passive: true });
  sliderRow.addEventListener("touchstart", handleTouchStart, { passive: true });
  sliderRow.addEventListener("touchmove", handleTouchMove, { passive: true });
  sliderRow.addEventListener("touchend", handleTouchEnd, { passive: true });
  window.addEventListener("resize", onResize);

  setupDots();
  onResize();
  if (isMobile()) {
    setMobileScrollState();
  }
})();

(function initSiteInteractivity() {
  var phoneHref = "tel:+73422979745";
  var phoneSelector =
    ".card-cta, .pack-cta, .pack-cta2, .pack-cta-gold, .card-cta2, .card-cta3, .card-cta-svo, .header-phone, .cta-primary";
  var packIconSelector =
    ".header-top-row img.vector-icon, .header-top-row img.pack-icon-item-soc, .pack-top img.pack-icon-item-soc";

  function bindPhoneAction(el) {
    if (!el || el.dataset.phoneBound === "1") {
      return;
    }
    if (
      el.tagName === "A" &&
      el.getAttribute("href") &&
      el.getAttribute("href").indexOf("tel:") === 0
    ) {
      return;
    }
    el.dataset.phoneBound = "1";
    el.style.cursor = "pointer";
    el.addEventListener("click", function () {
      window.location.href = phoneHref;
    });
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
    