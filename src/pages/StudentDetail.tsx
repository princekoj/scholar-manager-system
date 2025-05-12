import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardNav from "@/components/DashboardNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Phone, Mail, Home, Calendar, BookOpen, Edit } from "lucide-react";

interface Student {
  _id: string;
  student_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
  grade?: string;
  date_of_birth?: string;
  gender?: string;
  createdAt?: string;
  updatedAt?: string;
}

const StudentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get student ID from URL params or localStorage
        const studentId = id || localStorage.getItem("selectedStudentId");
        
        if (!studentId) {
          throw new Error("Student ID is missing");
        }

        const response = await axios.get(`http://localhost:5000/api/students/${studentId}`);
        
        if (!response.data) {
          throw new Error("Student data not found");
        }

        setStudent(response.data);
      } catch (err: any) {
        console.error("Error fetching student:", err);
        setError(err.response?.data?.error || err.message || "Failed to load student data");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [id, navigate]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardNav />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="animate-pulse text-2xl font-medium">Loading student data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardNav />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Error Loading Student</h1>
            <p className="mb-4">{error}</p>
            <Link to="/students">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Students List
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardNav />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Student Not Found</h1>
            <p className="mb-4">No student found with ID: {id || localStorage.getItem("selectedStudentId")}</p>
            <Link to="/students">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Students List
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <Link to="/students" className="text-primary hover:text-primary/80 flex items-center text-sm mb-2">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Students
            </Link>
            <h1 className="text-3xl font-bold">{student.first_name} {student.last_name}</h1>
            <div className="flex items-center mt-1">
              <Badge variant="outline" className="mr-2">
                ID: {student.student_id}
              </Badge>
              {student.grade && <Badge variant="outline">Grade {student.grade}</Badge>}
            </div>
          </div>
          
          <Link to={`/students/${student._id}/edit`}>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Edit Student
            </Button>
          </Link>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Student Information</CardTitle>
            <CardDescription>Personal details and information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* ... rest of your card content remains the same ... */}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default StudentDetail;