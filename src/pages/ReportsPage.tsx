
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { toast } from "sonner";

// Mock data for charts
const monthlyData = [
  { month: "Jan", requests: 12, approved: 10, rejected: 2 },
  { month: "Feb", requests: 15, approved: 13, rejected: 2 },
  { month: "Mar", requests: 18, approved: 15, rejected: 3 },
  { month: "Apr", requests: 22, approved: 20, rejected: 2 },
  { month: "May", requests: 28, approved: 25, rejected: 3 },
  { month: "Jun", requests: 30, approved: 28, rejected: 2 },
];

const departmentData = [
  { name: "IT", value: 25, color: "#9b87f5" },
  { name: "Finance", value: 18, color: "#6E59A5" },
  { name: "HR", value: 12, color: "#E5DEFF" },
  { name: "Marketing", value: 15, color: "#8E9196" },
  { name: "Operations", value: 20, color: "#F1F0FB" },
];

const statusData = [
  { name: "Approved", value: 110, color: "#4CAF50" },
  { name: "Pending", value: 15, color: "#FFC107" },
  { name: "Rejected", value: 14, color: "#F44336" },
];

const topRequestersData = [
  { name: "Abdullah Al-Mansour", department: "IT", count: 8 },
  { name: "Maryam Al-Kazemi", department: "Finance", count: 7 },
  { name: "Jassim Al-Ali", department: "Operations", count: 6 },
  { name: "Laila Al-Sabah", department: "Marketing", count: 5 },
  { name: "Khalid Al-Mutawa", department: "HR", count: 4 },
];

const ReportsPage = () => {
  const [timeframe, setTimeframe] = useState("6months");
  
  const handleExport = (reportType: string) => {
    toast.success(`${reportType} report exported successfully!`);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold mb-2">Reports & Analytics</h2>
          <p className="text-muted-foreground">
            View statistics and export reports for the Thank You Card System
          </p>
        </div>
        
        <div className="w-48">
          <Select defaultValue={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger>
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">139</div>
            <p className="text-xs text-muted-foreground mt-1">+23% from last period</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Approval Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground mt-1">+5% from last period</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg. Processing Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1.8 days</div>
            <p className="text-xs text-muted-foreground mt-1">-0.5 days from last period</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Mobile Submission Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground mt-1">+12% from last period</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trend">
        <TabsList>
          <TabsTrigger value="trend">Request Trends</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="top">Top Requesters</TabsTrigger>
        </TabsList>
        
        <TabsContent value="trend" className="pt-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between">
                <CardTitle>Monthly Card Request Trend</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleExport('Trend')}
                >
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="requests" fill="#9b87f5" name="Total Requests" />
                    <Bar dataKey="approved" fill="#4CAF50" name="Approved" />
                    <Bar dataKey="rejected" fill="#F44336" name="Rejected" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="distribution" className="pt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between">
                  <CardTitle>Department Distribution</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleExport('Department')}
                  >
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={departmentData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {departmentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex justify-between">
                  <CardTitle>Status Distribution</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleExport('Status')}
                  >
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="top" className="pt-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between">
                <CardTitle>Top 5 Requesters</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleExport('Requesters')}
                >
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topRequestersData.map((requester, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-kpc-light-purple flex items-center justify-center text-white mr-3">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{requester.name}</div>
                      <div className="text-sm text-muted-foreground">{requester.department}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{requester.count}</div>
                      <div className="text-xs text-muted-foreground">Cards</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsPage;
