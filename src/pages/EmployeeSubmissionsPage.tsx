
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
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useRef, useEffect } from "react";
import { Search, Download } from "lucide-react";
import { toast } from "sonner";

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
  const [selectedSubmissions, setSelectedSubmissions] = useState<string[]>([]);
  const selectAllRef = useRef<HTMLButtonElement>(null);
  
  const filteredSubmissions = mockSubmissions.filter(submission => {
    const searchLower = searchTerm.toLowerCase();
    return (
      submission.employee.name.toLowerCase().includes(searchLower) ||
      submission.employee.department.toLowerCase().includes(searchLower) ||
      submission.mobileNumber.includes(searchTerm)
    );
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedSubmissions(filteredSubmissions.map(submission => submission.id));
    } else {
      setSelectedSubmissions([]);
    }
  };

  const handleSelectSubmission = (submissionId: string, checked: boolean) => {
    if (checked) {
      setSelectedSubmissions(prev => [...prev, submissionId]);
    } else {
      setSelectedSubmissions(prev => prev.filter(id => id !== submissionId));
    }
  };

  const handleExportSelected = () => {
    if (selectedSubmissions.length === 0) {
      toast.error("Please select submissions to export");
      return;
    }
    
    const selectedData = mockSubmissions.filter(submission => 
      selectedSubmissions.includes(submission.id)
    );
    
    console.log("Exporting selected submissions:", selectedData);
    toast.success(`Exported ${selectedSubmissions.length} submission(s) to Excel`);
    
    // Here you would implement actual Excel export logic
    // For now, we'll just show a success message
  };

  const handleExportAll = () => {
    console.log("Exporting all submissions:", filteredSubmissions);
    toast.success(`Exported ${filteredSubmissions.length} submission(s) to Excel`);
  };

  const isAllSelected = selectedSubmissions.length === filteredSubmissions.length && filteredSubmissions.length > 0;
  const isIndeterminate = selectedSubmissions.length > 0 && selectedSubmissions.length < filteredSubmissions.length;

  // Set indeterminate state on the checkbox
  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]);
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Employee Mobile Submissions</h2>
        <p className="text-muted-foreground">
          Track mobile numbers submitted by employees for follow-up
        </p>
      </div>
      
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, department, or number..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={handleExportSelected}
            disabled={selectedSubmissions.length === 0}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Selected ({selectedSubmissions.length})
          </Button>
          <Button 
            onClick={handleExportAll}
            className="bg-kpc-purple hover:bg-kpc-light-purple flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export All
          </Button>
        </div>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                  ref={selectAllRef}
                />
              </TableHead>
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
                <TableCell colSpan={6} className="text-center py-6">
                  No submissions found
                </TableCell>
              </TableRow>
            ) : (
              filteredSubmissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedSubmissions.includes(submission.id)}
                      onCheckedChange={(checked) => 
                        handleSelectSubmission(submission.id, checked as boolean)
                      }
                    />
                  </TableCell>
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
