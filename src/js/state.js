const AppState = {
  allHotels: [],
  searchTerm: "",
  location: "all",
  minRating: 0,
  sortBy: "default",
  visibleCount: 20,
  pageSize: 20,

  setHotels(hotels) {
    this.allHotels = hotels;
  },

  setSearchTerm(term) {
    this.searchTerm = term.trim().toLowerCase();
    this.visibleCount = this.pageSize;
  },

  setLocation(loc) {
    this.location = loc;
    this.visibleCount = this.pageSize;
  },

  setMinRating(rating) {
    this.minRating = Number(rating);
    this.visibleCount = this.pageSize;
  },

  setSortBy(sortBy) {
    this.sortBy = sortBy;
  },

  showMore() {
    this.visibleCount += this.pageSize;
  },

  reset() {
    this.searchTerm = "";
    this.location = "all";
    this.minRating = 0;
    this.sortBy = "default";
    this.visibleCount = this.pageSize;
  },

  hasActiveFilters() {
    return this.searchTerm !== "" || this.location !== "all" || this.minRating > 0;
  },

  getLocations() {
    const set = new Set(this.allHotels.map((h) => h.location).filter(Boolean));
    return Array.from(set).sort();
  },
};
