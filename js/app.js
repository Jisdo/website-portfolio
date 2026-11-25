/* =========================================================
   Rajis Alfikar — Portfolio
   Theme, navigation, animations and interactions
   ========================================================= */

(function () {
    "use strict";

    var root = document.documentElement;
    var header = document.getElementById("header");
    var navToggle = document.getElementById("nav-toggle");
    var navList = document.getElementById("nav-list");
    var navOverlay = document.getElementById("nav-overlay");
    var themeToggle = document.getElementById("theme-toggle");
    var themeIcon = themeToggle ? themeToggle.querySelector("i") : null;
    var backToTop = document.getElementById("back-to-top");
    var progressBar = document.getElementById("scroll-progress-bar");
    var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var supportsObserver = "IntersectionObserver" in window;

    /* ---------------------------------------------------------
       Theme
       --------------------------------------------------------- */

    var metaTheme = document.querySelector('meta[name="theme-color"]');

    function applyTheme(theme, persist) {
        if (theme === "dark") {
            root.setAttribute("data-theme", "dark");
        } else {
            root.removeAttribute("data-theme");
        }

        if (themeIcon) {
            themeIcon.className = theme === "dark" ? "uil uil-sun" : "uil uil-moon";
        }

        if (themeToggle) {
            themeToggle.setAttribute(
                "aria-label",
                theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
            );
        }

        if (metaTheme) {
            metaTheme.setAttribute("content", theme === "dark" ? "#0d0e1e" : "#f7f6ff");
        }

        if (persist) {
            try {
                localStorage.setItem("theme", theme);
            } catch (error) {
                
            }
        }
    }

    applyTheme(root.getAttribute("data-theme") === "dark" ? "dark" : "light", false);

    if (themeToggle) {
        themeToggle.addEventListener("click", function () {
            var nextTheme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
            applyTheme(nextTheme, true);
        });
    }

    /* ---------------------------------------------------------
       Mobile navigation
       --------------------------------------------------------- */

    function setNav(open) {
        if (!header || !navToggle) return;
        header.classList.toggle("nav-open", open);
        document.body.classList.toggle("nav-open", open);
        if (navOverlay) navOverlay.classList.toggle("visible", open);
        navToggle.setAttribute("aria-expanded", String(open));
        navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }

    if (navToggle) {
        navToggle.addEventListener("click", function () {
            setNav(!header.classList.contains("nav-open"));
        });
    }

    if (navList) {
        navList.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                setNav(false);
            });
        });
    }

    if (navOverlay) {
        navOverlay.addEventListener("click", function () {
            setNav(false);
        });
    }

    document.addEventListener("click", function (event) {
        if (!header || !header.classList.contains("nav-open")) return;
        if (!header.contains(event.target)) setNav(false);
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") setNav(false);
    });

    window.addEventListener("resize", function () {
        if (window.innerWidth > 900) setNav(false);
    });

    /* ---------------------------------------------------------
       Scroll UI: sticky header, progress bar, back to top
       --------------------------------------------------------- */

    function updateScrollUI() {
        var scrollY = window.scrollY || window.pageYOffset || 0;

        if (header) {
            header.classList.toggle("scrolled", scrollY > 20);
        }

        if (backToTop) {
            backToTop.classList.toggle("visible", scrollY > 600);
        }

        if (progressBar) {
            var scrollable = document.documentElement.scrollHeight - window.innerHeight;
            var progress = scrollable > 0 ? (scrollY / scrollable) * 100 : 0;
            progressBar.style.width = Math.min(progress, 100) + "%";
        }
    }

    var scrollTicking = false;
    window.addEventListener(
        "scroll",
        function () {
            if (scrollTicking) return;
            scrollTicking = true;
            window.requestAnimationFrame(function () {
                updateScrollUI();
                scrollTicking = false;
            });
        },
        { passive: true }
    );
    updateScrollUI();

    if (backToTop) {
        backToTop.addEventListener("click", function () {
            window.scrollTo({
                top: 0,
                behavior: prefersReducedMotion ? "auto" : "smooth"
            });
        });
    }

    /* ---------------------------------------------------------
       Scroll spy — highlight the section in view
       --------------------------------------------------------- */

    var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));
    var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));

    if (supportsObserver && sections.length && navLinks.length) {
        var spy = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    var target = "#" + entry.target.id;
                    navLinks.forEach(function (link) {
                        link.classList.toggle("active", link.getAttribute("href") === target);
                    });
                });
            },
            { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
        );

        sections.forEach(function (section) {
            spy.observe(section);
        });
    }

    /* ---------------------------------------------------------
       Typewriter
       --------------------------------------------------------- */

    var typedText = document.querySelector(".typed-text");
    var typedCursor = document.querySelector(".typed-cursor");

    if (typedText) {
        var words = ["Web Designer", "Frontend Developer", "UI/UX Designer"];

        if (prefersReducedMotion) {
            typedText.textContent = words[0];
            if (typedCursor) typedCursor.style.display = "none";
        } else {
            var wordIndex = 0;
            var charIndex = 0;
            var deleting = false;
            typedText.textContent = "";

            var tick = function () {
                var word = words[wordIndex];
                charIndex += deleting ? -1 : 1;
                typedText.textContent = word.slice(0, charIndex);

                var delay = deleting ? 45 : 95;

                if (!deleting && charIndex >= word.length) {
                    delay = 1800;
                    deleting = true;
                } else if (deleting && charIndex <= 0) {
                    deleting = false;
                    wordIndex = (wordIndex + 1) % words.length;
                    delay = 400;
                }

                window.setTimeout(tick, delay);
            };

            window.setTimeout(tick, 500);
        }
    }

    /* ---------------------------------------------------------
       Animated statistics
       --------------------------------------------------------- */

    var counters = Array.prototype.slice.call(document.querySelectorAll("[data-count]"));

    function animateCounter(element) {
        var target = parseFloat(element.getAttribute("data-count")) || 0;
        var suffix = element.getAttribute("data-suffix") || "";
        var duration = 1600;
        var startTime = performance.now();

        function frame(now) {
            var progress = Math.min((now - startTime) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            element.textContent = Math.round(target * eased) + suffix;
            if (progress < 1) {
                window.requestAnimationFrame(frame);
            } else {
                element.textContent = target + suffix;
            }
        }

        window.requestAnimationFrame(frame);
    }

    if (counters.length) {
        if (supportsObserver && !prefersReducedMotion) {
            var counterObserver = new IntersectionObserver(
                function (entries, observer) {
                    entries.forEach(function (entry) {
                        if (entry.isIntersecting) {
                            animateCounter(entry.target);
                            observer.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.6 }
            );

            counters.forEach(function (counter) {
                counterObserver.observe(counter);
            });
        } else {
            counters.forEach(function (counter) {
                counter.textContent =
                    counter.getAttribute("data-count") + (counter.getAttribute("data-suffix") || "");
            });
        }
    }

    /* ---------------------------------------------------------
       Portfolio filters
       --------------------------------------------------------- */

    var filterButtons = Array.prototype.slice.call(document.querySelectorAll(".filter-btn"));
    var projectCards = Array.prototype.slice.call(document.querySelectorAll(".project-card"));

    projectCards.forEach(function (card) {
        card.addEventListener("animationend", function (event) {
            if (event.animationName === "cardIn") {
                card.classList.remove("reveal-in");
            }
        });
    });

    filterButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            var filter = button.getAttribute("data-filter") || "all";

            filterButtons.forEach(function (item) {
                var isActive = item === button;
                item.classList.toggle("active", isActive);
                item.setAttribute("aria-pressed", String(isActive));
            });

            projectCards.forEach(function (card) {
                var show = filter === "all" || card.getAttribute("data-category") === filter;
                card.classList.toggle("is-hidden", !show);

                if (show) {
                    card.classList.remove("reveal-in");
                    void card.offsetWidth;
                    card.classList.add("reveal-in");
                }
            });
        });
    });

    /* ---------------------------------------------------------
       Project lightbox
       --------------------------------------------------------- */

    var projects = {
        travel: {
            title: "Travel Planning, Reimagined",
            category: "UI/UX Design",
            image: "./assets/port1.jpg",
            alt: "Travel planning app screens pinned to a research wall",
            description:
                "A research-driven mobile experience that helps groups plan, compare and book trips together — without the spreadsheet chaos. I mapped the end-to-end journey, tested early flows with real travellers and shaped a simple, friendly interface.",
            year: "2026",
            role: "UX research · UI design",
            deliverables: "Mobile app · Prototype",
            tags: ["UX Research", "Wireframing", "Prototyping"]
        },
        dashboard: {
            title: "Pulse Analytics Dashboard",
            category: "Web Design",
            image: "./assets/port2.png",
            alt: "Analytics dashboard design shown on a desktop monitor",
            description:
                "A modular analytics dashboard built around a reusable widget library. The goal was to make dense data feel calm and scannable, with a clear hierarchy that helps teams spot what matters without hunting for it.",
            year: "2025",
            role: "Product design · UI system",
            deliverables: "Dashboard · Design system",
            tags: ["Dashboard", "Design System", "Figma"]
        },
        toolkit: {
            title: "Studio Design Toolkit",
            category: "Branding",
            image: "./assets/port3.jpg",
            alt: "Designer's desk with wireframes, keyboard and coffee",
            description:
                "A complete visual identity and design toolkit for a product studio — from typography, colour and grid systems to ready-to-use interface patterns that keep every new project consistent.",
            year: "2025",
            role: "Art direction · Design system",
            deliverables: "Brand guide · UI kit",
            tags: ["Identity", "Art Direction", "Guidelines"]
        },
        bookworm: {
            title: "BookWorm Reading App",
            category: "UI/UX Design",
            image: "./assets/port4.png",
            alt: "Hand-drawn mobile app wireframes on paper",
            description:
                "A friendly reading companion for discovering, tracking and sharing books. The project started with paper sketches and grew into a clickable prototype validated with a small group of avid readers.",
            year: "2024",
            role: "UX design · Prototyping",
            deliverables: "Mobile app · Prototype",
            tags: ["Mobile", "User Flows", "Prototype"]
        },
        planner: {
            title: "Daylight Daily Planner",
            category: "Web Design",
            image: "./assets/port5.png",
            alt: "Open daily planner beside a laptop on a wooden desk",
            description:
                "A minimal daily planning web app that turns a crowded to-do list into a calm, focused schedule. The interface pairs a quiet visual language with quick interactions so planning takes seconds, not minutes.",
            year: "2024",
            role: "UI design · Frontend",
            deliverables: "Web app · Responsive UI",
            tags: ["Web App", "UI Design", "Responsive"]
        },
        wanderlust: {
            title: "Wanderlust Travel Identity",
            category: "Branding",
            image: "./assets/port6.jpg",
            alt: "Travel brand workshop wall covered in sticky notes",
            description:
                "A bold travel brand built around real traveller pain points. I led the naming, tone of voice and visual direction, then delivered collateral and social templates the team could use straight away.",
            year: "2023",
            role: "Brand strategy · Design",
            deliverables: "Identity · Collateral",
            tags: ["Brand Strategy", "Naming", "Collateral"]
        }
    };

    var modal = document.getElementById("project-modal");
    var modalImage = document.getElementById("modal-image");
    var modalCategory = document.getElementById("modal-category");
    var modalTitle = document.getElementById("modal-title");
    var modalDesc = document.getElementById("modal-desc");
    var modalYear = document.getElementById("modal-year");
    var modalRole = document.getElementById("modal-role");
    var modalDeliverables = document.getElementById("modal-deliverables");
    var modalTags = document.getElementById("modal-tags");

    function openProject(key) {
        var project = projects[key];
        if (!project || !modal) return;

        if (modalImage) {
            modalImage.src = project.image;
            modalImage.alt = project.alt;
        }
        if (modalCategory) modalCategory.textContent = project.category;
        if (modalTitle) modalTitle.textContent = project.title;
        if (modalDesc) modalDesc.textContent = project.description;
        if (modalYear) modalYear.textContent = project.year;
        if (modalRole) modalRole.textContent = project.role;
        if (modalDeliverables) modalDeliverables.textContent = project.deliverables;

        if (modalTags) {
            modalTags.innerHTML = "";
            project.tags.forEach(function (tag) {
                var item = document.createElement("li");
                item.textContent = tag;
                modalTags.appendChild(item);
            });
        }

        if (typeof modal.showModal === "function") {
            if (!modal.open) modal.showModal();
        } else {
            modal.setAttribute("open", "");
        }

        document.body.classList.add("modal-open");
    }

    function closeProject() {
        if (!modal) return;
        if (typeof modal.close === "function") {
            modal.close();
        } else {
            modal.removeAttribute("open");
            document.body.classList.remove("modal-open");
        }
    }

    document.querySelectorAll(".project-thumb[data-project]").forEach(function (button) {
        button.addEventListener("click", function () {
            openProject(button.getAttribute("data-project"));
        });
    });

    var modalClose = document.getElementById("modal-close");
    var modalCta = document.getElementById("modal-cta");

    if (modalClose) modalClose.addEventListener("click", closeProject);
    if (modalCta) modalCta.addEventListener("click", closeProject);

    if (modal) {
        modal.addEventListener("click", function (event) {
            if (event.target === modal) closeProject();
        });

        modal.addEventListener("close", function () {
            document.body.classList.remove("modal-open");
        });
    }

    /* ---------------------------------------------------------
       Testimonial slider
       --------------------------------------------------------- */

    var slider = document.getElementById("testimonial-slider");
    var track = document.getElementById("testimonial-track");
    var slides = track ? Array.prototype.slice.call(track.children) : [];
    var dotsWrap = document.getElementById("slider-dots");
    var prevButton = document.getElementById("testimonial-prev");
    var nextButton = document.getElementById("testimonial-next");
    var slideIndex = 0;
    var autoplayTimer = null;

    function updateSlider() {
        if (!track) return;
        track.style.transform = "translateX(-" + slideIndex * 100 + "%)";

        if (dotsWrap) {
            Array.prototype.forEach.call(dotsWrap.children, function (dot, index) {
                var isActive = index === slideIndex;
                dot.classList.toggle("active", isActive);
                dot.setAttribute("aria-current", isActive ? "true" : "false");
            });
        }

        slides.forEach(function (slide, index) {
            slide.setAttribute("aria-hidden", index === slideIndex ? "false" : "true");
        });
    }

    function goToSlide(index) {
        if (!slides.length) return;
        slideIndex = (index + slides.length) % slides.length;
        updateSlider();
    }

    function stopAutoplay() {
        if (autoplayTimer) {
            window.clearInterval(autoplayTimer);
            autoplayTimer = null;
        }
    }

    function startAutoplay() {
        if (prefersReducedMotion || slides.length < 2) return;
        stopAutoplay();
        autoplayTimer = window.setInterval(function () {
            goToSlide(slideIndex + 1);
        }, 7000);
    }

    function restartAutoplay() {
        stopAutoplay();
        startAutoplay();
    }

    if (slides.length) {
        if (dotsWrap) {
            slides.forEach(function (_, index) {
                var dot = document.createElement("button");
                dot.type = "button";
                dot.className = "slider-dot";
                dot.setAttribute("aria-label", "Go to testimonial " + (index + 1));
                dot.addEventListener("click", function () {
                    goToSlide(index);
                    restartAutoplay();
                });
                dotsWrap.appendChild(dot);
            });
        }

        if (prevButton) {
            prevButton.addEventListener("click", function () {
                goToSlide(slideIndex - 1);
                restartAutoplay();
            });
        }

        if (nextButton) {
            nextButton.addEventListener("click", function () {
                goToSlide(slideIndex + 1);
                restartAutoplay();
            });
        }

        if (slider) {
            slider.addEventListener("mouseenter", stopAutoplay);
            slider.addEventListener("mouseleave", startAutoplay);

            slider.addEventListener("focusin", stopAutoplay);
            slider.addEventListener("focusout", function (event) {
                if (!slider.contains(event.relatedTarget)) startAutoplay();
            });

            slider.addEventListener("keydown", function (event) {
                if (event.key === "ArrowLeft") {
                    event.preventDefault();
                    goToSlide(slideIndex - 1);
                    restartAutoplay();
                } else if (event.key === "ArrowRight") {
                    event.preventDefault();
                    goToSlide(slideIndex + 1);
                    restartAutoplay();
                }
            });

            var touchStartX = null;

            slider.addEventListener(
                "touchstart",
                function (event) {
                    touchStartX = event.changedTouches[0].clientX;
                },
                { passive: true }
            );

            slider.addEventListener(
                "touchend",
                function (event) {
                    if (touchStartX === null) return;
                    var delta = event.changedTouches[0].clientX - touchStartX;
                    if (Math.abs(delta) > 50) {
                        goToSlide(delta < 0 ? slideIndex + 1 : slideIndex - 1);
                        restartAutoplay();
                    }
                    touchStartX = null;
                },
                { passive: true }
            );
        }

        updateSlider();
        startAutoplay();
    }

    /* ---------------------------------------------------------
       Contact form
       --------------------------------------------------------- */

    var form = document.getElementById("contact-form");

    if (form) {
        var nameField = document.getElementById("name");
        var emailField = document.getElementById("email");
        var subjectField = document.getElementById("subject");
        var messageField = document.getElementById("message");
        var formStatus = document.getElementById("form-status");
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        var requiredFields = [nameField, emailField, messageField];

        var setError = function (field, message) {
            if (!field) return;
            var errorElement = document.getElementById(field.id + "-error");
            field.classList.toggle("invalid", Boolean(message));
            field.setAttribute("aria-invalid", message ? "true" : "false");
            if (errorElement) errorElement.textContent = message || "";
        };

        requiredFields.forEach(function (field) {
            if (!field) return;
            field.addEventListener("input", function () {
                setError(field, "");
            });
        });

        form.addEventListener("submit", function (event) {
            event.preventDefault();

            var nameValue = nameField ? nameField.value.trim() : "";
            var emailValue = emailField ? emailField.value.trim() : "";
            var messageValue = messageField ? messageField.value.trim() : "";
            var firstInvalid = null;

            if (nameValue.length < 2) {
                setError(nameField, "Please enter your name.");
                firstInvalid = firstInvalid || nameField;
            } else {
                setError(nameField, "");
            }

            if (!emailPattern.test(emailValue)) {
                setError(emailField, "Please enter a valid email address.");
                firstInvalid = firstInvalid || emailField;
            } else {
                setError(emailField, "");
            }

            if (messageValue.length < 10) {
                setError(messageField, "Tell me a little more — at least 10 characters.");
                firstInvalid = firstInvalid || messageField;
            } else {
                setError(messageField, "");
            }

            if (firstInvalid) {
                firstInvalid.focus();
                if (formStatus) {
                    formStatus.textContent = "Please check the highlighted fields and try again.";
                    formStatus.className = "form-status error visible";
                }
                return;
            }

            var subjectValue =
                subjectField && subjectField.value.trim()
                    ? subjectField.value.trim()
                    : "Project inquiry from " + nameValue;

            var body =
                "Hi Rajis,\n\n" +
                messageValue +
                "\n\n— " +
                nameValue +
                "\n" +
                emailValue;

            var mailto =
                "mailto:rajisalfikar@gmail.com?subject=" +
                encodeURIComponent(subjectValue) +
                "&body=" +
                encodeURIComponent(body);

            window.location.href = mailto;

            if (formStatus) {
                formStatus.textContent =
                    "Opening your email app with the message ready to send. If nothing happens, email me directly at rajisalfikar@gmail.com.";
                formStatus.className = "form-status visible";
            }
        });
    }

    /* ---------------------------------------------------------
       Footer year
       --------------------------------------------------------- */

    var yearElement = document.getElementById("year");
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    /* ---------------------------------------------------------
       Scroll reveal animations
       --------------------------------------------------------- */

    if (window.ScrollReveal && !prefersReducedMotion) {
        var sr = window.ScrollReveal({
            duration: 1400,
            distance: "50px",
            easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            reset: false,
            viewFactor: 0.15
        });

        sr.reveal(".showcase-info > *", { interval: 100, origin: "bottom", delay: 150 });
        sr.reveal(".showcase-image", { origin: "right", distance: "70px", delay: 250 });
        sr.reveal(".about-visual", { origin: "left", distance: "70px" });
        sr.reveal(".about-info > *", { interval: 90, origin: "bottom" });
        sr.reveal(".section-header > *", { interval: 80, origin: "bottom" });
        sr.reveal(".service-card", { interval: 120, origin: "bottom" });
        sr.reveal(".filter-bar", { origin: "bottom" });
        sr.reveal(".project-card", { interval: 90, origin: "bottom" });
        sr.reveal(".portfolio-foot", { origin: "bottom" });
        sr.reveal(".testimonial-slider", { origin: "bottom", distance: "60px" });
        sr.reveal(".slider-controls", { origin: "bottom" });
        sr.reveal(".contact-info > *", { interval: 90, origin: "left" });
        sr.reveal(".contact-form", { origin: "right", distance: "60px" });
        sr.reveal(".footer-grid > *", { interval: 80, origin: "bottom" });
    }
})();
