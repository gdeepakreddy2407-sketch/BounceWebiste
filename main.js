// JavaScript logo animation logic
const animatedLogo = document.getElementById('animatedLogo');
const animatedLogoImg = document.getElementById('animatedLogoImg');
const animatedLogoText = document.getElementById('animatedLogoText');

const headerLogoPlaceholder = document.getElementById('headerLogoPlaceholder');
const headerTextPlaceholder = document.getElementById('headerTextPlaceholder');
const headerLogoContainer = document.getElementById('headerLogoContainer');
const headerEl = document.getElementById('header');

// Cached Logo Dimensions to prevent layout thrashing (stuttering)
let cachedTargetX = 0;
let cachedTargetY = 0;
let isLogoLayoutCached = false;

window.addEventListener('resize', () => {
    isLogoLayoutCached = false;
});

function calculateLogoAnimation(scrollY) {
    const ANIMATION_START = 0;
    const ANIMATION_END = 120; // Pixels to scroll before animation is complete

    if (!animatedLogo || !headerLogoContainer) return;

    // Compute layout only once (or on resize) to prevent severe layout thrashing (stutter)
    if (!isLogoLayoutCached) {
        const rect = headerLogoContainer.getBoundingClientRect();
        const isMobileLayout = window.innerWidth <= 768;
        // Since header is sticky top:0, getBoundingClientRect is reliably absolute to viewport.
        // However, by the time progress=1, header gets .scrolled which changes padding
        // (Desktop: 14px -> 10px, Mobile: 12px -> 10px). We adjust the final target Y accordingly.
        const scrollOffset = isMobileLayout ? 2 : 4;
        cachedTargetX = rect.left + (rect.width / 2);
        cachedTargetY = rect.top + (rect.height / 2) - scrollOffset;
        isLogoLayoutCached = true;
    }

    // Direct calculate progress (0 to 1) perfectly synced to scroll (fixes throwing lag)
    let progress = (scrollY - ANIMATION_START) / (ANIMATION_END - ANIMATION_START);
    progress = Math.max(0, Math.min(1, progress));

    // Easing function for smoother movement curve
    const easeProgress = 1 - Math.pow(1 - progress, 3);

    const isMobile = window.innerWidth <= 768;

    const START_TOP = isMobile ? 110 : 140;
    const sourceHeight = isMobile ? 44 : 76; // Match CSS width/height
    
    // On mobile, the header target is 32px (CSS line 1641), so 32/44 = 0.72 scale
    // On desktop, target is 40px, so 40/76 = 0.52 scale
    const END_SCALE = isMobile ? 0.72 : 0.52;

    const viewportCenterX = window.innerWidth / 2;

    // Interpolate position relative to the page to eliminate the "throwing" sensation
    // When progress is 0, element moves up exactly synced with the page scroll.
    // When progress is 1, element is perfectly locked to the target header position.
    const startCenterYScreen = START_TOP + sourceHeight / 2 - scrollY;
    const currentCenterYScreen = startCenterYScreen * (1 - easeProgress) + cachedTargetY * easeProgress;

    const startCenterXScreen = viewportCenterX;
    const currentCenterXScreen = startCenterXScreen * (1 - easeProgress) + cachedTargetX * easeProgress;

    const deltaX = currentCenterXScreen - viewportCenterX;
    const deltaY = currentCenterYScreen - (START_TOP + sourceHeight / 2);

    const scale = 1 - easeProgress * (1 - END_SCALE);
    const currentX = easeProgress * deltaX;
    const currentY = easeProgress * deltaY;

    // Hardcode subpixel rendering (translate3d) to engage hardware accel natively
    animatedLogo.style.transform = `translate3d(calc(-50% + ${currentX}px), ${currentY}px, 0) scale(${scale})`;

    // Toggle interactive elements
    if (progress === 1) {
        animatedLogo.classList.add('in-header');
    } else {
        animatedLogo.classList.remove('in-header');
    }
}

// Feature Layout Interactivity
function activateFeature(index) {
    // 1. Remove active class from all tabs
    document.querySelectorAll('.feature-tab').forEach(tab => tab.classList.remove('active'));
    // 2. Remove active class from all panes
    document.querySelectorAll('.feature-pane').forEach(pane => pane.classList.remove('active'));

    // 3. Add active class to the clicked tab
    const tabs = document.querySelectorAll('.feature-tab');
    if (tabs[index]) tabs[index].classList.add('active');

    // 4. Add active class to the corresponding pane
    const pane = document.getElementById('feature-pane-' + index);
    if (pane) pane.classList.add('active');
}

// Download Modal Functions
function openMacModal(e) {
    if (e) e.preventDefault();
    document.getElementById('macDownloadModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeMacModal() {
    document.getElementById('macDownloadModal').classList.remove('active');
    document.body.style.overflow = '';
}

function openAndroidModal(e) {
    if (e) e.preventDefault();
    document.getElementById('androidDownloadModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeAndroidModal() {
    document.getElementById('androidDownloadModal').classList.remove('active');
    document.body.style.overflow = '';
}

// Stop swipe hint animation on interaction
setTimeout(() => {
    document.querySelectorAll('.feature-sidebar').forEach(sidebar => {
        const stopAnimation = () => {
            sidebar.classList.add('user-scrolled');

            // also hide the hint text smoothly
            const container = sidebar.closest('.container');
            if (container) {
                const hint = container.querySelector('.feature-swipe-hint');
                if (hint) hint.classList.add('user-scrolled');
            }

            // Remove listeners after first interaction
            sidebar.removeEventListener('scroll', stopAnimation);
            sidebar.removeEventListener('touchstart', stopAnimation);
            sidebar.removeEventListener('mousedown', stopAnimation);
        };
        sidebar.addEventListener('scroll', stopAnimation, { passive: true });
        sidebar.addEventListener('touchstart', stopAnimation, { passive: true });
        sidebar.addEventListener('mousedown', stopAnimation, { passive: true });
    });
}, 1000); // Brief delay so initial rendering layout-shifts don't trigger the removal

function openContactModal(e) {
    if (e) e.preventDefault();
    document.getElementById('contactModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeContactModal() {
    document.getElementById('contactModal').classList.remove('active');
    document.body.style.overflow = '';
}

function handleEmailClick(e) {
    e.preventDefault();
    const email = "support@bounceconnect.app";

    // Check if device is mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile) {
        // On mobile, just trigger the default mail app
        window.location.href = `mailto:${email}`;
    } else {
        // On desktop, open Gmail composer in a new tab
        window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${email}`, '_blank');
    }
}

// Close modal when clicking outside
window.addEventListener('click', function (e) {
    if (e.target.classList.contains('download-modal') || e.target.classList.contains('contact-modal')) {
        e.target.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closeMacModal();
        closeAndroidModal();
        closeContactModal();
    }
});

// Carousel Arrow Visibility Toggle
const carouselWrapper = document.querySelector('.carousel-wrapper');
const carouselScrollBtn = document.getElementById('carouselScrollBtn');

if (carouselWrapper && carouselScrollBtn) {
    carouselWrapper.addEventListener('scroll', () => {
        const maxScroll = carouselWrapper.scrollWidth - carouselWrapper.clientWidth;
        // Using 10px threshold for stability across different browsers/zooms
        if (carouselWrapper.scrollLeft >= maxScroll - 10) {
            carouselScrollBtn.classList.add('hidden');
        } else {
            carouselScrollBtn.classList.remove('hidden');
        }
    }, { passive: true });
}

// Attach to all download buttons
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.btn-mac').forEach(button => {
        button.addEventListener('click', openMacModal);
    });
    document.querySelectorAll('.btn-android').forEach(button => {
        button.addEventListener('click', openAndroidModal);
    });
});

// Optimized Scroll Handlers using requestAnimationFrame
let ticking = false;
const header = document.getElementById('header');
const scrollProgress = document.getElementById('scrollProgress');

let documentHeight = 0;
let isDocumentHeightCalculated = false;

function getDocumentHeight() {
    if (!isDocumentHeightCalculated) {
        documentHeight = Math.max(1, document.documentElement.scrollHeight - document.documentElement.clientHeight);
        isDocumentHeightCalculated = true;
    }
    return documentHeight;
}

window.addEventListener('resize', () => {
    isDocumentHeightCalculated = false;
});

function updateScroll() {
    const currentScrollY = window.pageYOffset;

    // 1. Progress Bar
    if (scrollProgress) {
        const scrolled = (currentScrollY / getDocumentHeight()) * 100;
        scrollProgress.style.width = scrolled + '%';
    }

    // 2. Header Effect
    if (header) {
        if (currentScrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // 3. Logo Animation Effect
    calculateLogoAnimation(currentScrollY);

    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            updateScroll();
        });
        ticking = true;
    }
}, { passive: true });

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -80px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Stop observing once visible to save resources
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Run logo animation calculation once on load to set initial state
setTimeout(() => {
    // Instantly snap to target on load
    calculateLogoAnimation(window.pageYOffset || 0);
}, 50);

document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
});

// Background Reveal Observer for Features Intro
// Since we are using 'animate-on-scroll' generic class, it will get the 'visible' class automatically
// which triggers the opacity 1 on ::before

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const headerOffset = (document.querySelector('header')?.offsetHeight || 0) + 12;
            const top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

// Liquid nav bubble — single floating pill follows hover
(function () {
    document.querySelectorAll('.liquid-nav').forEach(function (nav) {
        var bubble = document.createElement('span');
        bubble.className = 'nav-bubble';
        nav.prepend(bubble);
        var links = nav.querySelectorAll('a');
        function moveBubble(el) {
            var nr = nav.getBoundingClientRect();
            var er = el.getBoundingClientRect();
            bubble.style.left = (er.left - nr.left) + 'px';
            bubble.style.top = (er.top - nr.top) + 'px';
            bubble.style.width = er.width + 'px';
            bubble.style.height = er.height + 'px';
            bubble.style.opacity = '1';
        }
        links.forEach(function (link) {
            link.addEventListener('mouseenter', function () { moveBubble(this); });
        });
        nav.addEventListener('mouseleave', function () { bubble.style.opacity = '0'; });
    });
})();

// Mobile menu toggle
(function () {
    var menuBtn = document.getElementById('mobileMenuBtn');
    var mobileMenu = document.getElementById('mobileMenu');
    var overlay = document.getElementById('mobileMenuOverlay');

    function toggleMenu() {
        menuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    }

    function closeMenu() {
        menuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (menuBtn) {
        menuBtn.addEventListener('click', toggleMenu);
    }

    if (overlay) {
        overlay.addEventListener('click', closeMenu);
    }

    // Close menu when clicking a link
    if (mobileMenu) {
        var menuLinks = mobileMenu.querySelectorAll('a');
        menuLinks.forEach(function (link) {
            link.addEventListener('click', closeMenu);
        });
    }
})();
