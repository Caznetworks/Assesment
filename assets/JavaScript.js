const navToggle = document.getElementById('navToggle');
const sideNav = document.getElementById('sideNav');

if (navToggle && sideNav) {
    const updateToggleState = () => {
        const isCollapsed = sideNav.classList.contains('collapsed');

        navToggle.classList.toggle('active', !isCollapsed);
        navToggle.setAttribute('aria-expanded', String(!isCollapsed));
    };

    navToggle.addEventListener('click', () => {
        sideNav.classList.toggle('collapsed');
        updateToggleState();
    });

    updateToggleState();
}

const heroTitle = document.querySelector('.hero h1');

if (heroTitle) {
    window.requestAnimationFrame(() => {
        heroTitle.classList.add('is-visible');
    });
}

const callButton = document.querySelector('.cta-button');

if (callButton) {
    const setCallButtonState = (isActive) => {
        callButton.classList.toggle('is-hovered', isActive);
    };

    callButton.addEventListener('mouseenter', () => setCallButtonState(true));
    callButton.addEventListener('mouseleave', () => setCallButtonState(false));
    callButton.addEventListener('focus', () => setCallButtonState(true));
    callButton.addEventListener('blur', () => setCallButtonState(false));
}

const carousel = document.querySelector('.Carousel-pic');

if (carousel) {
    const slides = [...carousel.querySelectorAll('.carousel-slide')];
    const dots = [...carousel.querySelectorAll('.carousel-dot')];
    const previousButton = carousel.querySelector('.carousel-prev');
    const nextButton = carousel.querySelector('.carousel-next');
    let currentSlide = 0;
    let autoplay;

    const showSlide = (slideIndex) => {
        currentSlide = (slideIndex + slides.length) % slides.length;

        slides.forEach((slide, index) => {
            slide.classList.toggle('is-active', index === currentSlide);
        });

        dots.forEach((dot, index) => {
            const isActive = index === currentSlide;
            dot.classList.toggle('is-active', isActive);
            dot.setAttribute('aria-current', isActive ? 'true' : 'false');
        });
    };

    const startAutoplay = () => {
        window.clearInterval(autoplay);
        autoplay = window.setInterval(() => showSlide(currentSlide + 1), 6000);
    };

    previousButton.addEventListener('click', () => {
        showSlide(currentSlide - 1);
        startAutoplay();
    });

    nextButton.addEventListener('click', () => {
        showSlide(currentSlide + 1);
        startAutoplay();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            startAutoplay();
        });
    });

    carousel.addEventListener('mouseenter', () => window.clearInterval(autoplay));
    carousel.addEventListener('mouseleave', startAutoplay);
    startAutoplay();
}

const propertyTiles = document.querySelectorAll('.property-tile');

propertyTiles.forEach((tile) => {
    tile.addEventListener('mouseenter', () => {
        tile.classList.add('is-hovered');
    });

    tile.addEventListener('mouseleave', () => {
        tile.classList.remove('is-hovered');
    });
});

const listingCards = document.querySelectorAll('.listing-card');

listingCards.forEach((card) => {
    const setCardState = (isActive) => {
        card.classList.toggle('is-active', isActive);
    };

    card.addEventListener('mouseenter', () => setCardState(true));
    card.addEventListener('mouseleave', () => setCardState(false));
    card.addEventListener('focusin', () => setCardState(true));
    card.addEventListener('focusout', () => setCardState(false));
});

const listingModal = document.getElementById('listingModal');

if (listingModal && listingCards.length) {
    const modalImage = document.getElementById('modalListingImage');
    const modalTitle = document.getElementById('modalListingTitle');
    const modalLocation = document.getElementById('modalListingLocation');
    const modalPrice = document.getElementById('modalListingPrice');
    const modalBedrooms = document.getElementById('modalListingBedrooms');
    const modalBaths = document.getElementById('modalListingBaths');
    const modalType = document.getElementById('modalListingType');
    const modalDescription = document.getElementById('modalListingDescription');
    let lastFocusedCard;

    const closeListingModal = () => {
        listingModal.classList.remove('is-open');
        listingModal.setAttribute('aria-hidden', 'true');
        if (lastFocusedCard) lastFocusedCard.focus();
    };

    const openListingModal = (card) => {
        const image = card.querySelector('img');
        const title = card.querySelector('h3');
        const price = card.querySelector('strong');

        lastFocusedCard = card;
        modalImage.src = image.src;
        modalImage.alt = image.alt;
        modalTitle.textContent = title.textContent;
        modalLocation.textContent = card.dataset.location.replace(/\b\w/g, (letter) => letter.toUpperCase()) + ', NV';
        modalPrice.textContent = price.textContent;
        modalBedrooms.textContent = card.dataset.bedrooms;
        modalBaths.textContent = card.dataset.baths;
        modalType.textContent = card.dataset.type.replace(/\b\w/g, (letter) => letter.toUpperCase());
        modalDescription.textContent = card.dataset.description;
        listingModal.classList.add('is-open');
        listingModal.setAttribute('aria-hidden', 'false');
        listingModal.querySelector('.listing-modal-close').focus();
    };

    listingCards.forEach((card) => {
        card.addEventListener('click', () => openListingModal(card));
        card.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openListingModal(card);
            }
        });
    });

    listingModal.querySelectorAll('[data-modal-close]').forEach((element) => {
        element.addEventListener('click', closeListingModal);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && listingModal.classList.contains('is-open')) closeListingModal();
    });
}

const listingSearchForm = document.getElementById('listingSearchForm');
const searchReset = document.getElementById('searchReset');
const searchResultsStatus = document.getElementById('searchResultsStatus');

if (listingSearchForm && listingCards.length && searchResultsStatus) {
    const updateListingResults = () => {
        const formData = new FormData(listingSearchForm);
        const location = String(formData.get('location') || '').toLowerCase();
        const type = String(formData.get('type') || '').toLowerCase();
        const bedrooms = Number(formData.get('bedrooms') || 0);
        const baths = Number(formData.get('baths') || 0);
        const minPrice = Number(formData.get('min-price') || 0);
        const maxPrice = Number(formData.get('max-price') || Infinity);
        const sort = String(formData.get('sort') || 'featured');
        const cards = [...listingCards];
        let visibleCount = 0;

        cards.forEach((card) => {
            const matches = (!location || card.dataset.location === location)
                && (!type || card.dataset.type === type)
                && (!bedrooms || Number(card.dataset.bedrooms) >= bedrooms)
                && (!baths || Number(card.dataset.baths) >= baths)
                && Number(card.dataset.price) >= minPrice
                && Number(card.dataset.price) <= maxPrice;

            card.classList.toggle('is-hidden', !matches);
            visibleCount += matches ? 1 : 0;
        });

        if (sort !== 'featured') {
            const direction = sort === 'price-low' ? 1 : -1;
            const grid = document.querySelector('.list-tile-grid');
            cards.sort((firstCard, secondCard) => direction * (Number(firstCard.dataset.price) - Number(secondCard.dataset.price)));
            cards.forEach((card) => grid.appendChild(card));
        }

        searchResultsStatus.textContent = `${visibleCount} ${visibleCount === 1 ? 'listing' : 'listings'} match your search.`;
    };

    listingSearchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        updateListingResults();
        document.querySelector('.list-tile').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    searchReset.addEventListener('click', () => {
        listingSearchForm.reset();
        updateListingResults();
    });

    updateListingResults();
}
