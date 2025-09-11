export interface Expense {
  id: number;
  storeName: string;
  storePhone: string;
  storeAddress: string;
  storeWebsite?: string;
  paymentMethod: string;
  datetime: Date;
  totalAmount: number;
  ownerId: string;
  ownerName: string;
  status: "Pending" | "Approved" | "Denied";
  category: string;
  items: {
    name: string;
    quantity: number;
    unitPrice: number;
  }[];
}
