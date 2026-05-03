const { siteData } = window;

const pageName = document.body.dataset.page || "home";
const projectGrid = document.getElementById("project-grid");
const projectFilters = document.getElementById("project-filters");
const tickerTrack = document.getElementById("ticker-track");
const archiveIndexList = document.getElementById("archive-index-list");
const serviceGrid = document.getElementById("service-grid");
const processGrid = document.getElementById("process-grid");
const faqList = document.getElementById("faq-list");
const dialog = document.getElementById("project-dialog");
const dialogImage = document.getElementById("dialog-image");
const dialogCategory = document.getElementById("dialog-category");
const dialogTitle = document.getElementById("dialog-title");
const dialogSubtitle = document.getElementById("dialog-subtitle");
const dialogSummary = document.getElementById("dialog-summary");
const dialogTags = document.getElementById("dialog-tags");
const menuToggle = document.querySelector("[data-menu-toggle]");
const siteNav = document.querySelector("[data-nav]");
const enquiryForms = [...document.querySelectorAll("[data-enquiry-form]")];
const bookingSheetToggles = [...document.querySelectorAll("[data-booking-sheet-toggle]")];
const bookingSheet = document.querySelector("[data-booking-sheet]");

let activeFilter = "All";
const hasEnquiryEmail = Boolean(siteData.enquiryEmail && siteData.enquiryEmail.trim());

const enquiryDefinitions = {
  contact: {
    subject: "Green Design Sydney - Free Estimate Request",
    success: "Your estimate request summary is ready.",
    buildBody: (data) => [
      "Hello Green Design Sydney,",
      "",
      "Please find my free estimate request below.",
      "",
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Phone: ${data.phone || "Not provided"}`,
      "",
      "Project details:",
      data.details
    ]
  },
  booking: {
    subject: "Green Design Sydney - Book First Hour",
    success: "Your booking request summary is ready and the on-site booking options are open.",
    openBookingSheet: true,
    buildBody: (data) => [
      "Hello Green Design Sydney,",
      "",
      "I would like to book the one-hour free building design consultation.",
      "",
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Phone: ${data.phone || "Not provided"}`,
      `Consultation focus: ${data.consultation}`,
      `Preferred week: ${data.preferredWeek || "Flexible"}`,
      `Project location: ${data.location || "Not provided"}`,
      "",
      "Project brief:",
      data.brief
    ]
  },
  consideration: {
    subject: "Green Design Sydney - Luxury Home Consideration",
    success:
      "Your luxury consideration summary is ready. Green Design Sydney can now review the core eligibility details.",
    buildBody: (data) => [
      "Hello Green Design Sydney,",
      "",
      "Please consider this project for the exclusive luxury home program.",
      "",
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Phone: ${data.phone || "Not provided"}`,
      `Project suburb or site: ${data.location}`,
      `Construction budget: ${data.budget}`,
      "",
      "Project vision:",
      data.vision
    ]
  },
  subscribe: {
    subject: "Green Design Sydney - Subscribe",
    success: "Your subscribe request summary is ready.",
    buildBody: (data) => [
      "Hello Green Design Sydney,",
      "",
      "Please add this email address to your updates list.",
      "",
      `Email Address: ${data.email}`
    ]
  }
};

function uniqueCategories() {
  return ["All", ...new Set(siteData.projects.map((project) => project.category))];
}

function limitItems(items, element) {
  if (!element) {
    return items;
  }

  const limit = Number(element.dataset.limit || 0);
  return limit > 0 ? items.slice(0, limit) : items;
}

function renderTicker() {
  if (!tickerTrack) {
    return;
  }

  const items = [...siteData.marquee, ...siteData.marquee];
  tickerTrack.innerHTML = items
    .map((item) => `<span class="ticker__item">${item}</span>`)
    .join("");
}

function renderFilters() {
  if (!projectFilters) {
    return;
  }

  projectFilters.innerHTML = uniqueCategories()
    .map(
      (category) => `
        <button
          class="filter-chip${category === activeFilter ? " is-active" : ""}"
          type="button"
          data-filter="${category}"
          aria-pressed="${category === activeFilter}"
        >
          ${category}
        </button>
      `
    )
    .join("");
}

function renderProjects() {
  if (!projectGrid) {
    return;
  }

  const filteredProjects =
    activeFilter === "All"
      ? siteData.projects
      : siteData.projects.filter((project) => project.category === activeFilter);
  const visibleProjects = limitItems(filteredProjects, projectGrid);

  projectGrid.innerHTML = visibleProjects
    .map(
      (project, index) => `
        <article class="project-card reveal">
          <button class="project-card__button" type="button" data-project="${project.id}">
            <figure class="project-card__media">
              <img src="${project.image}" alt="${project.title}" loading="lazy" />
            </figure>
            <div class="project-card__body">
              <div class="project-card__meta">
                <span>${String(index + 1).padStart(2, "0")}</span>
                <span>${project.category}</span>
              </div>
              <h3>${project.title}</h3>
              <p>${project.subtitle}</p>
            </div>
          </button>
        </article>
      `
    )
    .join("");

  document.querySelectorAll("[data-project]").forEach((button) => {
    button.addEventListener("click", () => openProject(button.dataset.project));
  });
}

function renderArchiveIndex() {
  if (!archiveIndexList) {
    return;
  }

  archiveIndexList.innerHTML = siteData.archiveTitles
    .map((title) => `<li>${title}</li>`)
    .join("");
}

function renderServices() {
  if (!serviceGrid) {
    return;
  }

  const visibleServices = limitItems(siteData.services, serviceGrid);
  serviceGrid.innerHTML = visibleServices
    .map(
      (service) => `
        <article class="service-card reveal">
          <figure class="service-card__media">
            <img src="${service.image}" alt="${service.title}" loading="lazy" />
          </figure>
          <div class="service-card__copy">
            <p class="service-card__category">${service.category}</p>
            <h3>${service.title}</h3>
            <p>${service.summary}</p>
            <ul class="tag-list">
              ${service.bullets.map((bullet) => `<li>${bullet}</li>`).join("")}
            </ul>
          </div>
        </article>
      `
    )
    .join("");
}

function renderProcess() {
  if (!processGrid) {
    return;
  }

  processGrid.innerHTML = siteData.process
    .map(
      (item) => `
        <article class="process-card reveal">
          <span class="process-card__step">${item.step}</span>
          <h3>${item.title}</h3>
          <p>${item.copy}</p>
        </article>
      `
    )
    .join("");
}

function renderFaqs() {
  if (!faqList) {
    return;
  }

  faqList.innerHTML = siteData.faqs
    .map(
      (item) => `
        <details class="faq-item reveal">
          <summary>${item.question}</summary>
          <p>${item.answer}</p>
        </details>
      `
    )
    .join("");
}

function openProject(projectId) {
  if (!dialog || !dialogImage || !dialogCategory || !dialogTitle || !dialogSubtitle || !dialogSummary || !dialogTags) {
    return;
  }

  const project = siteData.projects.find((item) => item.id === projectId);

  if (!project) {
    return;
  }

  dialogImage.src = project.image;
  dialogImage.alt = project.title;
  dialogCategory.textContent = project.category;
  dialogTitle.textContent = project.title;
  dialogSubtitle.textContent = project.subtitle;
  dialogSummary.textContent = project.summary;
  dialogTags.innerHTML = project.tags.map((tag) => `<li>${tag}</li>`).join("");
  showDialog(dialog);
}

function bindFilterEvents() {
  if (!projectFilters) {
    return;
  }

  projectFilters.addEventListener("click", (event) => {
    const target = event.target.closest("[data-filter]");

    if (!target) {
      return;
    }

    activeFilter = target.dataset.filter;
    renderFilters();
    renderProjects();
    revealVisibleItems();
  });
}

function bindMenu() {
  if (!menuToggle || !siteNav) {
    return;
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("nav-open", isOpen);
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      document.body.classList.remove("nav-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

function buildMailto(subject, body) {
  return `mailto:${siteData.enquiryEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function setFormFeedback(form, state, message) {
  const feedback = form.querySelector(".form-feedback");

  if (!feedback) {
    return;
  }

  feedback.dataset.state = state;
  feedback.textContent = message;
}

async function copyToClipboard(text) {
  if (!navigator.clipboard || typeof navigator.clipboard.writeText !== "function") {
    return false;
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function showDialog(dialogElement) {
  if (!dialogElement) {
    return false;
  }

  if (dialogElement.hasAttribute("open")) {
    return true;
  }

  if (typeof dialogElement.showModal === "function") {
    dialogElement.showModal();
  } else {
    dialogElement.setAttribute("open", "open");
  }

  return true;
}

function closeDialog(dialogElement) {
  if (!dialogElement) {
    return;
  }

  if (typeof dialogElement.close === "function") {
    dialogElement.close();
  } else {
    dialogElement.removeAttribute("open");
  }
}

function openBookingSheet() {
  return showDialog(bookingSheet);
}

function bindBookingSheet() {
  bookingSheetToggles.forEach((toggle) => {
    toggle.addEventListener("click", (event) => {
      event.preventDefault();
      openBookingSheet();
    });
  });

  if (!bookingSheet) {
    return;
  }

  bookingSheet.querySelectorAll("[data-sheet-close]").forEach((button) => {
    button.addEventListener("click", () => closeDialog(bookingSheet));
  });

  bookingSheet.addEventListener("click", (event) => {
    const rect = bookingSheet.getBoundingClientRect();
    const clickedInside =
      rect.top <= event.clientY &&
      event.clientY <= rect.top + rect.height &&
      rect.left <= event.clientX &&
      event.clientX <= rect.left + rect.width;

    if (!clickedInside) {
      closeDialog(bookingSheet);
    }
  });
}

function renderTrustWidget() {
  if (document.querySelector("[data-trust-widget]")) {
    return;
  }

  document.body.insertAdjacentHTML(
    "beforeend",
    `
      <div class="trust-widget" data-trust-widget>
        <button
          class="trust-widget__toggle"
          type="button"
          aria-expanded="false"
          aria-controls="trust-widget-panel"
          data-trust-toggle
        >
          <span class="trust-widget__icon" aria-hidden="true"></span>
          <span class="trust-widget__copy">
            <strong>Trusted Site</strong>
            <small>Security info</small>
          </span>
        </button>
        <section class="trust-widget__panel" id="trust-widget-panel" hidden data-trust-panel>
          <button class="trust-widget__close" type="button" aria-label="Close security panel" data-trust-close>
            Close
          </button>
          <p class="eyebrow">Trusted Site</p>
          <h3>Secure browsing and contact actions.</h3>
          <p>
            This rebuilt website keeps the booking and enquiry journey on-site, restores the
            verified studio contact details, and is ready for secure HTTPS publishing.
          </p>
          <ul class="trust-widget__list">
            <li>Verified address, weekday hours, landline and mobile studio numbers.</li>
            <li>Booking, estimate and subscribe flows no longer send visitors back to the old site.</li>
            <li>Ready for live SSL, email inbox and calendar integration on the published domain.</li>
          </ul>
        </section>
      </div>
    `
  );
}

function bindTrustWidget() {
  const widget = document.querySelector("[data-trust-widget]");
  const toggle = widget?.querySelector("[data-trust-toggle]");
  const panel = widget?.querySelector("[data-trust-panel]");

  if (!widget || !toggle || !panel) {
    return;
  }

  const closePanel = () => {
    toggle.setAttribute("aria-expanded", "false");
    panel.hidden = true;
  };

  toggle.addEventListener("click", () => {
    const isExpanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isExpanded));
    panel.hidden = isExpanded;
  });

  widget.querySelectorAll("[data-trust-close]").forEach((button) => {
    button.addEventListener("click", closePanel);
  });

  document.addEventListener("click", (event) => {
    if (panel.hidden || widget.contains(event.target)) {
      return;
    }

    closePanel();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !panel.hidden) {
      closePanel();
    }
  });
}

async function handleEnquirySubmit(event) {
  event.preventDefault();

  const form = event.currentTarget;

  if (!form.reportValidity()) {
    return;
  }

  const formType = form.dataset.enquiryForm;
  const definition = enquiryDefinitions[formType];

  if (!definition) {
    return;
  }

  const data = Object.fromEntries(new FormData(form).entries());
  const body = definition.buildBody(data).join("\n");
  const copied = await copyToClipboard(body);
  let message = definition.success;

  if (definition.openBookingSheet) {
    openBookingSheet();
  }

  if (hasEnquiryEmail) {
    window.location.href = buildMailto(definition.subject, body);
  }

  setFormFeedback(
    form,
    "success",
    copied ? `${message} The enquiry summary was also copied to your clipboard.` : message
  );
  form.reset();
}

function bindEnquiryForms() {
  enquiryForms.forEach((form) => {
    form.addEventListener("submit", handleEnquirySubmit);
  });
}

function revealVisibleItems() {
  document.querySelectorAll(".reveal").forEach((element) => {
    element.classList.add("is-visible");
  });
}

function bindRevealObserver() {
  if (!("IntersectionObserver" in window)) {
    revealVisibleItems();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: "0px 0px -12% 0px",
      threshold: 0.15
    }
  );

  document.querySelectorAll(".reveal").forEach((element) => {
    observer.observe(element);
  });

  window.setTimeout(() => {
    document.querySelectorAll(".reveal:not(.is-visible)").forEach((element) => {
      element.classList.add("is-visible");
    });
  }, 1800);
}

function bindActiveNavigation() {
  if (!siteNav) {
    return;
  }

  siteNav.querySelectorAll("a[data-nav-page]").forEach((link) => {
    link.classList.toggle("is-current", link.dataset.navPage === pageName);
  });
}

function bindDialogClose() {
  if (!dialog) {
    return;
  }

  dialog.addEventListener("click", (event) => {
    const anchor = event.target.closest("a[href]");

    if (anchor) {
      closeDialog(dialog);
      return;
    }

    const rect = dialog.getBoundingClientRect();
    const clickedInside =
      rect.top <= event.clientY &&
      event.clientY <= rect.top + rect.height &&
      rect.left <= event.clientX &&
      event.clientX <= rect.left + rect.width;

    if (!clickedInside) {
      closeDialog(dialog);
    }
  });
}

function scrollToHashTarget() {
  const hash = window.location.hash.replace("#", "");

  if (!hash) {
    return;
  }

  const target = document.getElementById(hash);

  if (!target) {
    return;
  }

  window.requestAnimationFrame(() => {
    target.scrollIntoView({ block: "start" });
  });
}

renderTicker();
renderFilters();
renderProjects();
renderArchiveIndex();
renderServices();
renderProcess();
renderFaqs();
renderTrustWidget();
bindFilterEvents();
bindEnquiryForms();
bindBookingSheet();
bindMenu();
bindRevealObserver();
bindActiveNavigation();
bindTrustWidget();
bindDialogClose();
scrollToHashTarget();
window.addEventListener("hashchange", scrollToHashTarget);
