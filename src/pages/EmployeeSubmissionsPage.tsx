
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download } from "lucide-react";
import { toast } from "sonner";

interface MobileSubmission {
  id: string;
  employee: string;
  department: string;
  mobileNumber: string;
  submittedDate: string;
  status: "Exported" | "Pending";
}

const mockSubmissions: MobileSubmission[] = [
  {
    id: "1",
    employee: "Ahmed Al-Sabah",
    department: "IT",
    mobileNumber: "965-5555-1234",
    submittedDate: "Apr 25, 2023 at 2:30 PM",
    status: "Exported",
  },
  {
    id: "2",
    employee: "Fatima Al-Ahmed",
    department: "Finance",
    mobileNumber: "965-5555-5678",
    submittedDate: "Apr 26, 2023 at 10:15 AM",
    status: "Pending",
  },
  {
    id: "3",
    employee: "Mohammed Al-Rashid",
    department: "HR",
    mobileNumber: "965-5555-9876",
    submittedDate: "Apr 27, 2023 at 9:45 AM",
    status: "Pending",
  },
  {
    id: "4",
    employee: "Sara Al-Mutawa",
    department: "Marketing",
    mobileNumber: "965-5555-4321",
    submittedDate: "Apr 28, 2023 at 4:20 PM",
    status: "Pending",
  },
];

export default function EmployeeSubmissionsPage() {
  const [submissions, setSubmissions] = useState(mockSubmissions);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSubmissions = submissions
    .filter((submission) =>
      submission.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.mobileNumber.includes(searchQuery)
    )
    .sort((a, b) => {
      // Convert date strings to Date objects for proper sorting
      const dateA = new Date(a.submittedDate);
      const dateB = new Date(b.submittedDate);
      return dateB.getTime() - dateA.getTime(); // Descending order (newest first)
    });

  const handleExportToExcel = () => {
    // Create CSV content
    const headers = ["Employee", "Department", "Mobile Number", "Submitted Date", "Status"];
    const csvContent = [
      headers.join(","),
      ...submissions.map(submission => [
        submission.employee,
        submission.department,
        submission.mobileNumber,
        submission.submittedDate,
        submission.status
      ].join(","))
    ].join("\n");

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `mobile_submissions_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Mobile submissions exported to Excel!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Employee Mobile Submissions</h1>
        <p className="text-gray-600 mt-2">Track mobile numbers submitted by employees for follow-up</p>
      </div>

      <div className="flex items-center justify-between">
        <Input
          type="search"
          placeholder="Search by name, department, or number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
        <Button onClick={handleExportToExcel} className="bg-purple-600 hover:bg-purple-700">
          <Download className="w-4 h-4 mr-2" />
          Export to Excel
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mobile Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSubmissions.map((submission) => (
                  <tr key={submission.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{submission.employee}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{submission.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{submission.mobileNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{submission.submittedDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        className={
                          submission.status === "Exported"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {submission.status}
                      </Badge>
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
