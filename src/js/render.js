

const Render = {
  grid: document.getElementById("hotel-grid"),
  resultsCount: document.getElementById("results-count"),
  emptyState: document.getElementById("empty-state"),
  errorState: document.getElementById("error-state"),
  loadMoreBtn: document.getElementById("load-more"),
  clearFiltersBtn: document.getElementById("clear-filters"),

  formatPrice(price) {
    const num = Math.round(Number(price));
    return "₹" + num.toLocaleString("en-IN");
  },

  starString(rating) {
    const r = Number(rating);
    const full = Math.round(r);
    return "★".repeat(full) + "☆".repeat(5 - full);
  },

  skeletonCard() {
    const card = document.createElement("div");
    card.className = "card card--skeleton";
    card.innerHTML = `
      <div class="card__photo skeleton-block"></div>
      <div class="card__perforation"></div>
      <div class="card__body">
        <div class="skeleton-line" style="width:70%"></div>
        <div class="skeleton-line" style="width:40%"></div>
      </div>
    `;
    return card;
  },

  showSkeletons(count = 8) {
    this.grid.innerHTML = "";
    this.hideStates();
    for (let i = 0; i < count; i++) {
      this.grid.appendChild(this.skeletonCard());
    }
    this.resultsCount.textContent = "Loading hotels…";
  },

  hideStates() {
    this.emptyState.hidden = true;
    this.errorState.hidden = true;
  },

  showError() {
    this.grid.innerHTML = "";
    this.loadMoreBtn.hidden = true;
    this.errorState.hidden = false;
    this.emptyState.hidden = true;
    this.resultsCount.textContent = "";
  },

  hotelCard(hotel) {
    const card = document.createElement("article");
    card.className = "card";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `View details for ${hotel.name}`);
    card.dataset.id = hotel.id;

    card.innerHTML = `
      <div class="card__photo">
        <img src="${hotel.thumbnail}" alt="${hotel.name}" loading="lazy" />
        <span class="card__ratingchip">★ ${Number(hotel.rating).toFixed(1)}</span>
      </div>
      <div class="card__perforation" aria-hidden="true"></div>
      <div class="card__body">
        <h3 class="card__name">${hotel.name}</h3>
        <p class="card__location">${hotel.location}</p>
        <div class="card__footer">
          <span class="card__code">ROOM · ${String(hotel.id).padStart(4, "0")}</span>
          <span class="card__price">${this.formatPrice(hotel.price)}<small>/night</small></span>
        </div>
      </div>
    `;
    return card;
  },

  renderGrid(hotels, visibleCount, onCardClick) {
    this.hideStates();
    this.grid.innerHTML = "";

    if (hotels.length === 0) {
      this.emptyState.hidden = false;
      this.loadMoreBtn.hidden = true;
      this.resultsCount.textContent = "0 hotels found";
      return;
    }

    const visible = hotels.slice(0, visibleCount);
    visible.forEach((hotel) => {
      const card = this.hotelCard(hotel);
      card.addEventListener("click", () => onCardClick(hotel));
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onCardClick(hotel);
        }
      });
      this.grid.appendChild(card);
    });

    this.resultsCount.textContent = `${hotels.length} hotel${hotels.length === 1 ? "" : "s"} found`;
    this.loadMoreBtn.hidden = visibleCount >= hotels.length;
  },

  populateLocationDropdown(locations, selectEl) {
    locations.forEach((loc) => {
      const opt = document.createElement("option");
      opt.value = loc;
      opt.textContent = loc;
      selectEl.appendChild(opt);
    });
  },

  renderModal(hotel) {
    const body = document.getElementById("modal-body");
    const photos = hotel.photos && hotel.photos.length ? hotel.photos : [hotel.thumbnail];

    body.innerHTML = `
      <div class="modal__gallery">
        <img id="modal-main-photo" src="${photos[0]}" alt="${hotel.name}" />
        <div class="modal__thumbs">
          ${photos
            .map(
              (p, i) =>
                `<img src="${p}" alt="View ${i + 1}" class="modal__thumb ${i === 0 ? "is-active" : ""}" data-index="${i}" />`
            )
            .join("")}
        </div>
      </div>
      <div class="modal__info">
        <p class="modal__code">BOARDING PASS · ROOM ${String(hotel.id).padStart(4, "0")}</p>
        <h2 id="modal-title" class="modal__name">${hotel.name}</h2>
        <p class="modal__location">📍 ${hotel.location}</p>
        <p class="modal__rating">${this.starString(hotel.rating)} <span>${Number(hotel.rating).toFixed(1)} / 5</span></p>
        <p class="modal__description">${hotel.description}</p>
        <div class="modal__pricebar">
          <span class="modal__price">${this.formatPrice(hotel.price)}<small>/night</small></span>
          <button class="btn btn--primary" type="button">Book this stay</button>
        </div>
      </div>
    `;

    const mainPhoto = document.getElementById("modal-main-photo");
    body.querySelectorAll(".modal__thumb").forEach((thumb) => {
      thumb.addEventListener("click", () => {
        mainPhoto.src = thumb.src;
        body.querySelectorAll(".modal__thumb").forEach((t) => t.classList.remove("is-active"));
        thumb.classList.add("is-active");
      });
    });
  },
};