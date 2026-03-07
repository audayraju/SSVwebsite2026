document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-box input');
    if (!searchInput) return;

    const currentPath = window.location.pathname.toLowerCase();
    const isProductsPage = currentPath.endsWith('/products.html') || currentPath.endsWith('products.html');

    if (isProductsPage) return;

    const searchHints = [
        'Our products',
        'Gold rings',
        'Bridal necklace',
        'Diamond earrings',
        'Temple jewellery'
    ];

    const defaultPlaceholder = 'Search...';
    let hintWordIndex = 0;
    let hintCharIndex = 0;
    let deletingHint = false;
    let stopSearchHint = false;
    let hintTimer = null;

    function stopSearchHintAnimation() {
        stopSearchHint = true;

        if (hintTimer) {
            clearTimeout(hintTimer);
            hintTimer = null;
        }

        if (!searchInput.value.trim()) {
            searchInput.placeholder = defaultPlaceholder;
        }
    }

    function runSearchHintAnimation() {
        if (stopSearchHint || !searchHints.length) return;

        const word = searchHints[hintWordIndex] || defaultPlaceholder;

        if (!deletingHint) {
            hintCharIndex = Math.min(hintCharIndex + 1, word.length);
        } else {
            hintCharIndex = Math.max(hintCharIndex - 1, 0);
        }

        searchInput.placeholder = word.slice(0, hintCharIndex);

        let nextDelay = deletingHint ? 50 : 90;

        if (!deletingHint && hintCharIndex === word.length) {
            deletingHint = true;
            nextDelay = 900;
        } else if (deletingHint && hintCharIndex === 0) {
            deletingHint = false;
            hintWordIndex = (hintWordIndex + 1) % searchHints.length;
            nextDelay = 260;
        }

        hintTimer = window.setTimeout(runSearchHintAnimation, nextDelay);
    }

    runSearchHintAnimation();

    searchInput.addEventListener('focus', () => {
        stopSearchHintAnimation();
    });

    searchInput.addEventListener('keydown', () => {
        stopSearchHintAnimation();
    });

    searchInput.addEventListener('input', () => {
        if (searchInput.value.trim()) {
            stopSearchHintAnimation();
        }
    });

    searchInput.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter') return;

        e.preventDefault();
        const term = searchInput.value.trim();

        if (!term) {
            window.location.href = 'products.html';
            return;
        }

        window.location.href = `products.html?search=${encodeURIComponent(term)}`;
    });
});
