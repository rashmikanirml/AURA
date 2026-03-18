export type VehicleWithRelations = {
  id: string;
  title: string;
  price: number;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  location: string;
  description: string;
  createdAt: string;
  images: { id: string; imageUrl: string }[];
  user?: {
    id: string;
    name: string | null;
    email: string;
  };
};
