import { useState } from "react";
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
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Filter, ArrowLeftRight, TrendingUp, TrendingDown } from "lucide-react";

// Mock data
const mockTransactions = [
  {
    id: "TXN001",
    type: "sale",
    party: "ABC Corporation",
    products: [
      { name: "Product A", quantity: 10, price: 29.99 },
      { name: "Product B", quantity: 5, price: 15.50 }
    ],
    totalAmount: 377.40,
    date: "2024-01-15T10:30:00",
    status: "completed",
  },
  {
    id: "TXN002",
    type: "purchase",
    party: "XYZ Suppliers",
    products: [
      { name: "Raw Material C", quantity: 100, price: 8.50 }
    ],
    totalAmount: 850.00,
    date: "2024-01-15T14:20:00",
    status: "completed",
  },
    {
      id: "TXN003",
      type: "sale",
      party: "DEF Industries",
      products: [
        { name: "Product D", quantity: 20, price: 45.00 },
        { name: "Product E", quantity: 15, price: 32.50 },
        { name: "Product F", quantity: 8, price: 75.00 }
      ],
      totalAmount: 2087.50,
      date: "2024-01-14T16:45:00",
      status: "pending",
    },
];

export default function Transactions() {
  const [transactions, setTransactions] = useState(mockTransactions);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = 
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.party.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || transaction.type === filterType;
    return matchesSearch && matchesType;
  });

  const getTypeBadge = (type: string) => {
    if (type === "sale") {
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
    return new Date(dateString).toLocaleString();
  };

  const totalSales = transactions
    .filter(t => t.type === "sale" && t.status === "completed")
    .reduce((sum, t) => sum + t.totalAmount, 0);

  const totalPurchases = transactions
    .filter(t => t.type === "purchase" && t.status === "completed")
    .reduce((sum, t) => sum + t.totalAmount, 0);

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
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              New Transaction
            </Button>
          </DialogTrigger>
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
              From {transactions.filter(t => t.type === "sale").length} transactions
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
              From {transactions.filter(t => t.type === "purchase").length} transactions
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
                  <SelectItem value="sale">Sales</SelectItem>
                  <SelectItem value="purchase">Purchases</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Party</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id} className="hover:bg-muted/50">
                  <TableCell className="font-mono text-sm">{transaction.id}</TableCell>
                  <TableCell>
                    {getTypeBadge(transaction.type)}
                  </TableCell>
                  <TableCell className="font-medium">{transaction.party}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {transaction.products.slice(0, 2).map(p => p.name).join(", ")}
                      {transaction.products.length > 2 && ` +${transaction.products.length - 2} more`}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`font-bold ${
                      transaction.type === "sale" ? "text-success" : "text-accent"
                    }`}>
                      {transaction.type === "sale" ? "+" : "-"}{formatCurrency(transaction.totalAmount)}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm">{formatDate(transaction.date)}</TableCell>
                  <TableCell>
                    {getStatusBadge(transaction.status)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}