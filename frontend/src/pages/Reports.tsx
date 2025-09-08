import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  DollarSign,
  Package,
  ArrowUpDown,
} from "lucide-react";

// Mock data for reports
const mockReportData = {
  salesSummary: {
    totalSales: 125847.50,
    totalOrders: 423,
    avgOrderValue: 297.28,
    growth: 18.5,
  },
  purchaseSummary: {
    totalPurchases: 67234.20,
    totalOrders: 156,
    avgOrderValue: 431.12,
    growth: 12.3,
  },
  inventoryMovement: {
    itemsSold: 2847,
    itemsPurchased: 1923,
    netMovement: 924,
    turnoverRate: 2.4,
  },
  topProducts: [
    { name: "Premium Widget A", sales: 15600, units: 520 },
    { name: "Deluxe Assembly C", sales: 12800, units: 142 },
    { name: "Standard Component B", sales: 9400, units: 606 },
    { name: "Basic Tool D", sales: 7200, units: 588 },
  ],
  monthlyTrends: [
    { month: "Jan", sales: 32400, purchases: 18900 },
    { month: "Feb", sales: 28600, purchases: 16200 },
    { month: "Mar", sales: 35200, purchases: 20100 },
    { month: "Apr", sales: 29800, purchases: 17300 },
  ],
};

export default function Reports() {
  const [dateRange, setDateRange] = useState("last_month");
  const [reportType, setReportType] = useState("summary");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const generateReport = () => {
    // TODO: Implement actual report generation
    console.log(`Generating ${reportType} report for ${dateRange}`);
  };

  const exportReport = (format: string) => {
    // TODO: Implement report export
    console.log(`Exporting report as ${format}`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports</h1>
          <p className="text-muted-foreground">
            Generate business insights and analytics
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => exportReport('pdf')}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={() => exportReport('csv')}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Report Filters */}
      <Card className="shadow-custom">
        <CardHeader>
          <CardTitle className="text-lg">Report Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="report-type">Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="summary">Business Summary</SelectItem>
                  <SelectItem value="sales">Sales Report</SelectItem>
                  <SelectItem value="purchases">Purchase Report</SelectItem>
                  <SelectItem value="inventory">Inventory Movement</SelectItem>
                  <SelectItem value="profit">Profit & Loss</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date-range">Date Range</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last_week">Last Week</SelectItem>
                  <SelectItem value="last_month">Last Month</SelectItem>
                  <SelectItem value="last_quarter">Last Quarter</SelectItem>
                  <SelectItem value="last_year">Last Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button onClick={generateReport} className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-custom">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {formatCurrency(mockReportData.salesSummary.totalSales)}
            </div>
            <p className="text-xs text-success flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{mockReportData.salesSummary.growth}% vs last period
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-custom">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
            <DollarSign className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
              {formatCurrency(mockReportData.purchaseSummary.totalPurchases)}
            </div>
            <p className="text-xs text-accent flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{mockReportData.purchaseSummary.growth}% vs last period
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-custom">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gross Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(mockReportData.salesSummary.totalSales - mockReportData.purchaseSummary.totalPurchases)}
            </div>
            <p className="text-xs text-muted-foreground">
              {(((mockReportData.salesSummary.totalSales - mockReportData.purchaseSummary.totalPurchases) / mockReportData.salesSummary.totalSales) * 100).toFixed(1)}% margin
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-custom">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Turnover</CardTitle>
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {mockReportData.inventoryMovement.turnoverRate}x
            </div>
            <p className="text-xs text-muted-foreground">
              {formatNumber(mockReportData.inventoryMovement.itemsSold)} items sold
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card className="shadow-custom">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Top Performing Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockReportData.topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex-1">
                    <div className="font-medium">{product.name}</div>
                    <p className="text-sm text-muted-foreground">
                      {formatNumber(product.units)} units sold
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-success">
                      {formatCurrency(product.sales)}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      #{index + 1}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Trends */}
        <Card className="shadow-custom">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Monthly Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockReportData.monthlyTrends.map((month, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="font-medium">{month.month}</div>
                  <div className="flex items-center space-x-4 text-sm">
                    <div>
                      <span className="text-success font-medium">
                        {formatCurrency(month.sales)}
                      </span>
                      <span className="text-muted-foreground ml-1">sales</span>
                    </div>
                    <div>
                      <span className="text-accent font-medium">
                        {formatCurrency(month.purchases)}
                      </span>
                      <span className="text-muted-foreground ml-1">purchases</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Actions */}
      <Card className="shadow-custom">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-16 flex-col">
              <FileText className="h-6 w-6 mb-2" />
              <span>Download Sales Report</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <Package className="h-6 w-6 mb-2" />
              <span>Inventory Analysis</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <TrendingUp className="h-6 w-6 mb-2" />
              <span>Performance Dashboard</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}