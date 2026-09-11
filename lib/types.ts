export interface Listing {
  id: string;
  item_name: string;
  description: string;
  category: string;
  lender_name: string;
  contact_info: string;
  created_at: string;
}

export type NewListing = Omit<Listing, "id" | "created_at">;

export const CATEGORIES = [
  "Books & Notes",
  "Electronics",
  "Lab Equipment",
  "Stationery",
  "Clothing & Accessories",
  "Sports & Fitness",
  "Tools",
  "Other",
] as const;

// Validation lengths mirror DB CHECK constraints — single source of truth
export const VALIDATION = {
  item_name:   { min: 2,  max: 100 },
  description: { min: 5,  max: 500 },
  lender_name: { min: 2,  max: 60  },
  contact_info:{ min: 3,  max: 150 },
} as const;
