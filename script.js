document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.getElementById("menu-toggle");
    const navLinks = document.getElementById("nav-links");
    const header = document.querySelector(".header");
    const navigationLinks = document.querySelectorAll(".nav-links a");
    const sections = document.querySelectorAll("section[id]");
    const projectCards = document.querySelectorAll(".project-card");
    const profileImage = document.querySelector(".profile-image img");

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", function () {
            navLinks.classList.toggle("active");

            const isOpen = navLinks.classList.contains("active");

            menuToggle.textContent = isOpen ? "✕" : "☰";
            menuToggle.setAttribute("aria-expanded", isOpen);
        });
    }

    navigationLinks.forEach(function (link) {
        link.addEventListener("click", function () {
            if (navLinks) {
                navLinks.classList.remove("active");
            }

            if (menuToggle) {
                menuToggle.textContent = "☰";
                menuToggle.setAttribute("aria-expanded", "false");
            }
        });
    });

    function updateActiveNavigation() {
        let currentSection = "";

        sections.forEach(function (section) {
            const sectionTop = section.offsetTop - 200;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (
                window.scrollY >= sectionTop &&
                window.scrollY < sectionBottom
            ) {
                currentSection = section.id;
            }
        });

        navigationLinks.forEach(function (link) {
            link.classList.remove("active");

            if (link.getAttribute("href") === "#" + currentSection) {
                link.classList.add("active");
            }
        });
    }

    function updateHeader() {
        if (!header) {
            return;
        }

        if (window.scrollY > 40) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    }

    window.addEventListener("scroll", function () {
        updateActiveNavigation();
        updateHeader();
    });

    updateActiveNavigation();
    updateHeader();

    const revealElements = document.querySelectorAll(
        ".section-heading, .about-text, .highlight-card, .skill-card, .timeline-item, .project-card, .contact-container"
    );

    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("reveal");
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12
            }
        );

        revealElements.forEach(function (element) {
            revealObserver.observe(element);
        });
    } else {
        revealElements.forEach(function (element) {
            element.classList.add("reveal");
        });
    }

    projectCards.forEach(function (card) {
        card.addEventListener("mouseenter", function () {
            card.style.transform = "translateY(-8px)";
        });

        card.addEventListener("mouseleave", function () {
            card.style.transform = "";
        });
    });

    const interactiveCards = document.querySelectorAll(
        ".skill-card, .highlight-card"
    );

    interactiveCards.forEach(function (card) {
        card.addEventListener("mouseenter", function () {
            card.style.transform = "translateY(-6px)";
        });

        card.addEventListener("mouseleave", function () {
            card.style.transform = "";
        });
    });

    if (profileImage) {
        profileImage.addEventListener("error", function () {
            profileImage.style.display = "none";
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener("click", function (event) {
            const targetId = anchor.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const target = document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();

            const headerHeight = header ? header.offsetHeight : 0;

            window.scrollTo({
                top: target.offsetTop - headerHeight,
                behavior: "smooth"
            });
        });
    });

    const currentYear = document.getElementById("year");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
});
