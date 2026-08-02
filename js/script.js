// Define safe jQuery reference globally in this file
const $ = window.jQuery || (window.Webflow && window.Webflow.jQuery) || window.$;

/* OUR APPROACH Circle rotating */
document.addEventListener('DOMContentLoaded', function () {
    const circle = document.querySelector('.circle');
    if (circle) {
        let currentAngle = 0; // Initial angle

        document.addEventListener('mousemove', (event) => {
            const { clientX, clientY } = event;
            const { x, y, width, height } = circle.getBoundingClientRect();
            const circleX = x + width / 2;
            const circleY = y + height / 2;

            const angle = Math.atan2(clientY - circleY, clientX - circleX);
            const degree = angle * (180 / Math.PI) + 90;

            const delta = degree - currentAngle;

            if (delta > 180) {
                currentAngle += delta - 360;
            } else if (delta < -180) {
                currentAngle += delta + 360;
            } else {
                currentAngle = degree;
            }

            circle.style.transform = `rotate(${currentAngle}deg)`;
        });
    }
});



/* Lenis smooth scroll */
document.addEventListener('DOMContentLoaded', function () {
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
            prevent: (node) => node.classList.contains('w-reset'),
            duration: 1,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        $("[data-lenis-start]").on("click", function () {
            lenis.start();
        });
        $("[data-lenis-stop]").on("click", function () {
            lenis.stop();
        });
        $("[data-lenis-toggle]").on("click", function () {
            $(this).toggleClass("stop-scroll");
            if ($(this).hasClass("stop-scroll")) {
                lenis.stop();
            } else {
                lenis.start();
            }
        });
    }
});

/* Remove duplicate slashes in URL */
document.addEventListener("DOMContentLoaded", function () {
    const urlObj = new URL(window.location.href);
    const cleanPathname = urlObj.pathname.replace(/\/{2,}/g, '/');

    if (urlObj.pathname !== cleanPathname) {
        const cleanUrl = urlObj.origin + cleanPathname + urlObj.search + urlObj.hash;
        window.location.replace(cleanUrl);
    }
});

/* Footer year, nav scroll, gradient text hover */
document.addEventListener('DOMContentLoaded', function () {
    // Footer get current year
    var yearElements = document.getElementsByClassName('year');
    [].slice.call(yearElements).forEach(function (div) {
        div.innerHTML = new Date().getFullYear();
    });

    // Nav bar background changes on scroll
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function () {
            const threshold = 0.1 * window.innerHeight;

            if (window.scrollY > threshold) {
                navbar.style.background = 'rgba(4, 4, 16, 0.6)';
                navbar.style.backdropFilter = 'blur(10px)';
            } else {
                navbar.style.background = 'rgba(4, 4, 16, 0)';
                navbar.style.backdropFilter = 'blur(0px)';
            }
        });
    }

    // Gradient text on hover
    function updateDataText() {
        document.querySelectorAll('.gradient-text-on-hover').forEach(element => {
            const text = element.textContent;
            element.setAttribute('data-text', text);
        });
    }
    updateDataText();
});

/* Adding rel attribute to links */
function setRelAttribute() {
    var elems = document.body.getElementsByTagName('a');
    for (var i = 0; i < elems.length; i++) {
        var elem = elems[i];
        var re = /archzen.com.au/;
        var isInternal = re.test(elem.href) ||
            elem.hostname === window.location.hostname ||
            elem.href.startsWith('file://') ||
            elem.href.startsWith('/') ||
            !elem.href.startsWith('http');
        var isExcludedLink = checkExcludedLink(elem.href);
        var hasExcludeAttribute = elem.hasAttribute('data-exclude');

        if (!isInternal && !isExcludedLink && !hasExcludeAttribute) {
            elem.rel = 'noopener noreferrer nofollow';
            elem.target = '_blank';
        }
    }
}

function checkExcludedLink(href) {
    var excludedLinks = [
        'https://www.linkedin.com/company/archzen/?trk=ppro_cprof',
    ];
    return excludedLinks.includes(href);
}

document.addEventListener('DOMContentLoaded', function () {
    setRelAttribute();
}, false);

/* Swiper Slider */
document.addEventListener('DOMContentLoaded', function () {
    if (typeof Swiper !== 'undefined') {
        function numberWithZero(num) {
            return num < 10 ? "0" + num : num;
        }

        const swiperT = window.swiperT = new Swiper(".swiper-t", {
            loop: false,
            observer: true,
            observeParents: true,
            speed: 300,
            navigation: {
                nextEl: `[swiper="next-t"]`,
                prevEl: `[swiper="prev-t"]`,
            },
            breakpoints: {
                479: {
                    // Desktop   
                    slidesPerView: 2,
                    spaceBetween: 0,
                },
                320: {
                    // Mobile Portrait
                    slidesPerView: 1,
                    spaceBetween: 20,
                },
            },
            autoplay: {
                delay: 2000,
                disableOnInteraction: false,
            },
            on: {
                autoplayTimeLeft(swiper, timeLeft, progress) {
                    const activeIndex = swiper.realIndex;
                    if (swiper.slides[activeIndex]) {
                        const progressbar = swiper.slides[activeIndex].querySelector(".progressbar");
                        if (progressbar) {
                            progressbar.style.transform = `scaleX(${1 - progress})`;
                        }
                    }
                },
                slideChange(swiper) {
                    const previousIndex = swiper.previousIndex;
                    if (swiper.slides[previousIndex]) {
                        const previousProgressbar = swiper.slides[previousIndex].querySelector(".progressbar");
                        if (previousProgressbar) {
                            previousProgressbar.style.transform = 'scaleX(0)';
                        }
                    }

                    const activeIndex = swiper.realIndex;
                    if (swiper.slides[activeIndex]) {
                        const currentProgressbar = swiper.slides[activeIndex].querySelector(".progressbar");
                        if (currentProgressbar) {
                            currentProgressbar.style.transform = 'scaleX(0)';
                        }
                    }
                },
            },
        });

        // Manual triggers for navigation buttons using CAPTURE phase to bypass Webflow event stopPropagation
        document.addEventListener('click', function (e) {
            const prevT = e.target.closest('[swiper="prev-t"]');
            const nextT = e.target.closest('[swiper="next-t"]');
            const prevF = e.target.closest('[swiper="prev-f"]');
            const nextF = e.target.closest('[swiper="next-f"]');

            if (prevT) {
                e.preventDefault();
                e.stopPropagation();
                swiperT.slidePrev();
            }
            if (nextT) {
                e.preventDefault();
                e.stopPropagation();
                swiperT.slideNext();
            }
            if (prevF) {
                e.preventDefault();
                e.stopPropagation();
                swiperFeatures.slidePrev();
            }
            if (nextF) {
                e.preventDefault();
                e.stopPropagation();
                swiperFeatures.slideNext();
            }
        }, true); // Capture phase is key!

        // Manual triggers for nav menu links to bypass Webflow click prevention on external pages
        document.addEventListener('click', function (e) {
            const navLink = e.target.closest('.nav-dropdown-link, .nav-dropdown-toggle, .nav-link, .footer-link, .card');
            if (navLink) {
                const href = navLink.getAttribute('href');
                if (href && !href.startsWith('#') && href !== '#') {
                    e.preventDefault();
                    e.stopPropagation();
                    window.location.href = navLink.href;
                }
            }
        }, true);

        $(".home_testimonials").each(function () {
            let totalSlides = numberWithZero($(this).find(".swiper-t-slide").length);
            // Webflow duplicates slides in loop mode. Original slides count is total / 2 (or we can just hardcode 3 for simplicity)
            $(".swiper-number-total").text("03");

            swiperT.on("slideChange", function (e) {
                let slideNumber = numberWithZero(e.realIndex + 1);
                $(".swiper-number-current").text(slideNumber);
            });
        });

        const swiperFeatures = window.swiperFeatures = new Swiper(".swiper-f", {
            loop: false,
            observer: true,
            observeParents: true,
            speed: 500,
            navigation: {
                nextEl: `[swiper="next-f"]`,
                prevEl: `[swiper="prev-f"]`,
            },
            breakpoints: {
                479: {
                    // Desktop   
                    slidesPerView: 2,
                    spaceBetween: 0,
                },
                320: {
                    // Mobile Portrait
                    slidesPerView: 1,
                    spaceBetween: 0,
                },
            },
        });
    }
});

/* Button glow */
document.addEventListener('DOMContentLoaded', function () {
    if (typeof gsap !== 'undefined' && typeof chroma !== 'undefined') {
        const generateGlowButtons = () => {
            document.querySelectorAll(".button-glow").forEach((button) => {
                let gradientElem = button.querySelector('.gradient');

                if (!gradientElem) {
                    gradientElem = document.createElement("div");
                    gradientElem.classList.add("gradient");
                    button.appendChild(gradientElem);
                }

                button.addEventListener("pointermove", (e) => {
                    const rect = button.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    gsap.to(button, {
                        "--pointer-x": `${x}px`,
                        "--pointer-y": `${y}px`,
                        duration: 0.6,
                    });
                    gsap.to(button, {
                        "--button-glow": chroma
                            .mix(
                                getComputedStyle(button)
                                    .getPropertyValue("--button-glow-start")
                                    .trim(),
                                getComputedStyle(button).getPropertyValue("--button-glow-end").trim(),
                                x / rect.width
                            )
                            .hex(),
                        duration: 0.2,
                    });
                });
            });
        }

        // Call the function on load and resize
        generateGlowButtons();
        window.addEventListener('resize', generateGlowButtons);
    }
});
(() => {
    const cards = document.querySelectorAll(".card");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    cards.forEach((card) => {
        if (reduceMotion) return;

        let frame = null;
        const MAX_TILT = 3;

        card.addEventListener(
            "animationend",
            () => {
                card.style.animation = "none";
                card.style.opacity = "1";
                card.style.transform = "none";
            },
            { once: true }
        );

        card.addEventListener("pointermove", (e) => {
            const rect = card.getBoundingClientRect();

            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;

            const rotateY = (x - 0.5) * MAX_TILT * 2;
            const rotateX = (0.5 - y) * MAX_TILT * 2;

            if (frame) cancelAnimationFrame(frame);

            frame = requestAnimationFrame(() => {
                card.style.transform = `
          perspective(900px)
          rotateX(${rotateX}deg)
          rotateY(${rotateY}deg)
        `;
            });
        });

        card.addEventListener("pointerleave", () => {
            if (frame) cancelAnimationFrame(frame);
            card.style.transform = "none";
        });
    });
})();