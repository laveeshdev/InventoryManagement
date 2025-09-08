// User Schema
export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

// Listing Schema (Inventory)
export interface Listing {
  id: string;
  owner: string; // User ID
  name: string;
  type: string;
  sku: string;
  image_url: string;
  description: string;
  quantity: number;
  price: number;
  createdAt: string;
  updatedAt: string;
}

// Party Schema (Customers & Sellers)
export interface Party {
  id: string;
  owner: string; // User ID
  name: string;
  email: string;
  phone: string;
  address: string;
  type: 'customer' | 'seller';
  balance: number;
  createdAt: string;
  updatedAt: string;
}

// Transaction Schema
export interface TransactionItem {
  listing: string; // Listing ID
  listingName: string; // For display purposes
  quantity: number;
  amount: number; // Price per item
}

export interface Transaction {
  id: string;
  owner: string; // User ID
  party: string; // Party ID
  partyName: string; // For display purposes
  items: TransactionItem[];
  paymentStatus: 'pending' | 'completed';
  totalAmount: number;
  type: 'buy' | 'sell';
  invoice: string;
  date: string;
  remarks: string;
  createdAt: string;
  updatedAt: string;
}

// Form types for creating/updating
export type CreateUserData = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
export type CreateListingData = Omit<Listing, 'id' | 'owner' | 'createdAt' | 'updatedAt'>;
export type CreatePartyData = Omit<Party, 'id' | 'owner' | 'createdAt' | 'updatedAt'>;
export type CreateTransactionData = Omit<Transaction, 'id' | 'owner' | 'invoice' | 'createdAt' | 'updatedAt'>;

// Dashboard data types
export interface DashboardStats {
  totalSales: number;
  totalPurchases: number;
  netProfit: number;
  totalListings: number;
  totalParties: number;
  lowStockCount: number;
  pendingTransactions: number;
}