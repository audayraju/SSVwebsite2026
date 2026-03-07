(function initTripleCarousel() {
    const track = document.getElementById('tripleCarouselTrack');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const dotsWrap = document.getElementById('carouselDots');

    if (!track || !prevBtn || !nextBtn || !dotsWrap) {
        return;
    }

    const slides = Array.from(track.querySelectorAll('.triple-carousel__slide'));
    const dots = Array.from(dotsWrap.querySelectorAll('.dot'));

    if (!slides.length) {
        return;
    }

    let currentIndex = 0;
    let autoplayTimer;
    let userStoppedAutoplay = false;
    let autoDirection = 1;

    function render(index) {
        currentIndex = (index + slides.length) % slides.length;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;

        slides.forEach((slide, slideIndex) => {
            const active = slideIndex === currentIndex;
            slide.classList.toggle('is-active', active);
            slide.setAttribute('aria-hidden', active ? 'false' : 'true');
        });

        dots.forEach((dot, dotIndex) => {
            dot.classList.toggle('is-active', dotIndex === currentIndex);
        });
    }

    function startAutoplay() {
        if (userStoppedAutoplay) {
            return;
        }

        stopAutoplay();
        autoplayTimer = window.setInterval(() => {
            if (slides.length <= 1) {
                return;
            }

            if (currentIndex === slides.length - 1) {
                autoDirection = -1;
            } else if (currentIndex === 0) {
                autoDirection = 1;
            }

            render(currentIndex + autoDirection);
        }, 3000);
    }

    function stopAutoplay() {
        if (autoplayTimer) {
            window.clearInterval(autoplayTimer);
            autoplayTimer = undefined;
        }
    }

    function stopByUserAction() {
        userStoppedAutoplay = true;
        stopAutoplay();
    }

    prevBtn.addEventListener('click', () => {
        stopByUserAction();
        autoDirection = -1;
        render(currentIndex - 1);
    });

    nextBtn.addEventListener('click', () => {
        stopByUserAction();
        autoDirection = 1;
        render(currentIndex + 1);
    });

    dotsWrap.addEventListener('click', (event) => {
        const target = event.target;

        if (!(target instanceof HTMLButtonElement)) {
            return;
        }

        const nextIndex = Number(target.dataset.index);

        if (Number.isNaN(nextIndex)) {
            return;
        }

        stopByUserAction();
        autoDirection = nextIndex > currentIndex ? 1 : -1;
        render(nextIndex);
    });

    track.addEventListener('click', (event) => {
        const target = event.target;

        if (target instanceof HTMLElement && target.closest('.triple-carousel__btn')) {
            stopByUserAction();
        }
    });

    track.addEventListener('mouseenter', stopAutoplay);
    track.addEventListener('mouseleave', () => {
        if (!userStoppedAutoplay) {
            startAutoplay();
        }
    });

    render(0);
    startAutoplay();
})();
