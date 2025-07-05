export interface Contribution {
  id: string;
  amount: number;
  date: string;
}

export interface Goal {
  id: string;
  name: string;
  currency: "INR" | "USD";
  targetAmount: number;
  savedAmount: number;
  contributions: Contribution[];
  createdAt: string; 
}
