type PartnerNoteFieldType =
  | "date"
  | "choice"
  | "multi"
  | "short_text"
  | "list";

export type PartnerNoteGroup =
  | "Important dates"
  | "Favourites"
  | "Gifts and sizes"
  | "Little things";

export interface PartnerNoteFieldDef {
  key: string;
  label: string;
  group: PartnerNoteGroup;
  type: PartnerNoteFieldType;
  options?: string[];
  allowOther?: boolean;
  maxChars?: number;
  placeholder?: string;
}

export const PARTNER_NOTE_GROUPS: PartnerNoteGroup[] = [
  "Important dates",
  "Favourites",
  "Gifts and sizes",
  "Little things",
];

export const PARTNER_NOTE_FIELDS: PartnerNoteFieldDef[] = [
  // ─── Important Dates ──────────────────────────────────────────
  {
    key: "birthday",
    label: "Birthday",
    group: "Important dates",
    type: "date",
    placeholder: "Set their birthday",
  },
  {
    key: "anniversary",
    label: "Anniversary / First met",
    group: "Important dates",
    type: "date",
    placeholder: "Set your special anniversary date",
  },

  // ─── Favourites ───────────────────────────────────────────────
  {
    key: "fav_food",
    label: "Favorite food",
    group: "Favourites",
    type: "choice",
    options: ["Pizza", "Biryani", "Pasta", "Burgers", "Sushi", "Street food", "Desserts", "Tacos"],
    allowOther: true,
  },
  {
    key: "fav_drink",
    label: "Favorite drink",
    group: "Favourites",
    type: "choice",
    options: ["Coffee", "Chai", "Boba / Bubble Tea", "Fresh Juice", "Wine", "Cocktails", "Soda", "Matcha"],
    allowOther: true,
  },
  {
    key: "fav_cuisine",
    label: "Favorite cuisine",
    group: "Favourites",
    type: "choice",
    options: ["Italian", "Indian", "Mexican", "Japanese", "Chinese", "Thai", "Mediterranean", "American"],
    allowOther: true,
  },
  {
    key: "fav_place",
    label: "Favorite place to go",
    group: "Favourites",
    type: "choice",
    options: ["Beach", "Mountains", "Cozy cafe", "Park", "Bookstore", "Rooftop bar", "Art gallery", "Cinema"],
    allowOther: true,
  },
  {
    key: "fav_car_bike",
    label: "Favorite car or bike",
    group: "Favourites",
    type: "choice",
    options: ["Sports car", "Vintage car", "SUV", "Superbike", "Cruiser bike", "Vespa / Scooter", "Electric car"],
    allowOther: true,
  },
  {
    key: "fav_color",
    label: "Favorite color",
    group: "Favourites",
    type: "choice",
    options: ["Lavender", "Rose Pink", "Emerald Green", "Midnight Blue", "Sunset Orange", "Pure Black", "Pure White", "Lilac"],
    allowOther: true,
  },
  {
    key: "fav_flower",
    label: "Favorite flower",
    group: "Favourites",
    type: "choice",
    options: ["Red Roses", "Peonies", "Sunflowers", "Tulips", "Orchids", "Lilies", "Daisies", "Hydrangeas"],
    allowOther: true,
  },
  {
    key: "fav_sweet",
    label: "Favorite sweet / dessert",
    group: "Favourites",
    type: "choice",
    options: ["Dark Chocolate", "Cheesecake", "Ice Cream", "Warm Brownies", "Gulab Jamun", "Macarons", "Tiramisu", "Waffles"],
    allowOther: true,
  },
  {
    key: "fav_movie_genre",
    label: "Favorite movie genre",
    group: "Favourites",
    type: "choice",
    options: ["Rom-Com", "Thriller / Mystery", "Sci-Fi", "Feel-good Comedy", "Drama", "Horror", "Animation / Anime", "Action"],
    allowOther: true,
  },
  {
    key: "fav_music_genre",
    label: "Favorite music genre",
    group: "Favourites",
    type: "choice",
    options: ["Pop", "Indie / Acoustic", "R&B / Soul", "Lo-Fi", "Rock", "Hip-Hop", "Classical", "Jazz"],
    allowOther: true,
  },
  {
    key: "fav_season",
    label: "Favorite season",
    group: "Favourites",
    type: "choice",
    options: ["Spring", "Summer", "Autumn / Fall", "Winter", "Monsoon / Rainy"],
    allowOther: true,
  },
  {
    key: "fav_holiday_dest",
    label: "Favorite holiday vibe",
    group: "Favourites",
    type: "choice",
    options: ["Tropical Beach Resort", "Snowy Mountain Cabin", "Historic Old Town", "Big City Lights", "Scenic Countryside", "Safari Nature Trip"],
    allowOther: true,
  },
  {
    key: "fav_hobby",
    label: "Favorite hobby",
    group: "Favourites",
    type: "choice",
    options: ["Reading", "Cooking / Baking", "Gaming", "Photography", "Traveling", "Painting / Sketching", "Fitness / Gym", "Dancing"],
    allowOther: true,
  },
  {
    key: "fav_brand",
    label: "Favorite brand",
    group: "Favourites",
    type: "choice",
    options: ["Zara", "Apple", "Nike", "H&M", "Sephora", "Adidas", "Uniqlo", "Lululemon"],
    allowOther: true,
  },

  // ─── Gifts and Sizes ──────────────────────────────────────────
  {
    key: "gift_ideas",
    label: "Gift ideas wish-list",
    group: "Gifts and sizes",
    type: "list",
    placeholder: "Add an idea they wished for...",
  },
  {
    key: "ring_size",
    label: "Ring size",
    group: "Gifts and sizes",
    type: "choice",
    options: ["US 4", "US 5", "US 6", "US 7", "US 8", "US 9", "US 10", "US 11"],
    allowOther: true,
  },
  {
    key: "clothing_size",
    label: "Clothing size",
    group: "Gifts and sizes",
    type: "choice",
    options: ["XS", "S", "M", "L", "XL", "XXL"],
    allowOther: true,
  },
  {
    key: "shoe_size",
    label: "Shoe size",
    group: "Gifts and sizes",
    type: "choice",
    options: [
      "EU 36 / US 6",
      "EU 37 / US 6.5",
      "EU 38 / US 7.5",
      "EU 39 / US 8.5",
      "EU 40 / US 9",
      "EU 41 / US 8M",
      "EU 42 / US 8.5M",
      "EU 43 / US 9.5M",
    ],
    allowOther: true,
  },
  {
    key: "allergies_avoid",
    label: "Allergies or things to avoid",
    group: "Gifts and sizes",
    type: "multi",
    options: ["Peanuts / Nuts", "Dairy / Lactose", "Spicy food", "Gluten", "Seafood / Shellfish", "Eggs", "Strong perfumes"],
    allowOther: true,
  },

  // ─── Little Things ────────────────────────────────────────────
  {
    key: "love_language",
    label: "Primary love language",
    group: "Little things",
    type: "choice",
    options: [
      "Words of Affirmation",
      "Quality Time",
      "Receiving Gifts",
      "Acts of Service",
      "Physical Touch",
    ],
    allowOther: false,
  },
  {
    key: "comforts_when_sad",
    label: "What comforts them when sad",
    group: "Little things",
    type: "multi",
    options: [
      "Warm tight hugs",
      "Favorite comfort food / treats",
      "Listening quietly without advice",
      "Watching a cozy movie together",
      "Going for a peaceful drive",
      "Gentle space & quiet time",
    ],
    allowOther: true,
  },
  {
    key: "nickname",
    label: "Special nickname for them",
    group: "Little things",
    type: "short_text",
    maxChars: 30,
    placeholder: "e.g. My Sunshine",
  },
  {
    key: "makes_them_smile",
    label: "What always makes them smile",
    group: "Little things",
    type: "short_text",
    maxChars: 60,
    placeholder: "e.g. Surprise flowers or morning coffee notes",
  },
  {
    key: "dream_mentioned",
    label: "A dream they once mentioned",
    group: "Little things",
    type: "short_text",
    maxChars: 60,
    placeholder: "e.g. Starting a little seaside bakery",
  },
];
