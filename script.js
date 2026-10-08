const header = document.getElementById("header");
const menuToggle = document.getElementById("menu-toggle");
const themeToggle = document.getElementById("theme-toggle");
const nav = document.getElementById("nav");
const navLinks = [...document.querySelectorAll(".nav-link")];
const sections = [...document.querySelectorAll("section[id]")];
const year = document.getElementById("year");
const filterButtons = [...document.querySelectorAll(".filter-btn")];
const projectCards = [...document.querySelectorAll(".project-card")];
const counters = [...document.querySelectorAll(".counter")];
const contactForm = document.getElementById("contact-form");
const formStatus = document.querySelector(".form-status");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const setCurrentYear = () => {
    if (year) {
        year.textContent = new Date().getFullYear();
    }
};

const updateHeaderState = () => {
    if (!header) {
        return;
    }

    header.classList.toggle("scrolled", window.scrollY > 40);
};

const closeNavMenu = () => {
    if (!nav || !menuToggle) {
        return;
    }

    nav.classList.remove("open");
    menuToggle.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
};

const toggleNavMenu = () => {
    if (!nav || !menuToggle) {
        return;
    }

    const isOpen = nav.classList.toggle("open");
    menuToggle.classList.toggle("open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
};

const setActiveLink = currentId => {
    navLinks.forEach(link => {
        const isActive = link.getAttribute("href") === `#${currentId}`;
        link.classList.toggle("active", isActive);
        if (isActive) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
    });
};

const syncActiveSection = () => {
    if (!sections.length) {
        return;
    }

    let currentSection = "home";

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 180;
        const sectionHeight = section.offsetHeight;

        if (
            window.scrollY >= sectionTop &&
            window.scrollY < sectionTop + sectionHeight
        ) {
            currentSection = section.getAttribute("id") || "home";
        }
    });

    setActiveLink(currentSection);
};

const safeStorage = {
    getItem(key) {
        try {
            return localStorage.getItem(key);
        } catch (error) {
            return null;
        }
    },
    setItem(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch (error) {
            // Ignore storage errors in restricted environments.
        }
    }
};

const getPreferredTheme = () => {
    const savedTheme = safeStorage.getItem("victor-portfolio-theme");

    if (savedTheme === "light" || savedTheme === "dark") {
        return savedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
};

const applyTheme = theme => {
    const isLight = theme === "light";
    document.body.dataset.theme = theme;

    if (themeToggle) {
        const icon = themeToggle.querySelector(".theme-toggle__icon");
        themeToggle.setAttribute("aria-pressed", String(isLight));
        if (icon) {
            icon.textContent = isLight ? "🌙" : "☀️";
        }
    }

    safeStorage.setItem("victor-portfolio-theme", theme);
};

const animateCounter = counter => {
    const target = Number(counter.dataset.target || 0);
    const suffix = counter.dataset.suffix || "";
    const duration = 1400;
    const start = performance.now();

    const update = timestamp => {
        const progress = Math.min((timestamp - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.round(target * eased);
        counter.textContent = `${currentValue}${suffix}`;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    };

    requestAnimationFrame(update);
};

const initCounters = () => {
    if (!counters.length || prefersReducedMotion) {
        counters.forEach(counter => {
            const target = Number(counter.dataset.target || 0);
            const suffix = counter.dataset.suffix || "";
            counter.textContent = `${target}${suffix}`;
        });
        return;
    }

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.4 }
    );

    counters.forEach(counter => observer.observe(counter));
};

const applyProjectFilter = filter => {
    if (!filterButtons.length || !projectCards.length) {
        return;
    }

    filterButtons.forEach(button => {
        const isActive = button.dataset.filter === filter;
        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });

    projectCards.forEach(card => {
        const matches = filter === "all" || card.dataset.category === filter;
        card.classList.toggle("is-hidden", !matches);
    });
};

const handleContactSubmit = event => {
    if (!contactForm || !formStatus) {
        return;
    }

    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();

    if (!name || !email || !message) {
        formStatus.textContent = "Please complete all fields before sending your message.";
        return;
    }

    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
    const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nProject details:\n${message}`
    );

    window.location.href = `mailto:victorotiieno@gmail.com?subject=${subject}&body=${body}`;
    formStatus.textContent = "Your email app should open with a draft ready. Review it and choose Send; nothing is sent automatically.";
    contactForm.reset();
};

setCurrentYear();
updateHeaderState();
syncActiveSection();
applyTheme(getPreferredTheme());
initCounters();
applyProjectFilter("all");

if (menuToggle) {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.addEventListener("click", toggleNavMenu);
}

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const nextTheme = document.body.dataset.theme === "light" ? "dark" : "light";
        applyTheme(nextTheme);
    });
}

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        applyProjectFilter(button.dataset.filter || "all");
    });
});

if (contactForm) {
    contactForm.addEventListener("submit", handleContactSubmit);
}

navLinks.forEach(link => {
    link.addEventListener("click", () => {
        closeNavMenu();
    });
});

document.addEventListener("click", event => {
    if (!nav || !menuToggle) {
        return;
    }

    const clickedInsideNav = nav.contains(event.target) || menuToggle.contains(event.target);

    if (!clickedInsideNav) {
        closeNavMenu();
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeNavMenu();
    }
});

window.addEventListener("scroll", () => {
    updateHeaderState();
    syncActiveSection();
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
        closeNavMenu();
    }
});

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12
        }
    );

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
} else {
    revealElements.forEach(element => {
        element.classList.add("visible");
    });
}

document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
        const targetId = link.getAttribute("href");

        if (targetId === "#") {
            return;
        }

        const target = document.querySelector(targetId);

        if (target) {
            event.preventDefault();

            const headerHeight = header ? header.offsetHeight : 0;
            const targetPosition =
                target.getBoundingClientRect().top +
                window.scrollY -
                headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: prefersReducedMotion ? "auto" : "smooth"
            });
        }
    });
});

const profileImage = document.querySelector(".profile-image-wrapper img");

if (profileImage) {
    profileImage.addEventListener("error", () => {
        profileImage.style.display = "none";

        if (profileImage.parentElement) {
            profileImage.parentElement.classList.add("image-error");
        }
    });
}

window.addEventListener("load", () => {
    document.querySelector(".hero-content")?.classList.add("visible");
    document.querySelector(".hero-visual")?.classList.add("visible");
});