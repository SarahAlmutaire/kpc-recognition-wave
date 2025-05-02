
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CardPreview } from "@/components/cards/CardPreview";

// Mock data for requests
const mockRequests = [
  {
    id: "1",
    employee: { id: "1", name: "Ahmed Al-Sabah" },
    reason: "For leading the team during the system migration project with exceptional dedication and ensuring zero downtime.",
    status: "approved",
    submittedDate: "2023-04-28T10:30:00",
    approvalSteps: [
      { name: "Junior HR", status: "approved", date: "2023-04-29T09:15:00" },
      { name: "Senior HR", status: "approved", date: "2023-04-30T14:20:00" },
    ],
    sent: false,
  },
  {
    id: "2",
    employee: { id: "3", name: "Mohammed Al-Rashid" },
    reason: "For his outstanding contribution to the quarterly financial report, delivering it ahead of schedule with comprehensive analysis.",
    status: "pending",
    submittedDate: "2023-05-01T15:45:00",
    approvalSteps: [
      { name: "Junior HR", status: "approved", date: "2023-05-02T11:10:00" },
      { name: "Senior HR", status: "pending", date: null },
    ],
    sent: false,
  },
  {
    id: "3",
    employee: { id: "4", name: "Sara Al-Mutawa" },
    reason: "For implementing a new process that improved the department's efficiency by 25% and reduced processing time significantly.",
    status: "rejected",
    submittedDate: "2023-04-20T08:15:00",
    approvalSteps: [
      { name: "Junior HR", status: "approved", date: "2023-04-21T10:30:00" },
      { name: "Senior HR", status: "rejected", date: "2023-04-22T16:45:00", reason: "Insufficient details provided" },
    ],
    sent: false,
  },
  {
    id: "4",
    employee: { id: "2", name: "Fatima Al-Ahmed" },
    reason: "For her exceptional client management during the recent project delivery, receiving positive feedback from all stakeholders.",
    status: "approved",
    submittedDate: "2023-04-15T11:20:00",
    approvalSteps: [
      { name: "Junior HR", status: "approved", date: "2023-04-16T09:40:00" },
      { name: "Senior HR", status: "approved", date: "2023-04-17T13:50:00" },
    ],
    sent: true,
  },
];

const StatusBadge = ({ status }: { status: string }) => {
  let variant: "default" | "outline" | "secondary" | "destructive" = "default";
  
  switch (status) {
    case "approved":
      variant = "default";
      break;
    case "pending":
      variant = "secondary";
      break;
    case "rejected":
      variant = "destructive";
      break;
    default:
      variant = "outline";
  }
  
  return (
    <Badge variant={variant} className="capitalize">
      {status}
    </Badge>
  );
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

const MyRequestsPage = () => {
  const [selectedTab, setSelectedTab] = useState("all");
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  const filteredRequests = selectedTab === "all" 
    ? mockRequests 
    : mockRequests.filter(request => request.status === selectedTab);

  const selectedRequest = mockRequests.find(request => request.id === selectedRequestId);

  const handleSendToEmployee = (requestId: string) => {
    toast.success("Thank you card sent to employee successfully!");
    console.log(`Sending request ${requestId} to employee`);
  };

  const handleDownloadPDF = (requestId: string) => {
    toast.success("PDF download started");
    console.log(`Downloading PDF for request ${requestId}`);
  };

  const handleCardSelect = (requestId: string) => {
    setSelectedRequestId(requestId === selectedRequestId ? null : requestId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">My Requests</h2>
        <p className="text-muted-foreground">
          Track and manage your thank you card requests
        </p>
      </div>

      <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="all">All Requests</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        
        <TabsContent value={selectedTab}>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredRequests.length === 0 ? (
              <div className="md:col-span-2 lg:col-span-3 py-8 text-center">
                <p className="text-muted-foreground">No requests found</p>
              </div>
            ) : (
              filteredRequests.map((request) => (
                <Card 
                  key={request.id} 
                  className={`cursor-pointer ${selectedRequestId === request.id ? 'border-kpc-purple ring-1 ring-kpc-purple' : ''}`}
                  onClick={() => handleCardSelect(request.id)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-md font-medium">
                        {request.employee.name}
                      </CardTitle>
                      <StatusBadge status={request.status} />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Submitted on {formatDate(request.submittedDate)}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm line-clamp-3 mb-4">
                      {request.reason}
                    </p>
                    {request.status === "approved" && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadPDF(request.id);
                          }}
                        >
                          Download PDF
                        </Button>
                        {!request.sent && (
                          <Button 
                            size="sm" 
                            className="bg-kpc-purple hover:bg-kpc-light-purple"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSendToEmployee(request.id);
                            }}
                          >
                            Send to Employee
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {selectedRequest && (
        <div className="mt-8 animate-fade-in">
          <h3 className="text-xl font-semibold mb-4">Card Preview</h3>
          <CardPreview request={selectedRequest} />
        </div>
      )}
    </div>
  );
};

export default MyRequestsPage;
