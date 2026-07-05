const HotelAPI = (() => {
  const ENDPOINT = "https://demohotelsapi.pythonanywhere.com/hotels/";

  let cache = null;
  let inFlight = null;

  async function fetchHotels() {
    if (cache) return cache;
    if (inFlight) return inFlight;

    inFlight = fetch(ENDPOINT)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`API responded with status ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        cache = Array.isArray(data) ? data : data.results || [];
        return cache;
      })
      .finally(() => {
        inFlight = null;
      });

    return inFlight;
  }

  function clearCache() {
    cache = null;
  }

  return { fetchHotels, clearCache };
})();