
(() => {
    const sections = Array.from(document.querySelectorAll('.section'));
    const viewThreeImages = Array.from(document.querySelectorAll('.view-three__avatar'));

    if (!sections.length && !viewThreeImages.length) return;

    let lastY = window.scrollY;
    let idleTimer;

    const isInView = (el) => {
        const rect = el.getBoundingClientRect();
        return rect.top < window.innerHeight * 0.88 && rect.bottom > window.innerHeight * 0.12;
    };

    const clearSlideState = () => {
        sections.forEach((section) => {
            section.classList.remove('scroll-down', 'scroll-up');
        });
    };

    const applyDirection = (direction) => {
        sections.forEach((section) => {
            if (!isInView(section)) {
                section.classList.remove('scroll-down', 'scroll-up');
                return;
            }

            section.classList.toggle('scroll-down', direction === 'down');
            section.classList.toggle('scroll-up', direction === 'up');
        });
    };

    if (sections.length) {
        window.addEventListener(
            'scroll',
            () => {
                const currentY = window.scrollY;
                const direction = currentY > lastY ? 'down' : currentY < lastY ? 'up' : null;
                lastY = currentY;

                if (!direction) return;

                applyDirection(direction);

                clearTimeout(idleTimer);
                idleTimer = window.setTimeout(clearSlideState, 420);
            },
            { passive: true }
        );
    }

    if (viewThreeImages.length) {
        const observer = new IntersectionObserver(
            (entries, obs) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    entry.target.classList.add('is-auto-zoom');
                    obs.unobserve(entry.target);
                });
            },
            { threshold: 0.28 }
        );

        viewThreeImages.forEach((image) => observer.observe(image));
    }
})();
