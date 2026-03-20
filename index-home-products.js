(function initHomeProductCards() {
    const cards = Array.from(document.querySelectorAll('.home-product-card'));
    const modal = document.getElementById('homeProductModal');
    const closeBtn = document.getElementById('homeProductModalClose');
    const modalImage = document.getElementById('homeProductModalImage');
    const modalTitle = document.getElementById('homeProductModalTitle');
    const modalSku = document.getElementById('homeProductModalSku');
    const modalPrice = document.getElementById('homeProductModalPrice');
    const modalDescription = document.getElementById('homeProductModalDescription');
    const modalLink = document.getElementById('homeProductModalLink');

    if (!cards.length || !modal || !closeBtn || !modalImage || !modalTitle || !modalSku || !modalPrice || !modalDescription || !modalLink) {
        return;
    }

    const touchMediaQuery = window.matchMedia('(hover: none), (pointer: coarse)');

    function isTouchMode() {
        return touchMediaQuery.matches;
    }

    function clearActiveCards(exceptCard) {
        cards.forEach((card) => {
            if (card !== exceptCard) {
                card.classList.remove('is-active');
            }
        });
    }

    function buildSearchLink(name) {
        const params = new URLSearchParams({ search: name });
        return `products.html?${params.toString()}`;
    }

    function openModal(card) {
        const image = card.querySelector('img');
        const name = (card.dataset.name || 'Jewellery Product').trim();
        const sku = (card.dataset.sku || 'SSV-ITEM').trim();
        const price = (card.dataset.price || 'Price on Request').trim();
        const description = (card.dataset.description || 'Premium handcrafted jewellery from SSV Jewellers.').trim();

        modalImage.src = image?.getAttribute('src') || 'picture/image.png';
        modalImage.alt = image?.getAttribute('alt') || `${name} image`;
        modalTitle.textContent = name;
        modalSku.textContent = `SKU: ${sku}`;
        modalPrice.textContent = price;
        modalDescription.textContent = description;
        modalLink.href = buildSearchLink(name);

        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        clearActiveCards();
    }

    function closeModal() {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    cards.forEach((card) => {
        const detailsButton = card.querySelector('.home-product-card__details-btn');
        if (!detailsButton) return;

        detailsButton.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            openModal(card);
        });

        card.addEventListener('click', (event) => {
            if (!isTouchMode()) {
                return;
            }

            if (event.target instanceof HTMLElement && event.target.closest('.home-product-card__details-btn')) {
                return;
            }

            const isActive = card.classList.contains('is-active');
            clearActiveCards(card);
            card.classList.toggle('is-active', !isActive);
        });
    });

    closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('click', (event) => {
        if (!isTouchMode()) {
            return;
        }

        const target = event.target;
        if (!(target instanceof HTMLElement)) {
            return;
        }

        if (!target.closest('.home-product-card')) {
            clearActiveCards();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('open')) {
            closeModal();
        }
    });

    if (typeof touchMediaQuery.addEventListener === 'function') {
        touchMediaQuery.addEventListener('change', () => {
            if (!isTouchMode()) {
                clearActiveCards();
            }
        });
    }
})();