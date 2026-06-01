export type PendingRestaurant = {
  id: string;
  ownerName: string;
  email: string;
  password: string;
  restaurantName: string;
  address: string;
  latitude: string;
  longitude: string;
  legalPhoto: string;
  status: "Pending" | "Approved" | "Review Needed";
  category: string;
};

export const pendingRestaurants: PendingRestaurant[] = [
  {
    id: "warung-kopi-jaya",
    ownerName: "Budi Santoso",
    email: "budi.santoso@example.com",
    password: "BudiSantoso123",
    restaurantName: "Warung Kopi Jaya",
    address: "Jl. Ijen No. 18, Kota Malang",
    latitude: "-7.980123",
    longitude: "112.634567",
    legalPhoto: "https://drive.google.com/file/d/warung-kopi-jaya-legalitas",
    status: "Pending",
    category: "Cafe",
  },
  {
    id: "sate-madura-asli-cak-ali",
    ownerName: "Ali Mahmud",
    email: "ali.mahmud@example.com",
    password: "AliMahmud123",
    restaurantName: "Sate Madura Asli Cak Ali",
    address: "Jl. Soekarno Hatta No. 42, Kota Malang",
    latitude: "-7.956891",
    longitude: "112.615432",
    legalPhoto: "https://drive.google.com/file/d/sate-madura-legalitas",
    status: "Pending",
    category: "Street Food",
  },
  {
    id: "depot-rawon-setan",
    ownerName: "Siti Aminah",
    email: "siti.aminah@example.com",
    password: "SitiAminah123",
    restaurantName: "Depot Rawon Setan",
    address: "Jl. Basuki Rahmat No. 9, Kota Malang",
    latitude: "-7.982345",
    longitude: "112.631234",
    legalPhoto: "https://drive.google.com/file/d/depot-rawon-legalitas",
    status: "Review Needed",
    category: "Traditional",
  },
];

export function getPendingRestaurantById(id: string) {
  return pendingRestaurants.find((restaurant) => restaurant.id === id);
}