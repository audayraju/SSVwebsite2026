document.addEventListener("DOMContentLoaded", function () {
    document.querySelector(".navbar").classList.add("show-nav");
    const reveals = document.querySelectorAll(
        ".service-card, .services-intro, .faq-item, .guarantee, .content h1, .subtitle"
    );
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("reveal");
            }
        });
    }, { threshold: 0.15 });
    reveals.forEach(el => observer.observe(el));

    // FAQ accordion behavior
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(q => {
        q.setAttribute('role', 'button');
        q.setAttribute('tabindex', '0');
        q.setAttribute('aria-expanded', 'false');

        const toggle = () => {
            const item = q.closest('.faq-item');
            const answer = item.querySelector('.faq-answer');
            const isOpen = item.classList.contains('open');

            if (!isOpen) {
                // close any other open items (single-open accordion behavior)
                document.querySelectorAll('.faq-item.open').forEach(other => {
                    if (other === item) return;
                    other.classList.remove('open');
                    const a = other.querySelector('.faq-answer');
                    const qq = other.querySelector('.faq-question');
                    if (a) a.style.maxHeight = null;
                    if (qq) qq.setAttribute('aria-expanded', 'false');
                });

                // open this one
                item.classList.add('open');
                q.setAttribute('aria-expanded', 'true');
                // ensure padding and opacity classes are applied before measuring
                // (small timeout lets the browser apply the .open styles)
                setTimeout(() => {
                    // add a small buffer so text isn't clipped
                    const needed = answer.scrollHeight + 24;
                    answer.style.maxHeight = needed + 'px';
                    answer.style.paddingTop = '10px';
                    answer.setAttribute('aria-hidden', 'false');
                }, 10);
            } else {
                // collapse
                item.classList.remove('open');
                q.setAttribute('aria-expanded', 'false');
                // remove inline styles to allow CSS collapsed state
                answer.style.maxHeight = null;
                answer.style.paddingTop = null;
                answer.setAttribute('aria-hidden', 'true');
            }
        };

        q.addEventListener('click', toggle);
        q.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggle();
            }
        });
    });

    // Recalculate open answer heights on resize (keeps transitions smooth)
    window.addEventListener('resize', () => {
        document.querySelectorAll('.faq-item.open .faq-answer').forEach(a => {
            a.style.maxHeight = a.scrollHeight + 'px';
        });
    });
});