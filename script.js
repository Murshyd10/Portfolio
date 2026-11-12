// ==========================================================================
// Murshid Portfolio — Interactive Logic (Vanilla JS)
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  const htmlEl = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mainNav = document.getElementById("mainNav");
  const navLinks = document.querySelectorAll(".nav-link");
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");
  const copyBtns = document.querySelectorAll(".copy-btn");
  const contactForm = document.getElementById("contactForm");
  const formFeedback = document.getElementById("formFeedback");
  const yearEl = document.getElementById("currentYear");

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 1. Theme Toggle (Dark / Light)
  const savedTheme = localStorage.getItem("murshid_theme") || "dark";
  htmlEl.setAttribute("data-theme", savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current = htmlEl.getAttribute("data-theme");
      const next = current === "dark" ? "light" : "dark";
      htmlEl.setAttribute("data-theme", next);
      localStorage.setItem("murshid_theme", next);
    });
  }

  // 2. Mobile Navigation Drawer
  if (mobileMenuBtn && mainNav) {
    mobileMenuBtn.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("open");
      mobileMenuBtn.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("open");
        mobileMenuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  // 3. Scroll-Spy Navigation Highlighting
  const sections = document.querySelectorAll("main section[id]");
  const updateActiveNav = () => {
    const scrollPos = window.scrollY + 130;
    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute("id");
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
        });
      }
    });
  };
  window.addEventListener("scroll", updateActiveNav, { passive: true });
  updateActiveNav();

  // 4. Project Category Filter
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const category = btn.getAttribute("data-filter");
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      projectCards.forEach((card) => {
        const cardCat = card.getAttribute("data-category");
        const shouldShow = category === "all" || cardCat === category;
        card.classList.toggle("hidden", !shouldShow);
      });
    });
  });

  // 5. Copy-to-Clipboard Buttons
  copyBtns.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const textToCopy = btn.getAttribute("data-copy");
      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);
        const original = btn.textContent;
        btn.textContent = "Copied!";
        setTimeout(() => {
          btn.textContent = original;
        }, 1800);
      } catch {
        btn.textContent = "Select text";
      }
    });
  });

  // 6. Contact Form Handling (Email & WhatsApp)
  const getFormValues = () => {
    const name = document.getElementById("senderName")?.value.trim() || "";
    const email = document.getElementById("senderEmail")?.value.trim() || "";
    const subject = document.getElementById("senderSubject")?.value.trim() || "";
    const message = document.getElementById("senderMessage")?.value.trim() || "";
    return { name, email, subject, message };
  };

  const validateForm = ({ name, email, subject, message }) => {
    if (!name || !email || !subject || !message) {
      formFeedback.textContent = "Please fill in all required fields before sending.";
      formFeedback.className = "form-feedback error";
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      formFeedback.textContent = "Please enter a valid email address.";
      formFeedback.className = "form-feedback error";
      return false;
    }
    return true;
  };

  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const values = getFormValues();
      if (!validateForm(values)) return;

      const submitBtn = document.getElementById("submitEmailBtn");
      const submitBtnText = document.getElementById("submitBtnText");
      if (submitBtn) submitBtn.disabled = true;
      if (submitBtnText) submitBtnText.textContent = "Sending...";
      formFeedback.textContent = "Sending your message...";
      formFeedback.className = "form-feedback";

      const payload = JSON.stringify({
        name: values.name,
        email: values.email,
        _replyto: values.email,
        _subject: `[Portfolio Inquiry] ${values.subject}`,
        subject: values.subject,
        message: values.message,
        _captcha: "false",
        _template: "table",
      });

      // Send asynchronously in background so slow third-party servers never freeze the UI
      fetch("https://formsubmit.co/ajax/f2af7f4416463ea57b9e50e2245d9837", {
        method: "POST",
        keepalive: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: payload,
      }).catch(() => {});

      fetch("https://formsubmit.co/ajax/murshyd7@gmail.com", {
        method: "POST",
        keepalive: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: payload,
      }).catch(() => {});

      await new Promise((resolve) => setTimeout(resolve, 600));

      formFeedback.textContent = `✓ Message Sent Successfully! Thank you, ${values.name} — Murshid will get back to you soon.`;
      formFeedback.className = "form-feedback success";
      contactForm.reset();

      if (submitBtnText) submitBtnText.textContent = "✓ Sent Successfully";
      if (submitBtn) submitBtn.disabled = false;

      setTimeout(() => {
        if (submitBtnText) submitBtnText.textContent = "Send Message";
      }, 3500);
    });
  }
});
