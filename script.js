// AIR EXPRESS INTERNATIONAL COURIER SERVICES - INTERACTIVE ENGINE

document.addEventListener('DOMContentLoaded', () => {
    initHeroSlider();
    initWidgetTabs();
    initRateCalculator();
    initMobileNav();
    initScrollHeader();
});

/* -------------------------------------------------------------
 * 1. HERO SLIDER SYSTEM
 * ------------------------------------------------------------- */
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const dotsContainer = document.getElementById('sliderDots');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    
    if (!slides.length) return;
    
    let currentSlide = 0;
    let slideInterval;
    
    // Create navigation dots dynamically
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('slider-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    
    const dots = document.querySelectorAll('.slider-dot');
    
    function goToSlide(index) {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        
        currentSlide = (index + slides.length) % slides.length;
        
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }
    
    function nextSlide() {
        goToSlide(currentSlide + 1);
    }
    
    function prevSlide() {
        goToSlide(currentSlide - 1);
    }
    
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    
    // Auto slide play
    function startAutoSlide() {
        slideInterval = setInterval(nextSlide, 6000);
    }
    
    function stopAutoSlide() {
        clearInterval(slideInterval);
    }
    
    startAutoSlide();
    
    // Pause on hover
    const sliderContainer = document.getElementById('heroSlider');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', stopAutoSlide);
        sliderContainer.addEventListener('mouseleave', startAutoSlide);

        // Mobile Touch Swipe support
        let touchStartX = 0;
        let touchEndX = 0;
        sliderContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        sliderContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const swipeDiff = touchEndX - touchStartX;
            if (Math.abs(swipeDiff) > 40) {
                if (swipeDiff < 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
        }, { passive: true });
    }
}

/* -------------------------------------------------------------
 * 2. FLOATING WIDGET TABS
 * ------------------------------------------------------------- */
function initWidgetTabs() {
    const tabs = document.querySelectorAll('.widget-tab');
    const contents = document.querySelectorAll('.widget-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            
            tab.classList.add('active');
            const targetId = tab.getAttribute('data-target');
            const targetContent = document.querySelector(targetId);
            if (targetContent) targetContent.classList.add('active');
        });
    });
    
    // Quick forms submission
    
    const heroRateForm = document.getElementById('heroRateForm');
    if (heroRateForm) {
        heroRateForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const country = document.getElementById('heroCountry').value;
            const category = document.getElementById('heroType').value;
            const weight = document.getElementById('heroWeight').value;
            
            // Sync with main calculator
            const calcDest = document.getElementById('calcDestCountry');
            const calcCat = document.getElementById('calcCategory');
            const calcSlider = document.getElementById('calcWeightSlider');
            
            if (calcDest) calcDest.value = country;
            if (calcCat) calcCat.value = category;
            if (calcSlider) {
                calcSlider.value = weight;
                document.getElementById('weightDisplay').textContent = `${weight} KG`;
            }
            
            updateRateCalculator();
            document.getElementById('calculator').scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    const heroPickupForm = document.getElementById('heroPickupForm');
    if (heroPickupForm) {
        heroPickupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('quickName').value;
            const phone = document.getElementById('quickPhone').value;
            const address = document.getElementById('quickAddress').value;
            
            openPickupModal();
            document.getElementById('modalName').value = name;
            document.getElementById('modalPhone').value = phone;
            document.getElementById('modalAddress').value = address;
        });
    }
}

/* -------------------------------------------------------------
 * 3. RATE CALCULATOR & WHATSAPP RATE CALCULATION ENGINE
 * ------------------------------------------------------------- */
function initRateCalculator() {
    const slider = document.getElementById('calcWeightSlider');
    const destSelect = document.getElementById('calcDestCountry');
    const catSelect = document.getElementById('calcCategory');
    const areaInput = document.getElementById('calcPickupArea');
    
    if (slider) {
        slider.addEventListener('input', (e) => {
            const weightBadge = document.getElementById('weightDisplay');
            if (weightBadge) weightBadge.textContent = `${parseFloat(e.target.value).toFixed(1)} KG`;
            updateRateCalculator();
        });
    }
    
    if (destSelect) destSelect.addEventListener('change', updateRateCalculator);
    if (catSelect) catSelect.addEventListener('change', updateRateCalculator);
    if (areaInput) areaInput.addEventListener('input', updateRateCalculator);
    
    updateRateCalculator();
}

function updateRateCalculator() {
    const destSelect = document.getElementById('calcDestCountry');
    const catSelect = document.getElementById('calcCategory');
    const slider = document.getElementById('calcWeightSlider');
    const areaInput = document.getElementById('calcPickupArea');
    
    if (destSelect && document.getElementById('summaryDest')) {
        document.getElementById('summaryDest').textContent = destSelect.options[destSelect.selectedIndex].text;
    }
    if (catSelect && document.getElementById('summaryCategory')) {
        document.getElementById('summaryCategory').textContent = catSelect.options[catSelect.selectedIndex].text;
    }
    if (slider && document.getElementById('summaryWeight')) {
        document.getElementById('summaryWeight').textContent = `${parseFloat(slider.value).toFixed(1)} KG`;
    }
    if (areaInput && document.getElementById('summaryArea')) {
        document.getElementById('summaryArea').textContent = areaInput.value.trim() || 'Begumpet, Hyderabad';
    }
}

function calculateOnWhatsApp() {
    const destSelect = document.getElementById('calcDestCountry');
    const countryName = destSelect ? destSelect.options[destSelect.selectedIndex].text : 'International';
    const catSelect = document.getElementById('calcCategory');
    const categoryName = catSelect ? catSelect.options[catSelect.selectedIndex].text : 'General Parcel';
    const weight = document.getElementById('calcWeightSlider') ? parseFloat(document.getElementById('calcWeightSlider').value).toFixed(1) : '5.0';
    const area = (document.getElementById('calcPickupArea') && document.getElementById('calcPickupArea').value.trim()) 
        ? document.getElementById('calcPickupArea').value.trim() 
        : 'Begumpet, Hyderabad';
    const note = (document.getElementById('calcNote') && document.getElementById('calcNote').value.trim()) 
        ? document.getElementById('calcNote').value.trim() 
        : '';
    
    let message = `Hello Air Express International Courier,\n` +
        `I would like to calculate the courier rate for my shipment:\n\n` +
        `🌍 *Destination:* ${countryName}\n` +
        `📦 *Shipment Type:* ${categoryName}\n` +
        `⚖️ *Approx Weight:* ${weight} KG\n` +
        `📍 *Hyderabad Pickup Area:* ${area}\n`;
    
    if (note) {
        message += `📝 *Package Note:* ${note}\n`;
    }
    
    message += `\nPlease calculate the best discounted shipping rate quote and share the delivery timeline.`;
    
    const waUrl = `https://wa.me/919963257953?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
}

// Global aliases to ensure backwards compatibility
window.calculateOnWhatsApp = calculateOnWhatsApp;
window.bookCalculatedRate = calculateOnWhatsApp;

/* -------------------------------------------------------------
 * 5. MODALS & PICKUP BOOKING
 * ------------------------------------------------------------- */
function openPickupModal() {
    const modal = document.getElementById('pickupModal');
    if (modal) {
        modal.classList.add('active');
        document.body.classList.add('modal-open');
        // Set min date to today
        const dateInput = document.getElementById('modalDate');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.min = today;
            if (!dateInput.value) dateInput.value = today;
        }
    }
}

function closePickupModal() {
    const modal = document.getElementById('pickupModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
    }
}

// Global click listener to close modal when clicking outside dialog
document.addEventListener('click', (e) => {
    const modal = document.getElementById('pickupModal');
    if (modal && e.target === modal) {
        closePickupModal();
    }
});

// ESC key listener for modal and mobile menu
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closePickupModal();
        closeMobileNav();
    }
});

function handlePickupSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('modalName').value;
    const phone = document.getElementById('modalPhone').value;
    const date = document.getElementById('modalDate').value;
    const dest = document.getElementById('modalDest').value;
    const address = document.getElementById('modalAddress').value;
    const desc = document.getElementById('modalDesc').value;
    
    closePickupModal();
    showToast(`Thank you ${name}! Pickup requested for ${date}. Our agent will call ${phone} shortly.`, 'success');
    
    // Redirect option to WhatsApp for instant confirmation
    const waText = encodeURIComponent(`Hi Air Express,\nI booked a doorstep pickup via website:\nName: ${name}\nPhone: ${phone}\nDate: ${date}\nDestination: ${dest}\nAddress: ${address}\nParcel Info: ${desc}`);
    setTimeout(() => {
        window.open(`https://wa.me/919963257953?text=${waText}`, '_blank');
    }, 1200);
}

function handleContactSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('contactName').value;
    const phone = document.getElementById('contactPhone').value;
    const dest = document.getElementById('contactDestination').value;
    const msg = document.getElementById('contactMessage').value;
    
    showToast(`Inquiry received from ${name}! We will call ${phone} immediately.`, 'success');
    document.getElementById('contactForm').reset();
}

/* -------------------------------------------------------------
 * 6. NAVIGATION & HEADER SCROLL EFFECT
 * ------------------------------------------------------------- */
function closeMobileNav() {
    const menu = document.getElementById('navMenu');
    const backdrop = document.getElementById('mobileNavBackdrop');
    const toggle = document.getElementById('mobileToggle');
    const toggleIcon = document.getElementById('toggleIcon');
    
    if (menu) menu.classList.remove('active');
    if (backdrop) backdrop.classList.remove('active');
    if (toggle) {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.classList.remove('active');
    }
    if (toggleIcon) {
        toggleIcon.classList.remove('fa-xmark');
        toggleIcon.classList.add('fa-bars');
    }
    document.body.classList.remove('nav-open');
}

function openMobileNav() {
    const menu = document.getElementById('navMenu');
    const backdrop = document.getElementById('mobileNavBackdrop');
    const toggle = document.getElementById('mobileToggle');
    const toggleIcon = document.getElementById('toggleIcon');
    
    if (menu) menu.classList.add('active');
    if (backdrop) backdrop.classList.add('active');
    if (toggle) {
        toggle.setAttribute('aria-expanded', 'true');
        toggle.classList.add('active');
    }
    if (toggleIcon) {
        toggleIcon.classList.remove('fa-bars');
        toggleIcon.classList.add('fa-xmark');
    }
    document.body.classList.add('nav-open');
}

function toggleMobileNav(e) {
    if (e && e.stopPropagation) e.stopPropagation();
    const menu = document.getElementById('navMenu');
    if (menu && menu.classList.contains('active')) {
        closeMobileNav();
    } else {
        openMobileNav();
    }
}

window.toggleMobileNav = toggleMobileNav;
window.closeMobileNav = closeMobileNav;
window.openMobileNav = openMobileNav;

function initMobileNav() {
    const toggle = document.getElementById('mobileToggle');
    const menu = document.getElementById('navMenu');
    
    if (toggle && menu) {
        toggle.addEventListener('click', (e) => {
            toggleMobileNav(e);
        });
        
        // Close menu on link click
        menu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                closeMobileNav();
            });
        });
    }
}

function initScrollHeader() {
    const header = document.getElementById('mainHeader');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    checkMobileTopBar();
    window.addEventListener('resize', checkMobileTopBar);
}

function checkMobileTopBar() {
    const topBar = document.querySelector('.top-bar');
    if (topBar) {
        if (window.innerWidth <= 992) {
            topBar.style.display = 'none';
        } else {
            topBar.style.display = '';
        }
    }
}

/* -------------------------------------------------------------
 * 7. TOAST SYSTEM
 * ------------------------------------------------------------- */
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-info'}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 4500);
}
