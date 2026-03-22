// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80; // Navbar height
            const targetPosition = target.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Tab functionality for installation instructions
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetTab = button.getAttribute('data-tab');
        
        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked button and corresponding content
        button.classList.add('active');
        document.getElementById(targetTab).classList.add('active');
    });
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// Download button placeholders (실제 다운로드 링크로 교체 필요)
document.getElementById('download-windows')?.addEventListener('click', (e) => {
    e.preventDefault();
    // TODO: 실제 Windows 다운로드 링크로 교체
    alert('Windows 다운로드 링크가 곧 제공될 예정입니다.');
});

document.getElementById('download-macos')?.addEventListener('click', (e) => {
    e.preventDefault();
    // TODO: 실제 macOS 다운로드 링크로 교체
    alert('macOS 다운로드 링크가 곧 제공될 예정입니다.');
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe download cards and version cards (feature cards are now in slider)
document.querySelectorAll('.download-card, .version-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Features Slider - Infinite Scroll
const featuresSlider = () => {
    const track = document.querySelector('.features-track');
    const cards = document.querySelectorAll('.feature-card');
    const prevBtn = document.querySelector('.slider-btn-prev');
    const nextBtn = document.querySelector('.slider-btn-next');
    const dots = document.querySelectorAll('.dot');
    
    if (!track || !cards.length) return;
    
    let currentIndex = 0;
    const totalCards = 3; // 실제 카드 수 (중복 제외)
    let isTransitioning = false;
    
    // 카드 너비 계산 (85% + gap)
    const getCardWidth = () => {
        const slider = document.querySelector('.features-slider');
        if (!slider) return 85;
        const sliderWidth = slider.offsetWidth;
        const cardWidthPercent = 85;
        const gapPercent = 1.5; // gap 고려
        return cardWidthPercent + gapPercent;
    };
    
    // 초기 위치 설정 (첫 번째 실제 카드)
    const updateSlider = (index, smooth = true) => {
        if (isTransitioning && smooth) return;
        
        isTransitioning = smooth;
        currentIndex = index;
        
        // 무한 루프를 위한 인덱스 조정
        let displayIndex = index;
        if (index < 0) {
            displayIndex = totalCards - 1;
        } else if (index >= totalCards) {
            displayIndex = 0;
        }
        
        // 카드 너비 + gap을 고려한 계산
        const cardWidthWithGap = getCardWidth();
        const translateX = -displayIndex * cardWidthWithGap;
        track.style.transition = smooth ? 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none';
        track.style.transform = `translateX(${translateX}%)`;
        
        // 도트 업데이트
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === displayIndex);
        });
        
        // 무한 루프를 위한 위치 조정
        if (smooth) {
            setTimeout(() => {
                if (index < 0) {
                    track.style.transition = 'none';
                    const cardWidthWithGap = getCardWidth();
                    track.style.transform = `translateX(-${(totalCards - 1) * cardWidthWithGap}%)`;
                    currentIndex = totalCards - 1;
                } else if (index >= totalCards) {
                    track.style.transition = 'none';
                    track.style.transform = `translateX(0%)`;
                    currentIndex = 0;
                }
                isTransitioning = false;
            }, 500);
        } else {
            isTransitioning = false;
        }
    };
    
    // 이전 버튼
    prevBtn?.addEventListener('click', () => {
        updateSlider(currentIndex - 1);
    });
    
    // 다음 버튼
    nextBtn?.addEventListener('click', () => {
        updateSlider(currentIndex + 1);
    });
    
    // 도트 클릭
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            updateSlider(index);
        });
    });
    
    // 터치 스와이프 지원
    let touchStartX = 0;
    let touchEndX = 0;
    
    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    const handleSwipe = () => {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // 왼쪽으로 스와이프 (다음)
                updateSlider(currentIndex + 1);
            } else {
                // 오른쪽으로 스와이프 (이전)
                updateSlider(currentIndex - 1);
            }
        }
    };
    
    // 자동 슬라이드 (선택사항)
    let autoSlideInterval;
    const startAutoSlide = () => {
        autoSlideInterval = setInterval(() => {
            updateSlider(currentIndex + 1);
        }, 5000); // 5초마다
    };
    
    const stopAutoSlide = () => {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
        }
    };
    
    // 마우스 호버 시 자동 슬라이드 중지
    const sliderWrapper = document.querySelector('.features-slider-wrapper');
    if (sliderWrapper) {
        sliderWrapper.addEventListener('mouseenter', stopAutoSlide);
        sliderWrapper.addEventListener('mouseleave', startAutoSlide);
    }
    
    // 초기화
    updateSlider(0, false);
    startAutoSlide();
};

// 슬라이드 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', featuresSlider);
} else {
    featuresSlider();
}

// Active nav link highlighting based on scroll position
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.pageYOffset + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Mobile menu toggle
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const navMenu = document.getElementById('nav-menu');

if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
    
    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            navMenu.classList.remove('active');
        }
    });
}

