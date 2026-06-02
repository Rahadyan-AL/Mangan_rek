export type FavoriteRestaurant = {
  id: string;
  name: string;
  address: string;
  image: string;
  category: string;
  description: string;
  distanceKm?: number;
  rating?: number;
  type?: "RESTAURANT" | "MENU";
  restaurantId?: string;
};

const FAVORITES_STORAGE_KEY = "manganrek-favorites";

function hasWindow() {
  return typeof window !== "undefined";
}

export function readFavoriteRestaurants(): FavoriteRestaurant[] {
  if (!hasWindow()) return [];

  try {
    const raw = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as FavoriteRestaurant[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeFavoriteRestaurants(restaurants: FavoriteRestaurant[]) {
  if (!hasWindow()) return;

  window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(restaurants));
}

export function isFavoriteRestaurant(restaurantId: string) {
  return readFavoriteRestaurants().some((restaurant) => restaurant.id === restaurantId);
}

export function addFavoriteRestaurant(restaurant: FavoriteRestaurant) {
  const currentFavorites = readFavoriteRestaurants();
  const nextFavorites = currentFavorites.some((item) => item.id === restaurant.id)
    ? currentFavorites
    : [restaurant, ...currentFavorites];

  writeFavoriteRestaurants(nextFavorites);
  return nextFavorites;
}

export function removeFavoriteRestaurant(restaurantId: string) {
  const nextFavorites = readFavoriteRestaurants().filter(
    (restaurant) => restaurant.id !== restaurantId
  );

  writeFavoriteRestaurants(nextFavorites);
  return nextFavorites;
}

export function toggleFavoriteRestaurant(restaurant: FavoriteRestaurant) {
  const currentFavorites = readFavoriteRestaurants();
  const exists = currentFavorites.some((item) => item.id === restaurant.id);
  const nextFavorites = exists
    ? currentFavorites.filter((item) => item.id !== restaurant.id)
    : [restaurant, ...currentFavorites];

  writeFavoriteRestaurants(nextFavorites);
  return nextFavorites;
}