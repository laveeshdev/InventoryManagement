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

// Mock data - will be replaced with actual API calls
const mockData = {
  salesSummary: {
    totalSales: 45231.89,
    monthlyGrowth: 12.5,
    totalOrders: 1234,
    avgOrderValue: 36.71,
  },
  recentTransactions: [
    {
      id: "TXN001",
      type: "sale",
      party: "ABC Corporation",
      amount: 1250.00,
      date: "2024-01-15",
      products: ["Product A", "Product B"],
    },
    {
      id: "TXN002", 
      type: "purchase",
      party: "XYZ Suppliers",
      amount: 850.00,
      date: "2024-01-15",
      products: ["Raw Material C"],
    },
    {
      id: "TXN003",
      type: "sale",
      party: "DEF Industries",
      amount: 2100.00,
      date: "2024-01-14",
      products: ["Product D", "Product E", "Product F"],
    },
  ],
  lowStockAlerts: [
    { id: 1, name: "Product A", sku: "SKU001", quantity: 5, minStock: 20 },
    { id: 2, name: "Raw Material B", sku: "SKU045", quantity: 2, minStock: 15 },
    { id: 3, name: "Product C", sku: "SKU023", quantity: 8, minStock: 25 },
  ],
};

export default function Dashboard() {
  const [data, setData] = useState(mockData);

  // TODO: Replace with actual API calls
  useEffect(() => {
    // Simulate API call
    const fetchDashboardData = async () => {
      // This will be replaced with actual API endpoints
      setData(mockData);
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your business performance and key metrics
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
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(data.salesSummary.totalSales)}
            </div>
            <p className="text-xs text-success flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{data.salesSummary.monthlyGrowth}% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="card-gradient shadow-custom">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {data.salesSummary.totalOrders.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(data.salesSummary.avgOrderValue)} avg. order value
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
              {data.lowStockAlerts.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Items need restocking
            </p>
          </CardContent>
        </Card>

        <Card className="card-gradient shadow-custom">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">247</div>
            <p className="text-xs text-muted-foreground">
              In inventory system
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
              {data.recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <Badge
                        variant={transaction.type === "sale" ? "default" : "secondary"}
                        className={transaction.type === "sale" ? "bg-success" : ""}
                      >
                        {transaction.type === "sale" ? "Sale" : "Purchase"}
                      </Badge>
                      <span className="font-medium">{transaction.party}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {transaction.products.join(", ")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${
                      transaction.type === "sale" ? "text-success" : "text-primary"
                    }`}>
                      {transaction.type === "sale" ? "+" : "-"}{formatCurrency(transaction.amount)}
                    </div>
                  </div>
                </div>
              ))}
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
              {data.lowStockAlerts.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-warning/20 bg-warning/5 hover:bg-warning/10 transition-colors"
                >
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <p className="text-sm text-muted-foreground">
                      SKU: {item.sku}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-warning">
                      {item.quantity} left
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Min: {item.minStock}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}