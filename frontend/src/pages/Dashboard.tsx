import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  Package,
  Users,
  TrendingUp,
  AlertTriangle,
  ShoppingCart,
  Eye,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { listingService, partyService, transactionService, seedData } from "@/lib/storage";
import { Listing, Party, Transaction, DashboardStats } from "@/types/schemas";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    totalPurchases: 0,
    netProfit: 0,
    totalListings: 0,
    totalParties: 0,
    lowStockCount: 0,
    pendingTransactions: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [lowStockItems, setLowStockItems] = useState<Listing[]>([]);

  useEffect(() => {
    if (!user) return;

    // Seed data for new user
    seedData(user.id);

    // Fetch data
    const listings = listingService.getAll(user.id);
    const parties = partyService.getAll(user.id);
    const transactions = transactionService.getAll(user.id);

    // Calculate stats
    const completedTransactions = transactions.filter(t => t.paymentStatus === 'completed');
    const totalSales = completedTransactions
      .filter(t => t.type === 'sell')
      .reduce((sum, t) => sum + t.totalAmount, 0);
    const totalPurchases = completedTransactions
      .filter(t => t.type === 'buy')
      .reduce((sum, t) => sum + t.totalAmount, 0);
    
    const lowStock = listings.filter(l => l.quantity <= 10);
    const pendingTxns = transactions.filter(t => t.paymentStatus === 'pending');

    setStats({
      totalSales,
      totalPurchases,
      netProfit: totalSales - totalPurchases,
      totalListings: listings.length,
      totalParties: parties.length,
      lowStockCount: lowStock.length,
      pendingTransactions: pendingTxns.length,
    });

    // Set recent transactions (last 5)
    const recent = transactions
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
    setRecentTransactions(recent);

    // Set low stock items
    setLowStockItems(lowStock.slice(0, 5));
  }, [user]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}! Here's your business overview.
        </p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-gradient shadow-custom">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {formatCurrency(stats.totalSales)}
            </div>
            <p className="text-xs text-muted-foreground">
              From completed transactions
            </p>
          </CardContent>
        </Card>

        <Card className="card-gradient shadow-custom">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.netProfit >= 0 ? 'text-success' : 'text-destructive'}`}>
              {formatCurrency(stats.netProfit)}
            </div>
            <p className="text-xs text-muted-foreground">
              Sales minus purchases
            </p>
          </CardContent>
        </Card>

        <Card className="card-gradient shadow-custom">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.totalListings}</div>
            <p className="text-xs text-muted-foreground">
              In inventory system
            </p>
          </CardContent>
        </Card>

        <Card className="card-gradient shadow-custom">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {stats.lowStockCount}
            </div>
            <p className="text-xs text-muted-foreground">
              Items need restocking
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <Card className="shadow-custom">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Transactions
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No transactions yet. Create your first transaction!
                </p>
              ) : (
                recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <Badge
                          variant={transaction.type === "sell" ? "default" : "secondary"}
                          className={transaction.type === "sell" ? "bg-success text-success-foreground" : ""}
                        >
                          {transaction.type === "sell" ? "Sale" : "Purchase"}
                        </Badge>
                        <span className="font-medium">{transaction.partyName}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {transaction.items.map(item => item.listingName).join(", ")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(transaction.date)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${
                        transaction.type === "sell" ? "text-success" : "text-primary"
                      }`}>
                        {transaction.type === "sell" ? "+" : "-"}{formatCurrency(transaction.totalAmount)}
                      </div>
                      <Badge
                        variant={transaction.paymentStatus === "completed" ? "default" : "outline"}
                        className={transaction.paymentStatus === "completed" ? "bg-success text-success-foreground text-xs" : "text-xs"}
                      >
                        {transaction.paymentStatus}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card className="shadow-custom">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-warning">
              <span className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Low Stock Alerts
              </span>
              <Button variant="outline" size="sm">
                Manage Inventory
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockItems.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  All items are well stocked!
                </p>
              ) : (
                lowStockItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-warning/20 bg-warning/5 hover:bg-warning/10 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <p className="text-sm text-muted-foreground">
                        SKU: {item.sku}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Type: {item.type}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-warning">
                        {item.quantity} left
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(item.price)} each
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}