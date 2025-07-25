import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
} from "lucide-react";
import { Link } from "react-router-dom";

const metrics = [
  {
    title: "Total Items",
    value: "1,247",
    change: "+12%",
    trend: "up",
    icon: Package,
    color: "text-blue-600",
  },
  {
    title: "Low Stock Items",
    value: "23",
    change: "+3",
    trend: "up",
    icon: AlertTriangle,
    color: "text-orange-600",
  },
  {
    title: "Total Value",
    value: "$45,231",
    change: "+8.2%",
    trend: "up",
    icon: DollarSign,
    color: "text-green-600",
  },
  {
    title: "Categories",
    value: "47",
    change: "+2",
    trend: "up",
    icon: BarChart3,
    color: "text-purple-600",
  },
];

const recentActivity = [
  {
    id: 1,
    action: "Added",
    item: 'MacBook Pro 16"',
    qty: 5,
    time: "2 hours ago",
  },
  {
    id: 2,
    action: "Updated",
    item: "iPhone 15 Pro",
    qty: 3,
    time: "4 hours ago",
  },
  {
    id: 3,
    action: "Removed",
    item: "Samsung Galaxy S24",
    qty: 2,
    time: "6 hours ago",
  },
  {
    id: 4,
    action: "Added",
    item: 'Dell Monitor 27"',
    qty: 8,
    time: "1 day ago",
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Monitor your inventory performance and metrics
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link to="/inventory">View Inventory</Link>
          </Button>
          <Button asChild>
            <Link to="/add-item">Add New Item</Link>
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card
              key={metric.title}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {metric.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${metric.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {metric.value}
                </div>
                <div className="flex items-center text-sm mt-1">
                  {metric.trend === "up" ? (
                    <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-600 mr-1" />
                  )}
                  <span
                    className={
                      metric.trend === "up" ? "text-green-600" : "text-red-600"
                    }
                  >
                    {metric.change}
                  </span>
                  <span className="text-gray-500 ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Badge
                    variant={
                      activity.action === "Added"
                        ? "default"
                        : activity.action === "Updated"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {activity.action}
                  </Badge>
                  <div>
                    <p className="font-medium text-gray-900">{activity.item}</p>
                    <p className="text-sm text-gray-500">
                      Quantity: {activity.qty}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4" asChild>
            <Link to="/inventory">View All Activity</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
