document.addEventListener('DOMContentLoaded', () => {
    const navMenuBtn = document.getElementById('navMenuBtn');
    const navMenuDropdown = document.getElementById('navMenuDropdown');
    const menuBackdrop = document.getElementById('menuBackdrop');
    const navMenuCloseBtn = document.getElementById('navMenuCloseBtn');

    if (!navMenuBtn || !navMenuDropdown || !menuBackdrop) return;

    function openMenu() {
        navMenuDropdown.classList.add('open');
        navMenuDropdown.setAttribute('aria-hidden', 'false');
        navMenuBtn.setAttribute('aria-expanded', 'true');
        menuBackdrop.classList.add('open');
        menuBackdrop.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        navMenuDropdown.classList.remove('open');
        navMenuDropdown.setAttribute('aria-hidden', 'true');
        navMenuBtn.setAttribute('aria-expanded', 'false');
        menuBackdrop.classList.remove('open');
        menuBackdrop.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function toggleMenu() {
        if (navMenuDropdown.classList.contains('open')) {
            closeMenu();
            return;
        }
        openMenu();
    }

    navMenuBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleMenu();
    });

    menuBackdrop.addEventListener('click', closeMenu);

    if (navMenuCloseBtn) {
        // replace text with a cleaner SVG close icon for better visuals
        try {
            navMenuCloseBtn.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                    <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M6 18L18 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            `;
        } catch (err) {
            // ignore if DOM doesn't allow innerHTML here for some reason
        }

        navMenuCloseBtn.addEventListener('click', (e) => {
            e.preventDefault();
            closeMenu();
        });
    }

    navMenuDropdown.addEventListener('click', (e) => {
        const target = e.target;
        if (!(target instanceof HTMLElement)) return;

        if (target.closest('a')) {
            closeMenu();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMenu();
        }
    });
});
