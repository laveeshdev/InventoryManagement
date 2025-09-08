import { User, Listing, Party, Transaction } from '@/types/schemas';

// Storage keys
const STORAGE_KEYS = {
  users: 'users',
  listings: 'listings',
  parties: 'parties',
  transactions: 'transactions',
} as const;

// Generic storage functions
export const getStorageData = <T>(key: string): T[] => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error reading ${key} from storage:`, error);
    return [];
  }
};

export const setStorageData = <T>(key: string, data: T[]): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to storage:`, error);
  }
};

// User-specific data functions
export const getUserData = <T extends { owner: string }>(key: string, userId: string): T[] => {
  const allData = getStorageData<T>(key);
  return allData.filter(item => item.owner === userId);
};

// Generate unique IDs
export const generateId = (prefix: string): string => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Generate invoice number
export const generateInvoiceNumber = (): string => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `INV-${timestamp}-${random}`;
};

// Seed data function
export const seedData = (userId: string): void => {
  // Check if data already exists
  const existingListings = getUserData<Listing>(STORAGE_KEYS.listings, userId);
  if (existingListings.length > 0) return;

  const now = new Date().toISOString();

  // Seed listings
  const seedListings: Listing[] = [
    {
      id: generateId('listing'),
      owner: userId,
      name: 'Wireless Headphones',
      type: 'Electronics',
      sku: 'WH-001',
      image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300',
      description: 'High-quality wireless headphones with noise cancellation',
      quantity: 25,
      price: 149.99,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId('listing'),
      owner: userId,
      name: 'Smartphone Case',
      type: 'Accessories',
      sku: 'SC-002',
      image_url: 'https://images.unsplash.com/photo-1601593346740-925612772716?w=300',
      description: 'Protective smartphone case with premium materials',
      quantity: 5, // Low stock
      price: 29.99,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId('listing'),
      owner: userId,
      name: 'Laptop Stand',
      type: 'Office Supplies',
      sku: 'LS-003',
      image_url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300',
      description: 'Adjustable laptop stand for better ergonomics',
      quantity: 15,
      price: 79.99,
      createdAt: now,
      updatedAt: now,
    },
  ];

  // Seed parties
  const seedParties: Party[] = [
    {
      id: generateId('party'),
      owner: userId,
      name: 'Tech Solutions Inc.',
      email: 'contact@techsolutions.com',
      phone: '+1-555-0123',
      address: '123 Business Ave, Tech City, TC 12345',
      type: 'customer',
      balance: 0,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId('party'),
      owner: userId,
      name: 'Global Suppliers Ltd.',
      email: 'orders@globalsuppliers.com',
      phone: '+1-555-0456',
      address: '456 Supply St, Commerce City, CC 67890',
      type: 'seller',
      balance: 0,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId('party'),
      owner: userId,
      name: 'Retail Partners Co.',
      email: 'sales@retailpartners.com',
      phone: '+1-555-0789',
      address: '789 Retail Rd, Sales City, SC 11111',
      type: 'customer',
      balance: 0,
      createdAt: now,
      updatedAt: now,
    },
  ];

  // Save seed data
  const allListings = getStorageData<Listing>(STORAGE_KEYS.listings);
  const allParties = getStorageData<Party>(STORAGE_KEYS.parties);
  
  setStorageData(STORAGE_KEYS.listings, [...allListings, ...seedListings]);
  setStorageData(STORAGE_KEYS.parties, [...allParties, ...seedParties]);
};

// CRUD operations for each entity
export const listingService = {
  getAll: (userId: string): Listing[] => getUserData<Listing>(STORAGE_KEYS.listings, userId),
  
  getById: (id: string): Listing | null => {
    const listings = getStorageData<Listing>(STORAGE_KEYS.listings);
    return listings.find(listing => listing.id === id) || null;
  },
  
  create: (data: Omit<Listing, 'id' | 'owner' | 'createdAt' | 'updatedAt'>, userId: string): Listing => {
    const newListing: Listing = {
      ...data,
      id: generateId('listing'),
      owner: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const listings = getStorageData<Listing>(STORAGE_KEYS.listings);
    const updatedListings = [...listings, newListing];
    setStorageData(STORAGE_KEYS.listings, updatedListings);
    
    return newListing;
  },
  
  update: (id: string, data: Partial<Listing>): Listing | null => {
    const listings = getStorageData<Listing>(STORAGE_KEYS.listings);
    const index = listings.findIndex(listing => listing.id === id);
    
    if (index === -1) return null;
    
    const updatedListing = {
      ...listings[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    
    listings[index] = updatedListing;
    setStorageData(STORAGE_KEYS.listings, listings);
    
    return updatedListing;
  },
  
  delete: (id: string): boolean => {
    const listings = getStorageData<Listing>(STORAGE_KEYS.listings);
    const filteredListings = listings.filter(listing => listing.id !== id);
    
    if (filteredListings.length === listings.length) return false;
    
    setStorageData(STORAGE_KEYS.listings, filteredListings);
    return true;
  },
};

export const partyService = {
  getAll: (userId: string): Party[] => getUserData<Party>(STORAGE_KEYS.parties, userId),
  
  getById: (id: string): Party | null => {
    const parties = getStorageData<Party>(STORAGE_KEYS.parties);
    return parties.find(party => party.id === id) || null;
  },
  
  create: (data: Omit<Party, 'id' | 'owner' | 'createdAt' | 'updatedAt'>, userId: string): Party => {
    const newParty: Party = {
      ...data,
      id: generateId('party'),
      owner: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const parties = getStorageData<Party>(STORAGE_KEYS.parties);
    const updatedParties = [...parties, newParty];
    setStorageData(STORAGE_KEYS.parties, updatedParties);
    
    return newParty;
  },
  
  update: (id: string, data: Partial<Party>): Party | null => {
    const parties = getStorageData<Party>(STORAGE_KEYS.parties);
    const index = parties.findIndex(party => party.id === id);
    
    if (index === -1) return null;
    
    const updatedParty = {
      ...parties[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    
    parties[index] = updatedParty;
    setStorageData(STORAGE_KEYS.parties, parties);
    
    return updatedParty;
  },
  
  delete: (id: string): boolean => {
    const parties = getStorageData<Party>(STORAGE_KEYS.parties);
    const filteredParties = parties.filter(party => party.id !== id);
    
    if (filteredParties.length === parties.length) return false;
    
    setStorageData(STORAGE_KEYS.parties, filteredParties);
    return true;
  },
};

export const transactionService = {
  getAll: (userId: string): Transaction[] => getUserData<Transaction>(STORAGE_KEYS.transactions, userId),
  
  getById: (id: string): Transaction | null => {
    const transactions = getStorageData<Transaction>(STORAGE_KEYS.transactions);
    return transactions.find(transaction => transaction.id === id) || null;
  },
  
  create: (data: Omit<Transaction, 'id' | 'owner' | 'invoice' | 'createdAt' | 'updatedAt'>, userId: string): Transaction => {
    const newTransaction: Transaction = {
      ...data,
      id: generateId('transaction'),
      owner: userId,
      invoice: generateInvoiceNumber(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Update inventory quantities
    if (data.type === 'sell') {
      // Decrease quantity for sales
      data.items.forEach(item => {
        const listing = listingService.getById(item.listing);
        if (listing) {
          listingService.update(listing.id, {
            quantity: Math.max(0, listing.quantity - item.quantity)
          });
        }
      });
    } else if (data.type === 'buy') {
      // Increase quantity for purchases
      data.items.forEach(item => {
        const listing = listingService.getById(item.listing);
        if (listing) {
          listingService.update(listing.id, {
            quantity: listing.quantity + item.quantity
          });
        }
      });
    }
    
    // Update party balance
    const party = partyService.getById(data.party);
    if (party) {
      const balanceChange = data.type === 'sell' ? data.totalAmount : -data.totalAmount;
      partyService.update(party.id, {
        balance: party.balance + balanceChange
      });
    }
    
    const transactions = getStorageData<Transaction>(STORAGE_KEYS.transactions);
    const updatedTransactions = [...transactions, newTransaction];
    setStorageData(STORAGE_KEYS.transactions, updatedTransactions);
    
    return newTransaction;
  },
  
  update: (id: string, data: Partial<Transaction>): Transaction | null => {
    const transactions = getStorageData<Transaction>(STORAGE_KEYS.transactions);
    const index = transactions.findIndex(transaction => transaction.id === id);
    
    if (index === -1) return null;
    
    const updatedTransaction = {
      ...transactions[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    
    transactions[index] = updatedTransaction;
    setStorageData(STORAGE_KEYS.transactions, transactions);
    
    return updatedTransaction;
  },
  
  delete: (id: string): boolean => {
    const transactions = getStorageData<Transaction>(STORAGE_KEYS.transactions);
    const filteredTransactions = transactions.filter(transaction => transaction.id !== id);
    
    if (filteredTransactions.length === transactions.length) return false;
    
    setStorageData(STORAGE_KEYS.transactions, filteredTransactions);
    return true;
  },
};