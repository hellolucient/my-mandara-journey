export type Resort = {
  name: string;
  placeId: string;
  location: string;
};

export const RESORTS: Resort[] = [
  { name: "Adaaran Club Rannalhi", placeId: "male", location: "Rannalhi" },
  { name: "Adaaran Prestige Vadoo Maldives", placeId: "vadoo", location: "Vadoo" },
  { name: "Adaaran Select Hudhuranfushi", placeId: "male", location: "Hudhuranfushi" },
  { name: "Adaaran Select Meedhupparu", placeId: "male", location: "Meedhupparu" },
  { name: "Barceló Nasandhura Malé", placeId: "male", location: "Malé" },
  { name: "Cinnamon Dhonveli Maldives", placeId: "male", location: "Dhonveli" },
  { name: "Cinnamon Hakuraa Huraa Maldives", placeId: "male", location: "Hakuraa Huraa" },
  { name: "Cinnamon Velifushi Maldives", placeId: "male", location: "Velifushi" },
  { name: "Ellaidhoo Maldives by Cinnamon", placeId: "male", location: "Ellaidhoo" },
  { name: "Meliá Whale Lagoon Maldives", placeId: "male", location: "Whale Lagoon" },
  { name: "NOOE Maldives Kunaavashi", placeId: "male", location: "Kunaavashi" },
];

export function resortByName(name: string): Resort | undefined {
  return RESORTS.find((resort) => resort.name === name);
}
