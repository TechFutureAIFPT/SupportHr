// ============================= 
// Main Initialization
// =============================
document.addEventListener("DOMContentLoaded", function() {
    // Highlight feature buttons on page load
    highlightFeatureButtons();
    
    // Initialize certificate modal
    initCertificateModal();
    
    // Mobile menu toggle
    initMobileNav();
    
    // Smooth scroll for anchor links
    initSmoothScroll();
    
    // Header scroll effect
    initHeaderScroll();
    
    // Team Photo Carousel
    initPhotoCarousel();

    // Achievements single-image carousel
    initAchievementsCarousel();

    // Custom analytics events (Vercel Analytics if available)
    initAnalyticsEvents();

});

// =============================
// Mobile Navigation
// =============================
function initMobileNav() {
    const navToggle = document.querySelector(".nav-toggle");
    const mainNav = document.querySelector(".main-nav");
    
    if (navToggle) {
        navToggle.addEventListener("click", function() {
            mainNav.classList.toggle("active");
            const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
            navToggle.setAttribute("aria-expanded", !isExpanded);
        });
    }

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll(".main-nav a");
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            if (mainNav && navToggle) {
                mainNav.classList.remove("active");
                navToggle.setAttribute("aria-expanded", "false");
            }
        });
    });
}

// =============================
// Smooth Scroll
// =============================
function initSmoothScroll() {
    document.querySelectorAll("a[href^=\"#\"]").forEach(anchor => {
        anchor.addEventListener("click", function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute("href"));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });
}

// =============================
// Header Scroll Effect
// =============================
function initHeaderScroll() {
    const header = document.querySelector(".site-header");
    // Passive listener for better INP/scroll performance
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    }, { passive: true });
}

// =============================
// Feature Button Highlight Effect
// =============================
function highlightFeatureButtons() {
    const featureButtons = document.querySelectorAll(".feature-btn");
    
    // Add animation class with delay
    featureButtons.forEach((btn, index) => {
        setTimeout(() => {
            btn.style.animation = "highlight 2s ease";
            
            // Remove animation after it is done
            setTimeout(() => {
                btn.style.animation = "";
            }, 2000);
        }, index * 500 + 1500); // Staggered delay for each button
    });
}

// =============================
// Certificate Modal
// =============================
function initCertificateModal() {
    // Modal Elements
    const modal = document.getElementById("certificate-modal");
    const modalImg = document.getElementById("modal-certificate-img");
    const modalTitle = document.getElementById("modal-certificate-title");
    const closeBtn = document.querySelector(".close-modal");
    
    if (!modal || !modalImg || !modalTitle || !closeBtn) {
        console.error("Modal elements not found");
        return;
    }
    
    // Get all certificate images
    const certificateImgs = document.querySelectorAll(".certificate-img");
    const viewButtons = document.querySelectorAll(".view-certificate-btn");
    
    console.log("Certificate images:", certificateImgs.length);
    console.log("View buttons:", viewButtons.length);
    
    // Add click event to certificate images
    certificateImgs.forEach(img => {
        img.addEventListener("click", function() {
            openModal(this);
        });
    });
    
    // Add click event to view buttons
    viewButtons.forEach(btn => {
        btn.addEventListener("click", function(e) {
            e.stopPropagation();
            const imgWrapper = this.closest(".achievement-image-wrapper");
            if (imgWrapper) {
                const img = imgWrapper.querySelector(".certificate-img");
                if (img) {
                    openModal(img);
                }
            }
        });
    });
    
    // Function to open modal
    function pauseAchievements(){
        const root = document.getElementById('achievementsCarousel');
        if(root){ root.dispatchEvent(new Event('mouseenter')); }
    }
    function resumeAchievements(){
        const root = document.getElementById('achievementsCarousel');
        if(root){ root.dispatchEvent(new Event('mouseleave')); }
    }

    function trapFocus(e){
        if(modal.style.display !== 'flex') return;
        if(e.key !== 'Tab') return;
        const focusable = modal.querySelectorAll('button, [href], img, [tabindex]:not([tabindex="-1"])');
        if(!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length-1];
        if(e.shiftKey){
            if(document.activeElement === first){ e.preventDefault(); last.focus(); }
        } else {
            if(document.activeElement === last){ e.preventDefault(); first.focus(); }
        }
    }

    function openModal(imgElement) {
        const certSrc = imgElement.getAttribute("data-cert");
        const figureElement = imgElement.closest("figure");
        
        if (certSrc && figureElement) {
            const h3Element = figureElement.querySelector("h3");
            const certTitle = h3Element ? h3Element.textContent : "Certificate";
            
            modalImg.src = certSrc;
            modalTitle.textContent = certTitle;
            modal.style.display = "flex";
            
            // Disable scrolling on body
            document.body.style.overflow = "hidden";
            pauseAchievements();
            // Focus modal
            setTimeout(()=>{ modal.focus(); },0);
            document.addEventListener('keydown', trapFocus);
        }
    }
    
    // Close modal when clicking X button
    closeBtn.addEventListener("click", closeModal);
    
    // Close modal when clicking outside the image
    modal.addEventListener("click", function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close with Escape key
    document.addEventListener("keydown", function(e) {
        if (e.key === "Escape" && modal.style.display === "flex") {
            closeModal();
        }
    });
    
    // Function to close modal
    function closeModal() {
        modal.style.display = "none";
        
        // Enable scrolling again
        document.body.style.overflow = "";
        resumeAchievements();
        document.removeEventListener('keydown', trapFocus);
    }
}

// =============================
// Photo Carousel for Team Section
// =============================
function initPhotoCarousel() {
    const carousel = document.getElementById("teamCarousel");
    if (!carousel) return;
    
    const slides = Array.from(carousel.querySelectorAll(".carousel-slide"));
    const dots = Array.from(document.querySelectorAll(".carousel-dots .dot"));
    const controls = Array.from(document.querySelectorAll(".carousel-control"));
    let currentSlide = 0;
    let autoPlayTimer;

    function showSlide(index) {
        // Wrap around
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        
        // Update slides
        slides.forEach((slide, i) => {
            slide.classList.toggle("active", i === index);
        });
        
        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === index);
        });
        
        currentSlide = index;
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    function startAutoPlay() {
        autoPlayTimer = setInterval(nextSlide, 8000); // 8 giây cho mỗi slide
    }

    function stopAutoPlay() {
        clearInterval(autoPlayTimer);
    }

    // Add event listeners to controls
    controls.forEach(control => {
        control.addEventListener("click", () => {
            const dir = parseInt(control.getAttribute("data-dir") || "0");
            if (dir > 0) nextSlide();
            else if (dir < 0) prevSlide();
            
            stopAutoPlay();
            startAutoPlay();
        });
    });

    // Add event listeners to dots
    dots.forEach((dot, i) => {
        dot.addEventListener("click", () => {
            showSlide(i);
            stopAutoPlay();
            startAutoPlay();
        });
    });

    // Start auto-play
    startAutoPlay();
}

// =============================
// Achievements Carousel (single image auto slide)
// =============================
function initAchievementsCarousel() {
    const root = document.getElementById("achievementsCarousel");
    if (!root) return;

    const slides = Array.from(root.querySelectorAll(".achievement-slide"));
    const dots = Array.from(root.querySelectorAll(".achv-dot"));
    const controls = Array.from(root.querySelectorAll(".achv-control"));
    let current = 0;
    let timer;
    const INTERVAL = 5000; // 5 giây

    function show(index) {
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        slides.forEach((s, i) => {
            s.classList.toggle("active", i === index);
        });
        dots.forEach((d, i) => d.classList.toggle("active", i === index));
        current = index;
    }

    function next() { show(current + 1); }
    function prev() { show(current - 1); }

    function start() {
        stop();
        timer = setInterval(next, INTERVAL);
    }
    function stop() { if (timer) clearInterval(timer); }

    controls.forEach(btn => {
        btn.addEventListener('click', () => {
            const dir = parseInt(btn.getAttribute('data-dir') || '0');
            if (dir > 0) next(); else if (dir < 0) prev();
            start();
        });
    });

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            show(i);
            start();
        });
    });

    // Pause on hover
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);

    // Open modal when clicking certificate (reuse existing modal logic works due to shared classes)
    show(0);
    start();
}

// =============================
// Analytics Events (Vercel)
// =============================
function initAnalyticsEvents(){
    if(typeof window === 'undefined') return;
    const track = (name, data={}) => { if(window.va) { try { window.va(name, data); } catch(e) { /* swallow */ } } };
    // Track primary CTAs
    document.querySelectorAll('.cta-buttons a, .feature-btn').forEach(el=>{
        el.addEventListener('click', ()=>{
            track('cta_click', { id: el.textContent.trim(), href: el.getAttribute('href') });
        }, { passive:true });
    });
    // Nav menu clicks
    document.querySelectorAll('#primary-menu a').forEach(a=>{
        a.addEventListener('click', ()=>track('nav_click', { target: a.getAttribute('href') }), { passive:true });
    });
}
