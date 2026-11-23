export type Place = {
  id: string;
  name: string;
};

export const PLACES: Place[] = [
  { id: "sanur", name: "Sanur, Bali" },
  { id: "nusa-dua", name: "Nusa Dua, Bali" },
  { id: "ubud", name: "Ubud, Bali" },
  { id: "seminyak", name: "Seminyak, Bali" },
  { id: "male", name: "Malé, Maldives" },
  { id: "vadoo", name: "Adaaran Vadoo, Maldives" },
  { id: "colombo", name: "Colombo, Sri Lanka" },
  { id: "phuket", name: "Phuket, Thailand" },
  { id: "bangkok", name: "Bangkok, Thailand" },
  { id: "singapore", name: "Singapore" },
  { id: "kuala-lumpur", name: "Kuala Lumpur" },
  { id: "jakarta", name: "Jakarta" },
];

export function placeById(id: string): Place | undefined {
  return PLACES.find((place) => place.id === id);
}
