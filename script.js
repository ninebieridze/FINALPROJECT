document.addEventListener("DOMContentLoaded", () => {
  // Mobile navigation
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");

  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  document.querySelectorAll(".nav a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  // Header navigation active state
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav a");

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.remove("active"));
        const current = document.querySelector(`.nav a[href="#${entry.target.id}"]`);
        if (current) current.classList.add("active");
      }
    });
  }, { rootMargin: "-35% 0px -55% 0px" });

  sections.forEach(section => observer.observe(section));

  // Hero slider: changes ONLY the photos every 5 seconds.
  const heroSlides = document.querySelectorAll(".hero-slide");
  const heroDots = document.querySelectorAll(".hero-dot");
  let heroIndex = 0;

  function showHeroSlide(index) {
    heroSlides.forEach((slide, i) => slide.classList.toggle("active", i === index));
    heroDots.forEach((dot, i) => dot.classList.toggle("active", i === index));
    heroIndex = index;
  }

  setInterval(() => {
    showHeroSlide((heroIndex + 1) % heroSlides.length);
  }, 5000);

  heroDots.forEach((dot, index) => {
    dot.addEventListener("click", () => showHeroSlide(index));
  });

  // About progress bars animate when About section enters viewport.
  const aboutSection = document.querySelector("#about");
  const progressBars = document.querySelectorAll(".progress span");

  const skillObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      progressBars.forEach(bar => {
        bar.style.width = bar.dataset.width;
      });
      skillObserver.disconnect();
    }
  }, { threshold: 0.3 });

  skillObserver.observe(aboutSection);

  // Project filtering
  const filterButtons = document.querySelectorAll(".filter");
  const projectCards = document.querySelectorAll(".project-card");

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      filterButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      const filter = button.dataset.filter;

      projectCards.forEach(card => {
        const matches = filter === "all" || card.dataset.category === filter;
        card.classList.toggle("hidden", !matches);
      });
    });
  });

  // Testimonials: exactly 4 slides + 4 buttons.
  const testimonials = document.querySelectorAll(".testimonial");
  const testimonialDots = document.querySelectorAll(".testimonial-dot");

  function showTestimonial(index) {
    testimonials.forEach((slide, i) => slide.classList.toggle("active", i === index));
    testimonialDots.forEach((dot, i) => dot.classList.toggle("active", i === index));
  }

  testimonialDots.forEach(dot => {
    dot.addEventListener("click", () => {
      showTestimonial(Number(dot.dataset.slide));
    });
  });

  // Contact form -> JSONPlaceholder POST.
  const contactForm = document.querySelector("#contact-form");
  const formStatus = document.querySelector("#form-status");
  const modal = document.querySelector("#success-modal");
  const closeModal = document.querySelector(".modal-close");
  const modalOk = document.querySelector(".modal-ok");

  function openModal() {
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
  }

  function hideModal() {
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
  }

  contactForm.addEventListener("submit", async event => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      website: formData.get("website"),
      message: formData.get("message")
    };

    formStatus.textContent = "Sending...";

    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Request failed");

      await response.json();
      contactForm.reset();
      formStatus.textContent = "";
      openModal();
    } catch (error) {
      formStatus.textContent = "Something went wrong. Please try again.";
    }
  });

  closeModal.addEventListener("click", hideModal);
  modalOk.addEventListener("click", hideModal);

  modal.addEventListener("click", event => {
    if (event.target === modal) hideModal();
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") hideModal();
  });
});
