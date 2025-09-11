import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { 
  Plus, Search, Filter, ArrowLeftRight, TrendingUp, TrendingDown, 
  Loader2, Eye, AlertCircle 
} from "lucide-react";
import { transactionApi, partyApi, productApi } from "@/lib/api";

interface TransactionItem {
  listing: string; // productId
  productName?: string;
  quantity: number;
  amount: number; // price
  _id: string;
}

interface Transaction {
  _id: string;
  invoice: string;
  type: 'sell' | 'buy';
  party: string; // partyId
  partyName?: string;
  items: TransactionItem[];
  totalAmount: number;
  date: string;
  paymentStatus: 'pending' | 'completed' | 'cancelled';
  remarks?: string;
}

interface Party {
  _id: string;
  name: string;
  type: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function Transactions() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [parties, setParties] = useState<Party[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    // Fetch transactions, parties and products
    const fetchData = async () => {
      setLoading(true);
      try {
        const [transactionsRes, partiesRes, productsRes] = await Promise.all([
          transactionApi.getAll(),
          partyApi.getAll(),
          productApi.getAll()
        ]);
        
        // Process transactions to add party names and product details
        console.log('Parties response:', partiesRes.data);
        console.log('Products response:', productsRes.data);
        console.log('Transactions response:', transactionsRes.data);
        
        const partiesData = Array.isArray(partiesRes.data.parties) ? partiesRes.data.parties : 
                           Array.isArray(partiesRes.data) ? partiesRes.data : [];
        const productsData = Array.isArray(productsRes.data.data) ? productsRes.data.data : 
                            Array.isArray(productsRes.data) ? productsRes.data : [];
        
        // Ensure transactionsData is always an array
        const rawTransactionsData = transactionsRes.data.transactions;
        let transactionsData = Array.isArray(rawTransactionsData) ? rawTransactionsData : [];
        
        // Store parties and products for use in forms
        setParties(partiesData);
        setProducts(productsData);
        
        // Enhance transaction data with party and product names
        transactionsData = transactionsData.map(transaction => {
          // Find party name - transaction.party is the party ID string
          const party = partiesData.find(p => p._id === transaction.party);
          
          // Check if items is an array before mapping
          const items = Array.isArray(transaction.items) ? transaction.items : [];
          
          // Enhance items with names
          const enhancedItems = items.map(item => {
            const productDetail = productsData.find(p => p._id === item.listing);
            return {
              ...item,
              productName: productDetail ? productDetail.name : 'Unknown Product'
            };
          });
          
          return {
            ...transaction,
            partyName: party ? party.name : 'Unknown Party',
            items: enhancedItems
          };
        });
        
        setTransactions(transactionsData);
        
        toast({
          title: "Success",
          description: `Loaded ${transactionsData.length} transactions.`
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load transactions. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);

  // Ensure transactions is an array before filtering
  const transactionsArray = Array.isArray(transactions) ? transactions : [];
  
  const filteredTransactions = transactionsArray.filter((transaction) => {
    const matchesSearch = 
      (transaction.invoice?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      ((transaction.partyName?.toLowerCase().includes(searchTerm.toLowerCase())) || false);
    const matchesType = filterType === "all" || transaction.type === filterType;
    return matchesSearch && matchesType;
  });

  const getTypeBadge = (type: string) => {
    if (type === "sell") {
      return (
        <Badge className="bg-success text-success-foreground">
          <TrendingUp className="h-3 w-3 mr-1" />
          Sale
        </Badge>
      );
    }
    return (
      <Badge className="bg-accent text-accent-foreground">
        <TrendingDown className="h-3 w-3 mr-1" />
        Purchase
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    if (status === "completed") {
      return <Badge className="bg-success text-success-foreground">Completed</Badge>;
    }
    if (status === "pending") {
      return <Badge className="bg-warning text-warning-foreground">Pending</Badge>;
    }
    return <Badge variant="outline">Draft</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Invalid Date";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    return date.toLocaleDateString();
  };
  
  // View transaction details
  const viewTransactionDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDetailsDialogOpen(true);
  };

  const totalSales = Array.isArray(transactions) ? 
    transactions
      .filter(t => t.type === "sell" && t.paymentStatus === "completed")
      .reduce((sum, t) => sum + t.totalAmount, 0)
    : 0;

  const totalPurchases = Array.isArray(transactions) ?
    transactions
      .filter(t => t.type === "buy" && t.paymentStatus === "completed")
      .reduce((sum, t) => sum + t.totalAmount, 0)
    : 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Transactions</h1>
          <p className="text-muted-foreground">
            Manage your sales and purchase transactions
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <Button className="bg-gradient-primary" onClick={() => navigate("/transactions/add")}>
            <Plus className="h-4 w-4 mr-2" />
            New Transaction
          </Button>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Transaction</DialogTitle>
              <DialogDescription>
                Create a new sale or purchase transaction.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="transaction-type">Transaction Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sale">Sale</SelectItem>
                      <SelectItem value="purchase">Purchase</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="transaction-party">Party</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select party" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="abc-corp">ABC Corporation</SelectItem>
                      <SelectItem value="xyz-suppliers">XYZ Suppliers</SelectItem>
                      <SelectItem value="def-industries">DEF Industries</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label>Products</Label>
                <div className="border rounded-md p-4 bg-muted/20">
                  <div className="grid grid-cols-4 gap-2 mb-2 text-sm font-medium">
                    <span>Product</span>
                    <span>Quantity</span>
                    <span>Price</span>
                    <span>Actions</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <Select>
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="product-a">Product A</SelectItem>
                        <SelectItem value="product-b">Product B</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input className="h-8" type="number" placeholder="Qty" />
                    <Input className="h-8" type="number" step="0.01" placeholder="Price" />
                    <Button size="sm" variant="outline">Add</Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsAddDialogOpen(false)}>
                Create Transaction
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-custom">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{formatCurrency(totalSales)}</div>
            <p className="text-xs text-muted-foreground">
              From {Array.isArray(transactions) ? transactions.filter(t => t.type === "sell").length : 0} transactions
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-custom">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
            <TrendingDown className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{formatCurrency(totalPurchases)}</div>
            <p className="text-xs text-muted-foreground">
              From {Array.isArray(transactions) ? transactions.filter(t => t.type === "buy").length : 0} transactions
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-custom">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <ArrowLeftRight className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(totalSales - totalPurchases)}
            </div>
            <p className="text-xs text-muted-foreground">
              Sales minus purchases
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card className="shadow-custom">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Transactions</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="sell">Sales</SelectItem>
                  <SelectItem value="buy">Purchases</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
              <span className="text-muted-foreground">Loading transactions...</span>
            </div>
          ) : !transactions.length? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No transactions found</h3>
              <p className="text-muted-foreground mt-1 mb-4">
                You haven't made any transactions yet.
              </p>
              <Button onClick={() => navigate("/transactions/add")} className="bg-gradient-primary">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Transaction
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Party</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]">View</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction._id} className="hover:bg-muted/50">
                    <TableCell className="font-mono text-sm">{transaction.invoice}</TableCell>
                    <TableCell>
                      {getTypeBadge(transaction.type)}
                    </TableCell>
                    <TableCell className="font-medium">{transaction.partyName}</TableCell>
                    <TableCell>
                      <span className={`font-bold ${
                        transaction.type === "sell" ? "text-success" : "text-accent"
                      }`}>
                        {transaction.type === "sell" ? "+" : "-"}{formatCurrency(transaction.totalAmount)}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">{formatDate(transaction.date)}</TableCell>
                    <TableCell>
                      {getStatusBadge(transaction.paymentStatus)}
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => viewTransactionDetails(transaction)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      {/* Transaction Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedTransaction && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  Transaction Details
                  <span className="ml-2 text-sm font-mono text-muted-foreground">
                    #{selectedTransaction.invoice}
                  </span>
                </DialogTitle>
                <DialogDescription>
                  {formatDate(selectedTransaction.date)}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-1">Transaction Type</h3>
                    <div>{getTypeBadge(selectedTransaction.type)}</div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Status</h3>
                    <div>{getStatusBadge(selectedTransaction.paymentStatus)}</div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-1">Party</h3>
                  <div className="text-lg">{selectedTransaction.partyName}</div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Products</h3>
                  <div className="border rounded-md overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead className="text-right">Quantity</TableHead>
                          <TableHead className="text-right">Price</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedTransaction.items.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.productName}</TableCell>
                            <TableCell className="text-right">{item.quantity}</TableCell>
                            <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(item.quantity * item.amount)}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={3} className="text-right font-medium">Total Amount:</TableCell>
                          <TableCell className="text-right font-bold">{formatCurrency(selectedTransaction.totalAmount)}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
                
                {selectedTransaction.remarks && (
                  <div>
                    <h3 className="font-medium mb-1">Notes</h3>
                    <div className="text-muted-foreground">{selectedTransaction.remarks}</div>
                  </div>
                )}
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}