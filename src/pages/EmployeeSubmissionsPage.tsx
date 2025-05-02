
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Search } from "lucide-react";

// Mock data for employee submissions
const mockSubmissions = [
  {
    id: "1",
    employee: { id: "1", name: "Ahmed Al-Sabah", department: "IT" },
    mobileNumber: "965-5555-1234",
    submittedDate: "2023-04-25T14:30:00",
    exported: true,
  },
  {
    id: "2",
    employee: { id: "2", name: "Fatima Al-Ahmed", department: "Finance" },
    mobileNumber: "965-5555-5678",
    submittedDate: "2023-04-26T10:15:00",
    exported: false,
  },
  {
    id: "3",
    employee: { id: "3", name: "Mohammed Al-Rashid", department: "HR" },
    mobileNumber: "965-5555-9876",
    submittedDate: "2023-04-27T09:45:00",
    exported: false,
  },
  {
    id: "4",
    employee: { id: "4", name: "Sara Al-Mutawa", department: "Marketing" },
    mobileNumber: "965-5555-4321",
    submittedDate: "2023-04-28T16:20:00",
    exported: false,
  },
];

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(date);
};

const EmployeeSubmissionsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredSubmissions = mockSubmissions.filter(submission => {
    const searchLower = searchTerm.toLowerCase();
    return (
      submission.employee.name.toLowerCase().includes(searchLower) ||
      submission.employee.department.toLowerCase().includes(searchLower) ||
      submission.mobileNumber.includes(searchTerm)
    );
  });
  
  const handleExportToExcel = () => {
    console.log("Exporting to Excel...");
    // Implementation would be added here
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Employee Mobile Submissions</h2>
        <p className="text-muted-foreground">
          Track mobile numbers submitted by employees for follow-up
        </p>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, department, or number..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Button 
          onClick={handleExportToExcel}
          className="bg-kpc-purple hover:bg-kpc-light-purple"
        >
          Export to Excel
        </Button>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Mobile Number</TableHead>
              <TableHead>Submitted Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubmissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  No submissions found
                </TableCell>
              </TableRow>
            ) : (
              filteredSubmissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell className="font-medium">{submission.employee.name}</TableCell>
                  <TableCell>{submission.employee.department}</TableCell>
                  <TableCell>{submission.mobileNumber}</TableCell>
                  <TableCell>{formatDate(submission.submittedDate)}</TableCell>
                  <TableCell>
                    {submission.exported ? (
                      <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                        Exported
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">
                        Pending
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default EmployeeSubmissionsPage;
