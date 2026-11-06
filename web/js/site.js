(function () {
  var key = "viva-locale";

  function current() {
    try {
      return localStorage.getItem(key) === "en" ? "en" : "hu";
    } catch (error) {
      return "hu";
    }
  }

  function apply(lang) {
    var root = document.documentElement;
    root.lang = lang;
    root.classList.toggle("lang-en", lang === "en");
    document.querySelectorAll("[data-lang]").forEach(function (button) {
      button.setAttribute("aria-pressed", button.getAttribute("data-lang") === lang ? "true" : "false");
    });
    document.querySelectorAll("[data-label-hu]").forEach(function (node) {
      node.setAttribute("aria-label", lang === "en" ? node.getAttribute("data-label-en") : node.getAttribute("data-label-hu"));
    });
    document.querySelectorAll("[data-alt-hu]").forEach(function (image) {
      image.alt = lang === "en" ? image.getAttribute("data-alt-en") : image.getAttribute("data-alt-hu");
    });
    var title = document.body.getAttribute(lang === "en" ? "data-title-en" : "data-title-hu");
    if (title) document.title = title;
    document.querySelectorAll(".year").forEach(function (node) {
      node.textContent = String(new Date().getFullYear());
    });
  }

  document.addEventListener("click", function (event) {
    var langButton = event.target.closest("[data-lang]");
    if (langButton) {
      var next = langButton.getAttribute("data-lang");
      try {
        localStorage.setItem(key, next);
      } catch (error) {}
      apply(next);
      return;
    }

    if (event.target.closest("[data-menu]")) {
      var open = document.documentElement.classList.toggle("menu-open");
      document.querySelectorAll("[data-menu]").forEach(function (button) {
        button.setAttribute("aria-expanded", open ? "true" : "false");
      });
      return;
    }

    if (event.target.closest("[data-close]")) {
      document.documentElement.classList.remove("menu-open");
      document.querySelectorAll("[data-menu]").forEach(function (button) {
        button.setAttribute("aria-expanded", "false");
      });
    }
  });

  var header = document.querySelector(".header");
  if (header && header.classList.contains("header-home")) {
    var onScroll = function () {
      header.classList.toggle("header-home", window.scrollY <= 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  var form = document.querySelector("[data-contact-form]");
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var email = (form.getAttribute("data-email") || "").trim();
      var error = form.querySelector(".form-error");
      if (!email) {
        if (error) error.hidden = false;
        return;
      }
      var data = new FormData(form);
      var body = [
        "Név: " + data.get("name"),
        "E-mail: " + data.get("email"),
        "Telefon: " + data.get("phone"),
        "",
        data.get("message"),
      ].join("\n");
      window.location.href =
        "mailto:" + email + "?subject=" + encodeURIComponent("VIVA Padel") + "&body=" + encodeURIComponent(body);
    });
  }

  apply(current());
})();
