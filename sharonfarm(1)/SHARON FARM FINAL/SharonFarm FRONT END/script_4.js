// Mobile Menu Toggle
const menuOpenButton = document.querySelector("#menu-open-button");
const menuCloseButton = document.querySelector("#menu-close-button");

menuOpenButton.addEventListener("click", () => {
    document.body.classList.add("show-mobile-menu");
});

menuCloseButton.addEventListener("click", () => {
    document.body.classList.remove("show-mobile-menu");
});

// Close menu when clicking on a nav link
document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
        document.body.classList.remove("show-mobile-menu");
    });
});

// Initialize Product Swipers
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all product swipers with conditional navigation
    const productSwipers = document.querySelectorAll('.product-gallery');
    
    productSwipers.forEach(swiperEl => {
        const slides = swiperEl.querySelectorAll('.swiper-slide');
        
        // Only initialize Swiper if there are multiple slides
        if (slides.length > 1) {
            new Swiper(swiperEl, {
                loop: true,
                autoplay: {
                    delay: 5000,
                    disableOnInteraction: false,
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
            });
        } else {
            // Hide navigation elements if only one image
            swiperEl.querySelector('.swiper-pagination').style.display = 'none';
            swiperEl.querySelector('.swiper-button-prev').style.display = 'none';
            swiperEl.querySelector('.swiper-button-next').style.display = 'none';
            
            // Make the single image fill the container properly
            swiperEl.classList.add('single-image');
        }
    });

    // Rest of existing code (smooth scrolling, etc.)
    document.querySelectorAll('.product-categories a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            document.querySelectorAll('.product-categories a').forEach(link => {
                link.classList.remove('active');
            });
            
            this.classList.add('active');
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            const headerHeight = document.querySelector('header').offsetHeight;
            const categoryNavHeight = document.querySelector('.product-categories').offsetHeight;
            const offset = headerHeight + categoryNavHeight;
            
            window.scrollTo({
                top: targetSection.offsetTop - offset,
                behavior: 'smooth'
            });
        });
    });

    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY + document.querySelector('header').offsetHeight + document.querySelector('.product-categories').offsetHeight + 20;
        
        document.querySelectorAll('.product-section').forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                const id = section.getAttribute('id');
                document.querySelectorAll('.product-categories a').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
});