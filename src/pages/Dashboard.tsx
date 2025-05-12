import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import DashboardNav from "@/components/DashboardNav";
import axios from "axios";
import { Student, Fee, Payment } from "@/types";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalFees: 0,
    totalArrears: 0,
    collectionRate: 0
  });
  const [recentStudents, setRecentStudents] = useState<Student[]>([]);
  const [recentFees, setRecentFees] = useState<Fee[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Manually fetch each endpoint
      const [studentsResponse, feesResponse, paymentsResponse] = await Promise.all([
        axios.get("http://localhost:5000/api/students"),
        axios.get("http://localhost:5000/api/fees"),
        axios.get("http://localhost:5000/api/payments/stats")
      ]);

      const students = studentsResponse.data || [];
      const fees = feesResponse.data || [];
      const payments = paymentsResponse.data || [];

      // Calculate statistics
      const totalStudents = students.length;
      const totalFees = fees.reduce((sum: number, fee: Fee) => sum + fee.amount, 0);
      const totalPaid = payments.total_amount || 0;
      const totalArrears = totalFees - totalPaid;
      const collectionRate = totalFees > 0 ? (totalPaid / totalFees) * 100 : 0;

      setStats({
        totalStudents,
        totalFees,
        totalArrears,
        collectionRate
      });

      // Get recent students (last 5)
      setRecentStudents([...students]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5));

      // Get recent fees (last 5)
      setRecentFees([...fees]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5));

    } catch (error: any) {
      console.error("Dashboard error:", error);
      toast.error(error.response?.data?.error || error.message || "Failed to fetch dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardNav />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="animate-pulse text-2xl font-medium">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStudents}</div>
              <p className="text-xs text-muted-foreground">Currently enrolled</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Fees</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalFees.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">All outstanding fees</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Arrears</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalArrears.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Unpaid balances</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.collectionRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                {stats.collectionRate > 75 ? "Good" : "Needs improvement"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Students */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Students</CardTitle>
              <Link to="/students">
                <Button variant="ghost" size="sm" className="gap-1">
                  View All <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentStudents.length > 0 ? (
              <div className="space-y-4">
                {recentStudents.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">{student.name || `${student.first_name} ${student.last_name}`}</p>
                      <p className="text-sm text-muted-foreground">
                        {student.email || student.student_id}
                      </p>
                    </div>
                    <Link to={`/students/${student.id}`}>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">No students found</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Fees */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Fees</CardTitle>
              <Link to="/fees">
                <Button variant="ghost" size="sm" className="gap-1">
                  View All <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentFees.length > 0 ? (
              <div className="space-y-4">
                {recentFees.map((fee) => (
                  <div key={fee.id} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">${fee.amount.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">
                        Due: {new Date(fee.due_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        fee.status === 'paid' ? 'bg-green-100 text-green-800' :
                        fee.status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {fee.status?.charAt(0).toUpperCase() + fee.status?.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">No fees found</p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;