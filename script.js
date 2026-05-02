const { siteData } = window;

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
const bookingLinks = [...document.querySelectorAll("[data-booking-url]")];

let activeFilter = "All";
const hasEnquiryEmail = Boolean(siteData.enquiryEmail && siteData.enquiryEmail.trim());

const enquiryDefinitions = {
  contact: {
    subject: "Green Design Sydney - Free Estimate Request",
    success: "Your estimate request draft is ready.",
    fallbackSuccess:
      "Your estimate request summary is ready. The live contact page has been opened because the original site does not publish a direct public email address.",
    fallbackUrl: () => siteData.contactPageUrl,
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
    success:
      "Your booking request draft is ready and the original live calendar has been opened in a new tab.",
    openBooking: true,
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
      "Your consideration request draft is ready. Green Design Sydney can now review the luxury brief with the core eligibility details included.",
    fallbackSuccess:
      "Your luxury consideration summary is ready. The live contact page has been opened so the original enquiry flow is still available.",
    fallbackUrl: () => siteData.contactPageUrl,
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
    success: "The subscribe request draft is ready.",
    fallbackSuccess:
      "Your subscribe request summary is ready. The live contact page has been opened because the original site does not publish a direct public email address.",
    fallbackUrl: () => siteData.contactPageUrl,
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

function renderTicker() {
  const items = [...siteData.marquee, ...siteData.marquee];
  tickerTrack.innerHTML = items
    .map((item) => `<span class="ticker__item">${item}</span>`)
    .join("");
}

function renderFilters() {
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
  const filteredProjects =
    activeFilter === "All"
      ? siteData.projects
      : siteData.projects.filter((project) => project.category === activeFilter);

  projectGrid.innerHTML = filteredProjects
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
  archiveIndexList.innerHTML = siteData.archiveTitles
    .map((title) => `<li>${title}</li>`)
    .join("");
}

function renderServices() {
  serviceGrid.innerHTML = siteData.services
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

  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    dialog.setAttribute("open", "open");
  }
}

function bindFilterEvents() {
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

function bindLiveLinks() {
  bookingLinks.forEach((link) => {
    link.href = siteData.bookingUrl;
    link.target = "_blank";
    link.rel = "noreferrer";
  });
}

function buildMailto(subject, body) {
  return `mailto:${siteData.enquiryEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function openExternal(url) {
  if (!url) {
    return false;
  }

  window.open(url, "_blank", "noopener,noreferrer");
  return true;
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
  const fallbackUrl =
    typeof definition.fallbackUrl === "function" ? definition.fallbackUrl() : definition.fallbackUrl;
  let message = definition.success;

  if (definition.openBooking) {
    openExternal(siteData.bookingUrl);
  }

  if (hasEnquiryEmail) {
    window.location.href = buildMailto(definition.subject, body);
  } else if (fallbackUrl) {
    openExternal(fallbackUrl);
    message = definition.fallbackSuccess || definition.success;
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

function bindActiveSections() {
  const links = [...siteNav.querySelectorAll("a")];
  const sectionMap = new Map(
    links.map((link) => [link.getAttribute("href").replace("#", ""), link])
  );

  if (!("IntersectionObserver" in window)) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const id = entry.target.id;
        links.forEach((link) => link.classList.remove("is-current"));

        if (sectionMap.has(id)) {
          sectionMap.get(id).classList.add("is-current");
        }
      });
    },
    {
      threshold: 0.45
    }
  );

  document.querySelectorAll("section[id]").forEach((section) => observer.observe(section));
}

function bindDialogClose() {
  dialog.addEventListener("click", (event) => {
    const anchor = event.target.closest('a[href^="#"]');

    if (anchor) {
      dialog.close();
      return;
    }

    const rect = dialog.getBoundingClientRect();
    const clickedInside =
      rect.top <= event.clientY &&
      event.clientY <= rect.top + rect.height &&
      rect.left <= event.clientX &&
      event.clientX <= rect.left + rect.width;

    if (!clickedInside) {
      dialog.close();
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
bindLiveLinks();
bindFilterEvents();
bindEnquiryForms();
bindMenu();
bindRevealObserver();
bindActiveSections();
bindDialogClose();
scrollToHashTarget();
window.addEventListener("hashchange", scrollToHashTarget);
