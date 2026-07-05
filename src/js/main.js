

(function () {
  const searchInput = document.getElementById("search-input");
  const locationSelect = document.getElementById("location-select");
  const ratingSelect = document.getElementById("rating-select");
  const sortSelect = document.getElementById("sort-select");
  const loadMoreBtn = document.getElementById("load-more");
  const clearFiltersBtn = document.getElementById("clear-filters");
  const emptyClearBtn = document.getElementById("empty-clear-btn");
  const retryBtn = document.getElementById("retry-btn");
  const modalOverlay = document.getElementById("modal-overlay");
  const modalCloseBtn = document.getElementById("modal-close");

  let debounceTimer = null;

  function getFilteredHotels() {
    return Filters.apply(AppState.allHotels, {
      searchTerm: AppState.searchTerm,
      location: AppState.location,
      minRating: AppState.minRating,
      sortBy: AppState.sortBy,
    });
  }

  function update() {
    const filtered = getFilteredHotels();
    Render.renderGrid(filtered, AppState.visibleCount, openModal);
    clearFiltersBtn.hidden = !AppState.hasActiveFilters();
  }

  function openModal(hotel) {
    Render.renderModal(hotel);
    modalOverlay.hidden = false;
    document.body.style.overflow = "hidden";
    modalCloseBtn.focus();
  }

  function closeModal() {
    modalOverlay.hidden = true;
    document.body.style.overflow = "";
  }

  function clearAllFilters() {
    AppState.reset();
    searchInput.value = "";
    locationSelect.value = "all";
    ratingSelect.value = "0";
    sortSelect.value = "default";
    update();
  }

  async function loadHotels() {
    Render.showSkeletons();
    try {
      const hotels = await HotelAPI.fetchHotels();
      AppState.setHotels(hotels);
      Render.populateLocationDropdown(AppState.getLocations(), locationSelect);
      update();
    } catch (err) {
      console.error("Failed to load hotels:", err);
      Render.showError();
    }
  }

  searchInput.addEventListener("input", (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      AppState.setSearchTerm(e.target.value);
      update();
    }, 300);
  });

  locationSelect.addEventListener("change", (e) => {
    AppState.setLocation(e.target.value);
    update();
  });

  ratingSelect.addEventListener("change", (e) => {
    AppState.setMinRating(e.target.value);
    update();
  });

  sortSelect.addEventListener("change", (e) => {
    AppState.setSortBy(e.target.value);
    update();
  });

  loadMoreBtn.addEventListener("click", () => {
    AppState.showMore();
    update();
  });

  clearFiltersBtn.addEventListener("click", clearAllFilters);
  emptyClearBtn.addEventListener("click", clearAllFilters);
  retryBtn.addEventListener("click", loadHotels);

  modalCloseBtn.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modalOverlay.hidden) closeModal();
  });

  loadHotels();
})();