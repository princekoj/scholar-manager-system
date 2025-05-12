import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import DashboardNav from "@/components/DashboardNav";
import { AddStudentDialog } from "@/components/AddStudentDialog";
import { Student } from "@/types";
import { studentsAPI } from "@/lib/api";

const Students = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const response = await studentsAPI.getAll();
      setStudents(response);
      setFilteredStudents(response);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to fetch students');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    const filtered = students.filter(student => {
      const searchLower = searchTerm.toLowerCase();
      return (
        student.first_name.toLowerCase().includes(searchLower) ||
        student.last_name.toLowerCase().includes(searchLower) ||
        student.student_id.toLowerCase().includes(searchLower) ||
        student.grade.toLowerCase().includes(searchLower)
      );
    });
    setFilteredStudents(filtered);
  }, [searchTerm, students]);

  const handleAddStudent = (newStudent: Student) => {
    setStudents(prev => [newStudent, ...prev]);
  };

  const handleStudentClick = (studentId: string) => {
    localStorage.setItem("selectedStudentId", studentId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardNav />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="animate-pulse text-2xl font-medium">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Students</h1>
          <Button onClick={() => setIsAddDialogOpen(true)}>Add Student</Button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <Link 
              key={student.id} 
              to={`/students/${student.id}`}
              onClick={() => handleStudentClick(student.id)}
            >
              <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <CardTitle className="flex justify-between items-start">
                    <span>{`${student.first_name} ${student.last_name}`}</span>
                    <span className="text-sm text-muted-foreground">ID: {student.student_id}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Grade:</span> {student.grade}
                    </p>
                    {student.email && (
                      <p className="text-sm">
                        <span className="font-medium">Email:</span> {student.email}
                      </p>
                    )}
                    {student.phone && (
                      <p className="text-sm">
                        <span className="font-medium">Phone:</span> {student.phone}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No students found</p>
          </div>
        )}

        <AddStudentDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onAddStudent={handleAddStudent}
        />
      </main>
    </div>
  );
};

export default Students;