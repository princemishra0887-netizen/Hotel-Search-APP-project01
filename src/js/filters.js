

const Filters = {
  bySearchTerm(hotels, term) {
    if (!term) return hotels;
    return hotels.filter(
      (h) =>
        h.name.toLowerCase().includes(term) ||
        h.location.toLowerCase().includes(term)
    );
  },

  byLocation(hotels, location) {
    if (!location || location === "all") return hotels;
    return hotels.filter((h) => h.location === location);
  },

  byMinRating(hotels, minRating) {
    if (!minRating) return hotels;
    return hotels.filter((h) => Number(h.rating) >= minRating);
  },

  sort(hotels, sortBy) {
    const list = [...hotels];
    switch (sortBy) {
      case "price-asc":
        return list.sort((a, b) => Number(a.price) - Number(b.price));
      case "price-desc":
        return list.sort((a, b) => Number(b.price) - Number(a.price));
      case "rating-desc":
        return list.sort((a, b) => Number(b.rating) - Number(a.rating));
      case "rating-asc":
        return list.sort((a, b) => Number(a.rating) - Number(b.rating));
      default:
        return list;
    }
  },

  apply(hotels, { searchTerm, location, minRating, sortBy }) {
    let result = hotels;
    result = this.bySearchTerm(result, searchTerm);
    result = this.byLocation(result, location);
    result = this.byMinRating(result, minRating);
    result = this.sort(result, sortBy);
    return result;
  },
};