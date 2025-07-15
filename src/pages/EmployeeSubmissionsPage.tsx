
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Search, Download, Filter, Eye, CheckCheck } from "lucide-react";
import { toast } from "sonner";

interface Submission {
  id: string;
  employee: string;
  date: string;
  status: "pending" | "approved" | "rejected";
  department: string;
  exportStatus: "ready" | "exported";
}

const mockSubmissions: Submission[] = [
  {
    id: "1",
    employee: "John Doe",
    date: "2024-01-20",
    status: "pending",
    department: "HR",
    exportStatus: "ready",
  },
  {
    id: "2",
    employee: "Jane Smith",
    date: "2024-01-15",
    status: "approved",
    department: "Finance",
    exportStatus: "ready",
  },
  {
    id: "3",
    employee: "Alice Johnson",
    date: "2024-01-10",
    status: "rejected",
    department: "IT",
    exportStatus: "exported",
  },
  {
    id: "4",
    employee: "Bob Williams",
    date: "2024-01-05",
    status: "pending",
    department: "Marketing",
    exportStatus: "ready",
  },
];

export default function EmployeeSubmissionsPage() {
  const [submissions, setSubmissions] = useState(mockSubmissions);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [selectedSubmissions, setSelectedSubmissions] = useState<string[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>(submissions);

  const selectAllRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, filterStatus, submissions]);

  const applyFilters = () => {
    let filtered = submissions;

    if (searchQuery) {
      filtered = filtered.filter((submission) =>
        submission.employee.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((submission) => submission.status === filterStatus);
    }

    setFilteredSubmissions(filtered);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleStatusFilterChange = (value: "all" | "pending" | "approved" | "rejected") => {
    setFilterStatus(value);
  };

  const handleSubmissionSelect = (id: string) => {
    setSelectedSubmissions((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedSubmissions(filteredSubmissions.map((submission) => submission.id));
    } else {
      setSelectedSubmissions([]);
    }
  };

  const handleBulkApprove = () => {
    const updatedSubmissions = submissions.map((submission) => {
      if (selectedSubmissions.includes(submission.id)) {
        return { ...submission, status: "approved" as const };
      }
      return submission;
    });

    setSubmissions(updatedSubmissions);
    setSelectedSubmissions([]);
    toast.success("Selected submissions approved!");
  };

  const handleExportAll = () => {
    // Create CSV content
    const headers = ["Employee", "Date", "Status", "Department", "Export Status"];
    const csvContent = [
      headers.join(","),
      ...submissions.map(submission => [
        submission.employee,
        submission.date,
        submission.status,
        submission.department,
        submission.exportStatus
      ].join(","))
    ].join("\n");

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `employee_submissions_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Update export status
    const updatedSubmissions = submissions.map(submission => ({
      ...submission,
      exportStatus: "exported" as const
    }));
    setSubmissions(updatedSubmissions);
    
    toast.success("All submissions exported to Excel!");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <CardTitle className="text-2xl">Employee Submissions</CardTitle>
        <Button onClick={handleExportAll}>
          <Download className="w-4 h-4 mr-2" />
          Export All to Excel
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          type="search"
          placeholder="Search employee..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="md:w-auto"
        />
        <Select onValueChange={handleStatusFilterChange} defaultValue={filterStatus}>
          <SelectTrigger className="w-full md:w-auto">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle>Employee Submissions</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  ref={selectAllRef}
                  checked={selectedSubmissions.length === filteredSubmissions.length}
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm text-muted-foreground">
                  Select All ({filteredSubmissions.length})
                </span>
              </div>
              {selectedSubmissions.length > 0 && (
                <Button 
                  onClick={handleBulkApprove}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCheck className="w-4 h-4 mr-2" />
                  Approve Selected ({selectedSubmissions.length})
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Export Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSubmissions.map((submission) => (
                  <tr key={submission.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{submission.employee}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{submission.date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        className={
                          submission.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : submission.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {submission.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{submission.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        className={
                          submission.exportStatus === "ready"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {submission.exportStatus === "ready" ? "Ready to Export" : "Exported"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Checkbox
                        checked={selectedSubmissions.includes(submission.id)}
                        onCheckedChange={() => handleSubmissionSelect(submission.id)}
                        id={`submission-${submission.id}`}
                        className="ml-2"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
