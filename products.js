function filterProducts(category, clickedItem) {
    const cards = document.querySelectorAll('.product-card');

    cards.forEach((card) => {
        const cardCategory = (card.getAttribute('data-category') || '').toLowerCase();
        const shouldShow = category === 'all' || cardCategory === category;
        card.style.display = shouldShow ? 'block' : 'none';
    });

    const categoryItems = document.querySelectorAll('.category-item');
    categoryItems.forEach((item) => item.classList.remove('active'));

    if (clickedItem) {
        clickedItem.classList.add('active');
    }
}

function changeImage(thumb) {
    const mainImage = document.getElementById('mainProductImage');
    if (!mainImage || !thumb) return;

    mainImage.src = thumb.src;
}

function formatSku(rawSku, title) {
    if (rawSku && rawSku.trim()) return rawSku.trim();
    const seed = (title || 'SSV-ITEM')
        .toUpperCase()
        .replace(/[^A-Z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 14);
    return `SSV-${seed || 'ITEM'}`;
}

function buildWhatsAppLink(message) {
    const phone = '916281049201';
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

const ADMIN_PRODUCTS_KEY = 'ssv_admin_products';
const FAVOURITES_KEY = 'ssv_favourites';

function getFavouriteItems() {
    try {
        const raw = localStorage.getItem(FAVOURITES_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        try {
            const raw = sessionStorage.getItem(FAVOURITES_KEY);
            const parsed = raw ? JSON.parse(raw) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }
}

function setFavouriteItems(items) {
    try {
        localStorage.setItem(FAVOURITES_KEY, JSON.stringify(items));
    } catch (err) {
        // Fallback to sessionStorage if localStorage is unavailable (e.g., private mode)
        try {
            sessionStorage.setItem(FAVOURITES_KEY, JSON.stringify(items));
        } catch (e) {
            // As a last resort, log to console — storage unavailable
            console.warn('Unable to persist favourites to localStorage/sessionStorage', e || err);
        }
    }
}

function getAdminProducts() {
    try {
        const raw = localStorage.getItem(ADMIN_PRODUCTS_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function appendAdminProductsToGrid() {
    const grid = document.querySelector('.products-grid');
    if (!grid) return;

    const adminProducts = getAdminProducts();
    if (!adminProducts.length) return;

    const existingSkus = new Set(
        Array.from(grid.querySelectorAll('.product-card'))
            .map((card) => (card.dataset.sku || '').trim())
            .filter(Boolean)
    );

    adminProducts.forEach((item) => {
        const sku = (item?.sku || '').trim();
        if (!sku || existingSkus.has(sku)) return;

        const card = document.createElement('div');
        card.className = 'product-card';
        card.dataset.category = (item.category || 'ring').toLowerCase();
        card.dataset.sku = sku;
        card.dataset.desc = item.desc || 'Premium handcrafted jewellery from SSV Jeweller.';
        card.dataset.price = item.price || 'Price on Request';
        card.dataset.type = item.type || 'Gold Necklace Set';
        card.dataset.largeImage = item.image || 'slides/pictures/logo.jpeg';
        card.dataset.specs = item.specs || 'Hallmark Certified|Handcrafted Finish';
        card.dataset.extra = item.extra || 'Added from Admin Panel.';

        const img = document.createElement('img');
        img.className = 'product-image-trigger';
        img.src = item.image || 'slides/pictures/logo.jpeg';
        img.alt = item.title || 'Jewellery Product';
        img.tabIndex = 0;
        img.setAttribute('role', 'button');
        img.setAttribute('aria-label', `Open ${(item.title || 'product')} details`);

        const title = document.createElement('h3');
        title.textContent = item.title || 'Jewellery Product';

        const actions = document.createElement('div');
        actions.className = 'card-actions';

        const knowBtn = document.createElement('button');
        knowBtn.type = 'button';
        knowBtn.className = 'know-btn';
        knowBtn.textContent = 'Know more';

        const favBtn = document.createElement('button');
        favBtn.type = 'button';
        favBtn.className = 'card-fav';
        favBtn.setAttribute('aria-label', `Add ${(item.title || 'Jewellery Product')} to favourites`);
        favBtn.textContent = '♡';

        actions.appendChild(knowBtn);
        actions.appendChild(favBtn);

        card.appendChild(img);
        card.appendChild(title);
        card.appendChild(actions);
        grid.prepend(card);
        existingSkus.add(sku);
    });
}

function extractCardData(card) {
    const imageEl = card.querySelector('img');
    const title = (card.querySelector('h3')?.innerText || 'Jewellery Product').trim();
    const sku = formatSku(card.dataset.sku, title);

    return {
        sku,
        title,
        price: (card.dataset.price || 'Price on Request').trim(),
        image: (card.dataset.largeImage || imageEl?.getAttribute('src') || 'slides/pictures/logo.jpeg').trim()
    };
}

function ensureFavouriteButtons() {
    const cards = document.querySelectorAll('.product-card');
    const favourites = getFavouriteItems();
    const favSkus = new Set(favourites.map((item) => item.sku));

    cards.forEach((card) => {
        let favBtn = card.querySelector('.card-fav');
        const title = (card.querySelector('h3')?.innerText || 'Jewellery Product').trim();

        let actions = card.querySelector('.card-actions');
        if (!actions) {
            actions = document.createElement('div');
            actions.className = 'card-actions';

            const knowBtn = document.createElement('button');
            knowBtn.type = 'button';
            knowBtn.className = 'know-btn';
            knowBtn.textContent = 'Know more';
            actions.appendChild(knowBtn);

            card.appendChild(actions);
        }

        if (!favBtn) {
            favBtn = document.createElement('button');
            favBtn.type = 'button';
            favBtn.className = 'card-fav';
            favBtn.setAttribute('aria-label', `Add ${title} to favourites`);
            favBtn.textContent = '♡';
            actions.appendChild(favBtn);
        }

        const data = extractCardData(card);
        if (favSkus.has(data.sku)) {
            favBtn.classList.add('active');
            favBtn.textContent = '♥';
        }
    });
}

function toggleFavouriteFromCard(card) {
    const product = extractCardData(card);
    const favourites = getFavouriteItems();
    const existingIndex = favourites.findIndex((item) => item.sku === product.sku);
    let added = false;

    if (existingIndex >= 0) {
        favourites.splice(existingIndex, 1);
        added = false;
    } else {
        favourites.unshift(product);
        added = true;
    }

    setFavouriteItems(favourites);
    return added;
}

function openProductFromCard(card) {
    if (!card) return;

    const modal = document.getElementById('productModal');
    if (!modal) return;

    const imgEl = card.querySelector('img');
    const title = (card.querySelector('h3')?.innerText || 'Jewellery Product').trim();
    const sku = formatSku(card.dataset.sku, title);
    const description = (card.dataset.desc || 'Premium handcrafted jewellery from SSV Jeweller.').trim();
    const productType = (card.dataset.type || 'Gold Necklace Set').trim();
    const rawPrice = (card.dataset.price || '').trim();
    const largeImage = (card.dataset.largeImage || imgEl?.getAttribute('src') || '').trim();
    const specsRaw = (card.dataset.specs || 'Hallmark Certified|Handcrafted Finish').trim();
    const extraInfo = (card.dataset.extra || 'For custom options, connect with our team.').trim();

    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalSku = document.getElementById('modalSku');
    const modalPrice = document.getElementById('modalPrice');
    const modalWhatsappBtn = document.getElementById('modalWhatsappBtn');
    const modalDesc = document.getElementById('modalDesc');
    const modalType = document.getElementById('modalType');
    const modalSpecs = document.getElementById('modalSpecs');
    const modalExtra = document.getElementById('modalExtra');
    const descPanel = document.getElementById('descPanel');
    const specPanel = document.getElementById('specPanel');
    const descToggleBtn = document.getElementById('descToggleBtn');
    const specToggleBtn = document.getElementById('specToggleBtn');
    const descArrow = document.getElementById('descArrow');
    const specArrow = document.getElementById('specArrow');

    if (!modalImage || !modalTitle || !modalSku || !modalPrice || !modalDesc || !modalSpecs || !modalExtra || !modalType) {
        return;
    }

    modalImage.src = largeImage;
    modalImage.alt = imgEl?.alt || `${title} image`;
    if (modal.dataset) {
        modal.dataset.currentImage = largeImage;
    }
    modalTitle.textContent = title;
    modalSku.textContent = `SKU: ${sku}`;
    modalDesc.textContent = description;
    modalType.textContent = productType;
    modalExtra.textContent = extraInfo;

    if (descPanel && specPanel && descToggleBtn && specToggleBtn && descArrow && specArrow) {
        descPanel.classList.remove('open');
        specPanel.classList.remove('open');
        descToggleBtn.setAttribute('aria-expanded', 'false');
        specToggleBtn.setAttribute('aria-expanded', 'false');
        descArrow.textContent = '▼';
        specArrow.textContent = '▼';
    }

    const specs = specsRaw.split('|').map((item) => item.trim()).filter(Boolean);
    modalSpecs.innerHTML = specs.map((item) => `<li>${item}</li>`).join('');

    const isRequestPrice = !rawPrice || /request/i.test(rawPrice);
    modalPrice.textContent = isRequestPrice ? 'Price on Request' : rawPrice;

    const enquiryMessage = [
        'Hi SSV Jeweller, I am interested in this product:',
        `Product: ${title}`,
        `SKU: ${sku}`,
        `Price: ${rawPrice || 'Price on Request'}`,
        'Please share more details.'
    ].join('\n');

    if (modal.dataset) {
        modal.dataset.whatsappMessage = enquiryMessage;
    }

    if (modalWhatsappBtn) {
        modalWhatsappBtn.href = buildWhatsAppLink(enquiryMessage);
    }

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeProduct() {
    const modal = document.getElementById('productModal');
    if (!modal) return;

    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

function openImageViewer() {
    const modal = document.getElementById('productModal');
    const imageViewer = document.getElementById('imageViewer');
    const viewerImage = document.getElementById('viewerImage');

    if (!modal || !imageViewer || !viewerImage) return;

    const largeImage = modal.dataset.currentImage || document.getElementById('modalImage')?.getAttribute('src') || '';
    const altText = document.getElementById('modalImage')?.getAttribute('alt') || 'Enlarged product image';

    if (!largeImage) return;

    viewerImage.src = largeImage;
    viewerImage.alt = altText;
    viewerImage.classList.remove('zoomed');
    viewerImage.style.transformOrigin = 'center center';
    imageViewer.classList.add('open');
    imageViewer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeImageViewer() {
    const imageViewer = document.getElementById('imageViewer');
    const viewerImage = document.getElementById('viewerImage');
    if (!imageViewer) return;

    imageViewer.classList.remove('open');
    imageViewer.setAttribute('aria-hidden', 'true');

    if (viewerImage) {
        viewerImage.classList.remove('zoomed');
        viewerImage.style.transformOrigin = 'center center';
    }

    const modal = document.getElementById('productModal');
    if (!modal || !modal.classList.contains('open')) {
        document.body.style.overflow = '';
    }
}

(function initProductsPage() {
    appendAdminProductsToGrid();
    ensureFavouriteButtons();

    const modal = document.getElementById('productModal');
    const imageViewer = document.getElementById('imageViewer');
    const viewerImage = document.getElementById('viewerImage');
    const modalImage = document.getElementById('modalImage');
    const modalWhatsappBtn = document.getElementById('modalWhatsappBtn');
    const closeImageViewerBtn = document.getElementById('closeImageViewerBtn');
    const closeBtn = document.getElementById('closeProductBtn');
    const descToggleBtn = document.getElementById('descToggleBtn');
    const specToggleBtn = document.getElementById('specToggleBtn');
    const descPanel = document.getElementById('descPanel');
    const specPanel = document.getElementById('specPanel');
    const descArrow = document.getElementById('descArrow');
    const specArrow = document.getElementById('specArrow');
    const triggerCards = document.querySelectorAll('.product-card');
    const navCartBtn = document.getElementById('navCartBtn');
    const favCountBadge = document.getElementById('favCountBadge');
    const navFavPanel = document.getElementById('navFavPanel');
    const navFavList = document.getElementById('navFavList');
    const navFavEmpty = document.getElementById('navFavEmpty');
    const navMenuBtn = document.getElementById('navMenuBtn');
    const navMenuDropdown = document.getElementById('navMenuDropdown');
    const menuBackdrop = document.getElementById('menuBackdrop');
    const searchInput = document.querySelector('.search-box input');
    const searchEmptyState = document.getElementById('searchEmptyState');
    const searchEmptyText = document.getElementById('searchEmptyText');
    const navFavCloseBtn = document.getElementById('navFavCloseBtn');

    function renderNavFavouritesPanel() {
        if (!navFavList || !navFavEmpty) return;

        const favourites = getFavouriteItems();

        if (!favourites.length) {
            navFavList.innerHTML = '';
            navFavEmpty.hidden = false;
            return;
        }

        navFavEmpty.hidden = true;
        navFavList.innerHTML = '';

        favourites.forEach((item) => {
            const title = String(item?.title || 'Jewellery Product');
            const price = String(item?.price || 'Price on Request');
            const sku = String(item?.sku || '');
            const image = String(item?.image || 'slides/pictures/logo.jpeg');

            const li = document.createElement('li');

            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'nav-fav-item';
            btn.dataset.sku = sku;
            btn.setAttribute('aria-label', `Open ${title} details`);

            const thumb = document.createElement('img');
            thumb.className = 'nav-fav-thumb';
            thumb.src = image;
            thumb.alt = title;
            thumb.loading = 'lazy';

            const details = document.createElement('div');
            details.className = 'nav-fav-item-details';

            const titleEl = document.createElement('span');
            titleEl.className = 'nav-fav-item-title';
            titleEl.textContent = title;

            const priceEl = document.createElement('span');
            priceEl.className = 'nav-fav-item-price';
            priceEl.textContent = price;

            details.appendChild(titleEl);
            details.appendChild(priceEl);

            btn.appendChild(thumb);
            btn.appendChild(details);
            li.appendChild(btn);
            navFavList.appendChild(li);
        });
    }

    function openNavFavouritesPanel() {
        if (!navFavPanel) return;
        navFavPanel.classList.add('open');
        navFavPanel.setAttribute('aria-hidden', 'false');
    }

    function closeNavFavouritesPanel() {
        if (!navFavPanel) return;
        navFavPanel.classList.remove('open');
        navFavPanel.setAttribute('aria-hidden', 'true');
    }

    function toggleNavFavouritesPanel() {
        if (!navFavPanel) return;
        if (navFavPanel.classList.contains('open')) {
            closeNavFavouritesPanel();
            return;
        }
        closeNavMenu();
        openNavFavouritesPanel();
    }

    function openProductBySku(sku) {
        if (!sku) return;
        const cards = Array.from(document.querySelectorAll('.product-card'));
        const match = cards.find((card) => (card.dataset.sku || '').trim() === sku);
        if (!match) return;
        openProductFromCard(match);
    }

    function applySearchFilter(rawTerm) {
        const term = (rawTerm || '').trim().toLowerCase();
        const cards = document.querySelectorAll('.product-card');
        let visibleCount = 0;

        cards.forEach((card) => {
            const title = (card.querySelector('h3')?.innerText || '').toLowerCase();
            const category = (card.dataset.category || '').toLowerCase();
            const desc = (card.dataset.desc || '').toLowerCase();
            const isMatch = !term || title.includes(term) || category.includes(term) || desc.includes(term);
            card.style.display = isMatch ? 'block' : 'none';

            if (isMatch) {
                visibleCount += 1;
            }
        });

        const hasSearchTerm = Boolean(term);
        const hasResults = visibleCount > 0;

        if (searchEmptyState) {
            searchEmptyState.hidden = !hasSearchTerm || hasResults;
        }

        if (searchEmptyText && hasSearchTerm && !hasResults) {
            searchEmptyText.textContent = `Oops, we could not find jewellery for “${rawTerm.trim()}”. Please try another search word.`;
        }
    }

    function updateFavButtonsUI() {
        const favourites = getFavouriteItems();
        const favSkus = new Set(favourites.map((item) => item.sku));

        document.querySelectorAll('.product-card').forEach((card) => {
            const favBtn = card.querySelector('.card-fav');
            if (!favBtn) return;

            const data = extractCardData(card);
            const isFav = favSkus.has(data.sku);
            favBtn.classList.toggle('active', isFav);
            favBtn.textContent = isFav ? '♥' : '♡';
        });

        if (favCountBadge) {
            const count = favourites.length;
            if (count > 0) {
                favCountBadge.textContent = String(count);
                favCountBadge.hidden = false;
                favCountBadge.style.display = 'inline-flex';
            } else {
                favCountBadge.textContent = '';
                favCountBadge.hidden = true;
                favCountBadge.style.display = 'none';
            }
        }

        if (navCartBtn) {
            navCartBtn.classList.toggle('active', favourites.length > 0);
        }

        renderNavFavouritesPanel();
    }

    function openNavMenu() {
        if (!navMenuBtn || !navMenuDropdown) return;
        closeNavFavouritesPanel();
        navMenuDropdown.classList.add('open');
        navMenuDropdown.setAttribute('aria-hidden', 'false');
        navMenuBtn.setAttribute('aria-expanded', 'true');
        if (menuBackdrop) {
            menuBackdrop.classList.add('open');
            menuBackdrop.setAttribute('aria-hidden', 'false');
        }
        document.body.style.overflow = 'hidden';
    }

    function closeNavMenu() {
        if (!navMenuBtn || !navMenuDropdown) return;
        navMenuDropdown.classList.remove('open');
        navMenuDropdown.setAttribute('aria-hidden', 'true');
        navMenuBtn.setAttribute('aria-expanded', 'false');

        if (menuBackdrop) {
            menuBackdrop.classList.remove('open');
            menuBackdrop.setAttribute('aria-hidden', 'true');
        }

        const isProductModalOpen = modal?.classList.contains('open');
        const isImageViewerOpen = imageViewer?.classList.contains('open');
        if (!isProductModalOpen && !isImageViewerOpen) {
            document.body.style.overflow = '';
        }
    }

    function toggleNavMenu() {
        if (!navMenuDropdown?.classList.contains('open')) {
            openNavMenu();
            return;
        }
        closeNavMenu();
    }

    function toggleDetailSection(button, panel, arrow) {
        if (!button || !panel || !arrow) return;

        const isOpen = panel.classList.toggle('open');
        button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        arrow.textContent = isOpen ? '▲' : '▼';
    }

    triggerCards.forEach((card) => {
        const title = (card.querySelector('h3')?.innerText || 'product').trim();
        card.tabIndex = 0;
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `Open ${title} details`);

        card.addEventListener('click', () => openProductFromCard(card));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openProductFromCard(card);
            }
        });

        const favBtn = card.querySelector('.card-fav');
        if (favBtn) {
            favBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const added = toggleFavouriteFromCard(card);
                updateFavButtonsUI();
                if (added) {
                    openNavFavouritesPanel();
                    showFavToast('Added to liked collections');
                } else {
                    showFavToast('Removed from liked collections');
                }
            });
        }
    });

    // Delegate clicks on any .card-fav to support dynamically added cards
    document.addEventListener('click', (e) => {
        const favEl = e.target instanceof HTMLElement ? e.target.closest('.card-fav') : null;
        if (!favEl) return;
        e.preventDefault();
        e.stopPropagation();
        const card = favEl.closest('.product-card');
        if (!card) return;
        const added = toggleFavouriteFromCard(card);
        updateFavButtonsUI();
        if (added) {
            openNavFavouritesPanel();
            showFavToast('Added to liked collections');
        } else {
            showFavToast('Removed from liked collections');
        }
    });

    // Small toast feedback for user when adding/removing favourites
    function showFavToast(text) {
        try {
            const toast = document.createElement('div');
            toast.className = 'fav-toast';
            toast.textContent = text;
            Object.assign(toast.style, {
                position: 'fixed',
                right: '20px',
                bottom: '90px',
                background: 'rgba(0,0,0,0.8)',
                color: '#fff',
                padding: '10px 14px',
                borderRadius: '8px',
                zIndex: 99999,
                opacity: '0',
                transition: 'opacity 220ms ease, transform 220ms ease',
                transform: 'translateY(8px)'
            });
            document.body.appendChild(toast);
            // force repaint
            void toast.offsetWidth;
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
            window.setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateY(8px)';
                window.setTimeout(() => toast.remove(), 300);
            }, 1400);
        } catch (err) {
            // ignore
        }
    }

    if (navMenuBtn) {
        navMenuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleNavMenu();
        });
    }

    if (navCartBtn) {
        navCartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleNavFavouritesPanel();
        });
    }

    if (navFavList) {
        navFavList.addEventListener('click', (e) => {
            const target = e.target;
            if (!(target instanceof HTMLElement)) return;

            const btn = target.closest('.nav-fav-item');
            if (!(btn instanceof HTMLButtonElement)) return;

            const sku = btn.dataset.sku || '';
            openProductBySku(sku);
            closeNavFavouritesPanel();
        });
    }

    if (navFavCloseBtn) {
        navFavCloseBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeNavFavouritesPanel();
        });
    }


    if (navMenuDropdown) {
        navMenuDropdown.addEventListener('click', (e) => {
            const target = e.target;
            if (!(target instanceof HTMLElement)) return;
            if (target.closest('a')) {
                closeNavMenu();
            }
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeProduct);
    }

    if (descToggleBtn && descPanel && descArrow) {
        descToggleBtn.addEventListener('click', () => toggleDetailSection(descToggleBtn, descPanel, descArrow));
    }

    if (specToggleBtn && specPanel && specArrow) {
        specToggleBtn.addEventListener('click', () => toggleDetailSection(specToggleBtn, specPanel, specArrow));
    }

    if (modalImage) {
        modalImage.addEventListener('click', openImageViewer);
    }

    if (closeImageViewerBtn) {
        closeImageViewerBtn.addEventListener('click', closeImageViewer);
    }

    if (viewerImage) {
        const toggleZoom = () => {
            viewerImage.classList.toggle('zoomed');
            if (!viewerImage.classList.contains('zoomed')) {
                viewerImage.style.transformOrigin = 'center center';
            }
        };

        viewerImage.addEventListener('click', (e) => {
            e.preventDefault();
            toggleZoom();
        });

        viewerImage.addEventListener('mousemove', (e) => {
            if (!viewerImage.classList.contains('zoomed')) return;

            const rect = viewerImage.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            viewerImage.style.transformOrigin = `${x}% ${y}%`;
        });
    }

    if (modalWhatsappBtn) {
        modalWhatsappBtn.addEventListener('click', (e) => {
            const message = modal?.dataset.whatsappMessage || 'Hi SSV Jeweller, I am interested in this product.';
            modalWhatsappBtn.href = buildWhatsAppLink(message);
            if (!modalWhatsappBtn.href) {
                e.preventDefault();
            }
        });
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeProduct();
            }
        });
    }

    if (imageViewer) {
        imageViewer.addEventListener('click', (e) => {
            if (e.target === imageViewer) {
                closeImageViewer();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;

        if (navMenuDropdown?.classList.contains('open')) {
            closeNavMenu();
        }

        if (navFavPanel?.classList.contains('open')) {
            closeNavFavouritesPanel();
        }

        if (imageViewer?.classList.contains('open')) {
            closeImageViewer();
            return;
        }

        if (modal?.classList.contains('open')) {
            closeProduct();
        }
    });

    document.addEventListener('click', (e) => {
        const target = e.target;
        if (!(target instanceof HTMLElement)) return;

        // Close nav menu when clicking outside the menu wrap
        if (!target.closest('.menu-wrap')) {
            closeNavMenu();
        }

        // Close favourites panel when it's open and the click is outside
        // both the panel itself and the toggle button
        if (navFavPanel?.classList.contains('open')) {
            const clickedInsidePanel = Boolean(target.closest('.nav-fav-panel'));
            const clickedToggle = Boolean(target.closest('#navCartBtn')) || Boolean(target.closest('.nav-tools'));
            if (!clickedInsidePanel && !clickedToggle) {
                closeNavFavouritesPanel();
            }
        }
    });

    if (menuBackdrop) {
        menuBackdrop.addEventListener('click', closeNavMenu);
    }

    if (searchInput) {
        const searchHints = [
            'Our collections',
            'Gold rings',
            'Bridal necklace',
            'Diamond earrings',
            'Temple jewellery'

        ];

        let hintWordIndex = 0;
        let hintCharIndex = 0;
        let deletingHint = false;
        let stopSearchHint = false;
        let hintTimer = null;

        const defaultPlaceholder = 'Search...';

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

        const params = new URLSearchParams(window.location.search);
        const initialSearch = (params.get('search') || params.get('q') || '').trim();

        if (initialSearch) {
            searchInput.value = initialSearch;
            applySearchFilter(initialSearch);
            stopSearchHintAnimation();
        } else {
            runSearchHintAnimation();
        }

        searchInput.addEventListener('focus', () => {
            stopSearchHintAnimation();
        });

        searchInput.addEventListener('keydown', () => {
            stopSearchHintAnimation();
        });

        searchInput.addEventListener('input', function (e) {
            if (e.target.value.trim()) {
                stopSearchHintAnimation();
            }
            applySearchFilter(e.target.value);
        });
    }

    updateFavButtonsUI();

})();

window.closeProduct = closeProduct;
