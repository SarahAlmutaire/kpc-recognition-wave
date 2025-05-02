
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { CardPreview } from "@/components/cards/CardPreview";

// Mock data for approval requests
const mockRequests = [
  {
    id: "1",
    requester: { id: "101", name: "Abdullah Al-Mansour", position: "Team Leader" },
    employee: { id: "1", name: "Ahmed Al-Sabah" },
    reason: "For leading the team during the system migration project with exceptional dedication and ensuring zero downtime.",
    status: "pending",
    submittedDate: "2023-05-01T10:30:00",
    approvalSteps: [
      { name: "Junior HR", status: "pending", date: null },
      { name: "Senior HR", status: "pending", date: null },
    ],
    sent: false,
  },
  {
    id: "2",
    requester: { id: "102", name: "Maryam Al-Kazemi", position: "Manager" },
    employee: { id: "3", name: "Mohammed Al-Rashid" },
    reason: "For his outstanding contribution to the quarterly financial report, delivering it ahead of schedule with comprehensive analysis.",
    status: "pending",
    submittedDate: "2023-05-01T15:45:00",
    approvalSteps: [
      { name: "Junior HR", status: "pending", date: null },
      { name: "Senior HR", status: "pending", date: null },
    ],
    sent: false,
  },
  {
    id: "3",
    requester: { id: "103", name: "Jassim Al-Ali", position: "DMD" },
    employee: { id: "4", name: "Sara Al-Mutawa" },
    reason: "For implementing a new process that improved the department's efficiency by 25% and reduced processing time significantly.",
    status: "pending",
    submittedDate: "2023-04-29T08:15:00",
    approvalSteps: [
      { name: "Junior HR", status: "approved", date: "2023-04-30T10:30:00" },
      { name: "Senior HR", status: "pending", date: null },
    ],
    sent: false,
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

const ApprovalsPage = () => {
  const [selectedTab, setSelectedTab] = useState("junior");
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const handleCardSelect = (requestId: string) => {
    setSelectedRequestId(requestId === selectedRequestId ? null : requestId);
  };

  const handleApproveClick = (requestId: string) => {
    setSelectedRequestId(requestId);
    setActionType("approve");
    setDialogOpen(true);
  };

  const handleRejectClick = (requestId: string) => {
    setSelectedRequestId(requestId);
    setActionType("reject");
    setDialogOpen(true);
  };

  const handleConfirmAction = () => {
    if (!selectedRequestId || !actionType) return;

    if (actionType === "approve") {
      toast.success("Request approved successfully!");
    } else {
      toast.success("Request rejected");
    }

    setDialogOpen(false);
    setRejectionReason("");
  };

  const selectedRequest = mockRequests.find(request => request.id === selectedRequestId);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">HR Approvals</h2>
        <p className="text-muted-foreground">
          Manage and process thank you card approval requests
        </p>
      </div>

      <Tabs defaultValue="junior" value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="junior">Junior HR Approval</TabsTrigger>
          <TabsTrigger value="senior">Senior HR Approval</TabsTrigger>
        </TabsList>
        
        <TabsContent value={selectedTab} className="pt-4">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              {mockRequests.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">No pending approval requests</p>
                </div>
              ) : (
                mockRequests.map((request) => (
                  <Card 
                    key={request.id} 
                    className={`cursor-pointer ${selectedRequestId === request.id ? 'border-kpc-purple ring-1 ring-kpc-purple' : ''}`}
                    onClick={() => handleCardSelect(request.id)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-md font-medium">
                            {request.employee.name}
                          </CardTitle>
                          <p className="text-xs text-muted-foreground">
                            Requested by: {request.requester.name} ({request.requester.position})
                          </p>
                        </div>
                        <div className="flex flex-col items-end">
                          <StatusBadge status={request.status} />
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDate(request.submittedDate)}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm line-clamp-3 mb-4">
                        {request.reason}
                      </p>
                      <div className="flex justify-end space-x-2 mt-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRejectClick(request.id);
                          }}
                        >
                          Reject
                        </Button>
                        <Button 
                          size="sm"
                          className="bg-kpc-purple hover:bg-kpc-light-purple" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApproveClick(request.id);
                          }}
                        >
                          {selectedTab === "junior" ? "Approve & Forward" : "Approve"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {selectedRequest && (
              <div className="animate-fade-in">
                <h3 className="text-xl font-semibold mb-4">Card Preview</h3>
                <CardPreview request={selectedRequest} />
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve" 
                ? selectedTab === "junior" 
                  ? "Approve and Forward to Senior HR" 
                  : "Approve Thank You Card" 
                : "Reject Thank You Card"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "approve" 
                ? "This will move the request to the next approval stage." 
                : "Please provide a reason for rejection."}
            </DialogDescription>
          </DialogHeader>

          {actionType === "reject" && (
            <Textarea 
              placeholder="Enter reason for rejection..." 
              value={rejectionReason} 
              onChange={(e) => setRejectionReason(e.target.value)} 
              className="min-h-32"
            />
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmAction}
              disabled={actionType === "reject" && !rejectionReason.trim()}
              className="bg-kpc-purple hover:bg-kpc-light-purple"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApprovalsPage;
