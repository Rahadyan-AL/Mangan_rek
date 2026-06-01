export type PublicMenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
};

export type PublicRestaurant = {
  id: string;
  name: string;
  address: string;
  category: string;
  distanceKm: number;
  description: string;
  image: string;
  promoLabel: string;
  rating: number;
  isOpen: boolean;
  menus: PublicMenuItem[];
};

export const publicRestaurants: PublicRestaurant[] = [
  {
    id: "bakso-president",
    name: "Bakso President",
    address: "Jl. Batanghari No.5",
    category: "Bakso",
    distanceKm: 1.2,
    description:
      "Bakso legendaris dengan kuah gurih, pentol padat, dan suasana kuliner Malang yang klasik.",
    image: "/image/makanan/bakso.jpg",
    promoLabel: "Diskon 15%",
    rating: 4.8,
    isOpen: true,
    menus: [
      {
        id: "bakso-uwong",
        name: "Bakso Urat",
        description: "Bakso urat besar dengan isian daging padat dan kuah hangat.",
        price: 28000,
        image: "/image/makanan/bakso.jpg",
      },
      {
        id: "mie-pangsit",
        name: "Mie Pangsit",
        description: "Mie kenyal dengan pangsit renyah dan taburan bawang goreng.",
        price: 22000,
        image: "/image/makanan/mie-goreng.jpg",
      },
      {
        id: "tahu-goreng",
        name: "Tahu Goreng",
        description: "Camilan pendamping dengan sambal kacang yang ringan.",
        price: 12000,
        image: "/image/makanan/pecel.jpg",
      },
    ],
  },
  {
    id: "rawon-nguling",
    name: "Rawon Nguling",
    address: "Jl. Zainul Arifin No.62",
    category: "Rawon",
    distanceKm: 2.4,
    description:
      "Rawon dengan kuah hitam pekat khas Jawa Timur, daging empuk, dan sambal yang kuat.",
    image: "/image/makanan/soto.jpg",
    promoLabel: "Diskon 10%",
    rating: 4.7,
    isOpen: true,
    menus: [
      {
        id: "rawon-spesial",
        name: "Rawon Spesial",
        description: "Rawon dengan daging lebih banyak dan telur asin.",
        price: 32000,
        image: "/image/makanan/soto.jpg",
      },
      {
        id: "nasi-rawon",
        name: "Nasi Rawon",
        description: "Porsi nasi hangat dengan kuah rawon gurih.",
        price: 25000,
        image: "/image/makanan/nasi-goreng.jpg",
      },
      {
        id: "perkedel",
        name: "Perkedel",
        description: "Perkedel kentang lembut sebagai pendamping.",
        price: 8000,
        image: "/image/makanan/lalapan.jpg",
      },
    ],
  },
  {
    id: "hot-cwie-mie-malang",
    name: "Hot Cwie Mie Malang",
    address: "Jl. Kawi No.20",
    category: "Cwie Mie",
    distanceKm: 0.8,
    description:
      "Cwie mie dengan topping ayam gurih, sayuran segar, dan rasa yang cocok untuk makan siang cepat.",
    image: "/image/makanan/mie-goreng.jpg",
    promoLabel: "Diskon 20%",
    rating: 4.9,
    isOpen: true,
    menus: [
      {
        id: "cwie-mie-ayam",
        name: "Cwie Mie Ayam",
        description: "Mie ayam cincang khas Malang dengan tekstur lembut.",
        price: 27000,
        image: "/image/makanan/mie-goreng.jpg",
      },
      {
        id: "pangsit-goreng",
        name: "Pangsit Goreng",
        description: "Pangsit renyah untuk teman makan mie.",
        price: 15000,
        image: "/image/makanan/Sate-Ayam.jpg",
      },
      {
        id: "es-teh",
        name: "Es Teh Manis",
        description: "Minuman segar untuk melengkapi menu utama.",
        price: 6000,
        image: "/image/makanan/pecel.jpg",
      },
    ],
  },
];

export function normalizePublicId(value: string | null | undefined) {
  return (value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function findPublicRestaurant(restaurantId: string | null | undefined) {
  const normalizedId = normalizePublicId(restaurantId);
  return publicRestaurants.find((restaurant) => restaurant.id === normalizedId);
}

export function findPublicMenu(
  restaurantId: string | null | undefined,
  menuId: string | null | undefined
) {
  const restaurant = findPublicRestaurant(restaurantId);
  if (!restaurant) return null;

  const normalizedMenuId = normalizePublicId(menuId);
  return restaurant.menus.find((menu) => menu.id === normalizedMenuId) ?? null;
}