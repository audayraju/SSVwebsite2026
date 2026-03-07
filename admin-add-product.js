const ADMIN_PRODUCTS_KEY = 'ssv_admin_products';
const FALLBACK_IMAGE = 'slides/pictures/logo.jpeg';
const DEFAULT_PRODUCT_TYPE = 'Gold Necklace Set';
const DEFAULT_PRODUCT_SPECS = 'Hallmark Certified|Handcrafted Finish';
const DEFAULT_ADDITIONAL_INFO = 'Additional Information';

function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
        if (!file) {
            resolve('');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ''));
        reader.onerror = () => reject(new Error('Failed to read image file.'));
        reader.readAsDataURL(file);
    });
}

function loadImageFromDataUrl(dataUrl) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error('Invalid image format.'));
        image.src = dataUrl;
    });
}

async function compressImageForStorage(file) {
    if (!file) return '';

    const sourceDataUrl = await readFileAsDataUrl(file);
    if (!sourceDataUrl) return '';

    const sourceImage = await loadImageFromDataUrl(sourceDataUrl);
    const maxDimension = 1100;
    const scale = Math.min(1, maxDimension / Math.max(sourceImage.width, sourceImage.height));
    const targetWidth = Math.max(1, Math.round(sourceImage.width * scale));
    const targetHeight = Math.max(1, Math.round(sourceImage.height * scale));

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const context = canvas.getContext('2d');
    if (!context) return sourceDataUrl;

    context.drawImage(sourceImage, 0, 0, targetWidth, targetHeight);
    return canvas.toDataURL('image/jpeg', 0.78);
}

function getStoredAdminProducts() {
    try {
        const raw = localStorage.getItem(ADMIN_PRODUCTS_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function setStoredAdminProducts(items) {
    localStorage.setItem(ADMIN_PRODUCTS_KEY, JSON.stringify(items));
}

function formatPrice(value) {
    const amount = Number(value);
    if (!Number.isFinite(amount) || amount < 0) return 'Price on Request';

    return `₹ ${amount.toLocaleString('en-IN', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    })}`;
}

function createSku(name) {
    const cleanName = (name || 'ITEM')
        .toUpperCase()
        .replace(/[^A-Z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 8);

    const stamp = Date.now().toString().slice(-6);
    return `ADM-${cleanName || 'ITEM'}-${stamp}`;
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('adminAddProductForm');
    const fileInput = document.getElementById('productImage');
    const uploadPreview = document.getElementById('uploadPreview');
    const uploadText = document.getElementById('uploadText');
    const uploadNote = document.getElementById('uploadNote');
    const uploadPath = document.getElementById('uploadPath');
    const formStatus = document.getElementById('formStatus');
    const savedProductsCount = document.getElementById('savedProductsCount');
    const savedProductsList = document.getElementById('savedProductsList');
    const submitButton = document.getElementById('saveProductBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    let editingSku = '';
    let currentPreviewBlobUrl = '';

    if (!form) return;

    function setStatus(message, type = '') {
        if (!formStatus) return;
        formStatus.textContent = message;
        formStatus.classList.remove('success', 'error');
        if (type) {
            formStatus.classList.add(type);
        }
    }

    function updateSavedCount() {
        if (!savedProductsCount) return;
        const total = getStoredAdminProducts().length;
        savedProductsCount.textContent = String(total);
    }

    function normalizePriceForInput(priceText) {
        const cleaned = String(priceText || '').replace(/[^\d.]/g, '');
        return cleaned || '';
    }

    function normalizeSpecsForTextarea(specsText) {
        return String(specsText || '').split('|').join('\n').trim();
    }

    function normalizeSpecsForStorage(specsText) {
        return String(specsText || '')
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean)
            .join('|');
    }

    function setEditMode(isEditing) {
        if (!submitButton) return;

        if (isEditing) {
            submitButton.textContent = 'Update Product';
            if (cancelEditBtn) {
                cancelEditBtn.hidden = false;
            }
        } else {
            submitButton.textContent = 'Save / Add Product';
            if (cancelEditBtn) {
                cancelEditBtn.hidden = true;
            }
        }
    }

    function resetFormVisualState() {
        form.reset();
        if (currentPreviewBlobUrl) {
            URL.revokeObjectURL(currentPreviewBlobUrl);
            currentPreviewBlobUrl = '';
        }
        if (uploadPreview) {
            uploadPreview.hidden = true;
            uploadPreview.removeAttribute('src');
        }
        if (uploadText) {
            uploadText.textContent = 'Click to upload product image';
        }
        if (uploadNote) {
            uploadNote.textContent = 'PNG, JPG, WEBP';
        }
        if (uploadPath) {
            uploadPath.hidden = true;
            uploadPath.textContent = '';
            uploadPath.removeAttribute('title');
        }
    }

    function shortAddress(text, limit = 88) {
        const value = String(text || '').trim();
        if (!value) return '';
        return value.length > limit ? `${value.slice(0, limit)}…` : value;
    }

    function setUploadAddress(rawAddress, label = 'Image address') {
        if (!uploadPath) return;

        const value = String(rawAddress || '').trim();
        if (!value) {
            uploadPath.hidden = true;
            uploadPath.textContent = '';
            uploadPath.removeAttribute('title');
            return;
        }

        uploadPath.hidden = false;
        uploadPath.title = value;
        uploadPath.textContent = `${label}: ${shortAddress(value)}`;
    }

    function exitEditMode() {
        editingSku = '';
        setEditMode(false);
        resetFormVisualState();
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function renderSavedProducts() {
        if (!savedProductsList) return;

        const items = getStoredAdminProducts();
        if (!items.length) {
            savedProductsList.innerHTML = '<p class="empty-state">No saved products yet.</p>';
            return;
        }

        savedProductsList.innerHTML = items.map((item, index) => {
            const title = escapeHtml(item?.title || 'Untitled Product');
            const sku = escapeHtml(item?.sku || 'NA');
            const category = escapeHtml(item?.category || 'uncategorized');
            const imageAddressFull = String(item?.image || FALLBACK_IMAGE);
            const imageAddressSafe = escapeHtml(imageAddressFull);
            const imageAddressShort = escapeHtml(shortAddress(imageAddressFull));

            return `
                <article class="saved-item">
                    <div class="saved-item-meta">
                        <p class="saved-item-title">${title}</p>
                        <p class="saved-item-sub">SKU: ${sku} • Category: ${category}</p>
                        <p class="saved-item-src" title="${imageAddressSafe}">Image: ${imageAddressShort}</p>
                    </div>
                    <div class="saved-item-actions">
                        <button type="button" class="edit-btn" data-index="${index}">Edit</button>
                        <button type="button" class="delete-btn" data-index="${index}">Delete</button>
                    </div>
                </article>
            `;
        }).join('');
    }

    function startEditProductByIndex(index) {
        const items = getStoredAdminProducts();
        if (index < 0 || index >= items.length) return;

        const item = items[index];
        editingSku = item.sku || '';

        const productNameInput = document.getElementById('productName');
        const productCategoryInput = document.getElementById('productCategory');
        const productPriceInput = document.getElementById('productPrice');
        const productDescriptionInput = document.getElementById('productDescription');
        const productAdditionalInfoInput = document.getElementById('productAdditionalInfo');
        const productTypeInput = document.getElementById('productType');
        const productSpecsInput = document.getElementById('productSpecs');

        if (productNameInput) productNameInput.value = item.title || '';
        if (productCategoryInput) productCategoryInput.value = item.category || '';
        if (productPriceInput) productPriceInput.value = normalizePriceForInput(item.price);
        if (productDescriptionInput) productDescriptionInput.value = item.desc || '';
        if (productAdditionalInfoInput) productAdditionalInfoInput.value = item.extra || DEFAULT_ADDITIONAL_INFO;
        if (productTypeInput) productTypeInput.value = item.type || DEFAULT_PRODUCT_TYPE;
        if (productSpecsInput) productSpecsInput.value = normalizeSpecsForTextarea(item.specs || DEFAULT_PRODUCT_SPECS);

        if (uploadPreview && item.image) {
            uploadPreview.src = item.image;
            uploadPreview.hidden = false;
        }
        if (uploadText) {
            uploadText.textContent = 'Current image loaded. Select a new file to replace.';
        }
        if (uploadNote) {
            uploadNote.textContent = 'Editing existing product';
        }
        setUploadAddress(item.image || FALLBACK_IMAGE, 'Current image source');

        setEditMode(true);
        setStatus('Editing product. Update fields and click "Update Product".', 'success');
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function deleteSavedProductByIndex(index) {
        const items = getStoredAdminProducts();
        if (index < 0 || index >= items.length) return;

        items.splice(index, 1);
        setStoredAdminProducts(items);
        updateSavedCount();
        renderSavedProducts();
        setStatus('Product deleted from admin list.', 'success');
    }

    updateSavedCount();
    renderSavedProducts();

    if (savedProductsList) {
        savedProductsList.addEventListener('click', (event) => {
            const target = event.target;
            if (!(target instanceof HTMLElement)) return;

            const editButton = target.closest('.edit-btn');
            if (editButton) {
                const index = Number(editButton.getAttribute('data-index'));
                if (Number.isInteger(index)) {
                    startEditProductByIndex(index);
                }
                return;
            }

            const button = target.closest('.delete-btn');
            if (!button) return;

            const index = Number(button.getAttribute('data-index'));
            if (!Number.isInteger(index)) return;

            const confirmed = window.confirm('Delete this product from admin list?');
            if (!confirmed) return;

            deleteSavedProductByIndex(index);
        });
    }

    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', () => {
            exitEditMode();
            setStatus('Edit cancelled. Back to add mode.', 'success');
        });
    }

    if (fileInput) {
        fileInput.addEventListener('change', () => {
            const selectedFile = fileInput.files?.[0];

            if (!selectedFile) {
                if (currentPreviewBlobUrl) {
                    URL.revokeObjectURL(currentPreviewBlobUrl);
                    currentPreviewBlobUrl = '';
                }
                if (uploadPreview) {
                    uploadPreview.hidden = true;
                    uploadPreview.removeAttribute('src');
                }
                if (uploadText) {
                    uploadText.textContent = 'Click to upload product image';
                }
                if (uploadNote) {
                    uploadNote.textContent = 'PNG, JPG, WEBP';
                }
                setUploadAddress('', '');
                return;
            }

            if (uploadText) {
                uploadText.textContent = selectedFile.name;
            }
            if (uploadNote) {
                uploadNote.textContent = `${Math.round(selectedFile.size / 1024)} KB selected`;
            }

            if (uploadPreview) {
                if (currentPreviewBlobUrl) {
                    URL.revokeObjectURL(currentPreviewBlobUrl);
                }
                currentPreviewBlobUrl = URL.createObjectURL(selectedFile);
                uploadPreview.src = currentPreviewBlobUrl;
                uploadPreview.hidden = false;
            }

            setUploadAddress(currentPreviewBlobUrl || selectedFile.name, 'Selected image address');
        });
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        setStatus('');
        const wasEditing = Boolean(editingSku);

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Saving...';
        }

        const productName = document.getElementById('productName')?.value.trim() || '';
        const productCategory = document.getElementById('productCategory')?.value || '';
        const productPrice = document.getElementById('productPrice')?.value || '';
        const productDescription = document.getElementById('productDescription')?.value.trim() || '';
        const productAdditionalInfo = document.getElementById('productAdditionalInfo')?.value.trim() || '';
        const productType = document.getElementById('productType')?.value.trim() || '';
        const productSpecsInput = document.getElementById('productSpecs')?.value || '';
        const productSpecs = normalizeSpecsForStorage(productSpecsInput);
        const productImageFile = document.getElementById('productImage')?.files?.[0];

        if (!productName || !productCategory) {
            setStatus('Please fill in required product details.', 'error');
            if (submitButton) {
                submitButton.disabled = false;
                setEditMode(wasEditing);
            }
            return;
        }

        let imageData = FALLBACK_IMAGE;
        let usedFallbackForImage = false;

        if (productImageFile) {
            try {
                const uploadedImage = await compressImageForStorage(productImageFile);
                if (uploadedImage) {
                    imageData = uploadedImage;
                } else {
                    usedFallbackForImage = true;
                    imageData = FALLBACK_IMAGE;
                }
            } catch {
                usedFallbackForImage = true;
                imageData = FALLBACK_IMAGE;
            }
        }

        const item = {
            sku: editingSku || createSku(productName),
            title: productName,
            category: productCategory,
            price: formatPrice(productPrice),
            desc: productDescription || 'Premium handcrafted jewellery from SSV Jeweller.',
            image: imageData,
            type: productType || DEFAULT_PRODUCT_TYPE,
            specs: productSpecs || DEFAULT_PRODUCT_SPECS,
            extra: productAdditionalInfo || DEFAULT_ADDITIONAL_INFO
        };

        let didSave = false;

        try {
            const existingItems = getStoredAdminProducts();
            if (editingSku) {
                const existingIndex = existingItems.findIndex((p) => p.sku === editingSku);
                if (existingIndex !== -1) {
                    const previousImage = existingItems[existingIndex].image || FALLBACK_IMAGE;
                    existingItems[existingIndex] = {
                        ...existingItems[existingIndex],
                        ...item,
                        image: productImageFile ? item.image : previousImage
                    };
                }
            } else {
                existingItems.unshift(item);
            }
            setStoredAdminProducts(existingItems);
            didSave = true;
        } catch {
            try {
                const existingItems = getStoredAdminProducts();
                existingItems.unshift({ ...item, image: FALLBACK_IMAGE });
                setStoredAdminProducts(existingItems);
                didSave = true;
                usedFallbackForImage = true;
            } catch {
                didSave = false;
            }
        }

        if (!didSave) {
            setStatus('Could not save product. Storage is full or blocked in this browser.', 'error');
            if (submitButton) {
                submitButton.disabled = false;
                setEditMode(wasEditing);
            }
            return;
        }

        exitEditMode();

        if (wasEditing) {
            setStatus('Product updated successfully.', 'success');
        } else if (usedFallbackForImage) {
            setStatus('Product saved. Image could not be used, so default image was applied.', 'success');
        } else {
            setStatus('Product saved successfully. You are still on the admin page.', 'success');
        }

        updateSavedCount();
        renderSavedProducts();

        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = 'Save / Add Product';
        }
    });
});