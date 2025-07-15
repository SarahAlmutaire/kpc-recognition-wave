import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CardPreview } from "@/components/cards/CardPreview";

// Mock data for employees
const employees = [
  { id: "1", name: "Ahmed Al-Sabah" },
  { id: "2", name: "Fatima Al-Ahmed" },
  { id: "3", name: "Mohammed Al-Rashid" },
  { id: "4", name: "Sara Al-Mutawa" },
  { id: "5", name: "Nasser Al-Salem" },
];

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

const formSchema = z.object({
  employee: z.string({
    required_error: "Please select an employee",
  }),
  reason: z
    .string()
    .min(10, { message: "Reason must be at least 10 characters" })
    .max(500, { message: "Reason cannot exceed 500 characters" }),
});

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

const CombinedPage = () => {
  // Mock state for user quota
  const [quota] = useState({
    used: 1,
    total: 3,
  });

  const [selectedTab, setSelectedTab] = useState("all");
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employee: "",
      reason: "",
    },
  });

  const filteredRequests = selectedTab === "all" 
    ? mockRequests 
    : mockRequests.filter(request => request.status === selectedTab);

  const selectedRequest = mockRequests.find(request => request.id === selectedRequestId);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    toast.success("Thank you card request submitted successfully!");
    console.log(values);
    form.reset();
  };

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

  const remainingQuota = quota.total - quota.used;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Recognition Dashboard</h2>
        <p className="text-muted-foreground">
          Submit new requests and track existing ones
        </p>
      </div>

      <div className="space-y-6">
        {/* New Request Section */}
        <Card>
          <CardHeader>
            <CardTitle>New Thank You Card</CardTitle>
            <p className="text-sm text-muted-foreground">
              Recognize your colleagues for their outstanding work
            </p>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="employee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an employee" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {employees.map((employee) => (
                            <SelectItem key={employee.id} value={employee.id}>
                              {employee.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reason for Recognition</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe why this employee deserves recognition..."
                          className="min-h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Be specific about their achievements and impact
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Yearly Quota: {remainingQuota} out of {quota.total} remaining
                    </span>
                  </div>
                  <Button 
                    type="submit" 
                    disabled={remainingQuota <= 0}
                    className="bg-kpc-purple hover:bg-kpc-light-purple"
                  >
                    Submit Request
                  </Button>
                </div>

                {remainingQuota <= 0 && (
                  <Alert variant="destructive">
                    <AlertTitle>Quota Reached</AlertTitle>
                    <AlertDescription>
                      You've reached your yearly quota for thank you cards. The quota resets at the beginning of each year.
                    </AlertDescription>
                  </Alert>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* My Requests Section */}
        <Card>
          <CardHeader>
            <CardTitle>My Requests</CardTitle>
            <p className="text-sm text-muted-foreground">
              Track and manage your thank you card requests
            </p>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
              </TabsList>
              
              <TabsContent value={selectedTab} className="mt-4">
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {filteredRequests.length === 0 ? (
                    <div className="py-8 text-center">
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
                            <CardTitle className="text-sm font-medium">
                              {request.employee.name}
                            </CardTitle>
                            <StatusBadge status={request.status} />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(request.submittedDate)}
                          </p>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-sm line-clamp-2 mb-3">
                            {request.reason}
                          </p>
                          {request.status === "approved" && (
                            <div className="flex flex-wrap gap-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownloadPDF(request.id);
                                }}
                              >
                                PDF
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
                                  Send
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
          </CardContent>
        </Card>
      </div>

      {selectedRequest && (
        <div className="animate-fade-in">
          <h3 className="text-xl font-semibold mb-4">Card Preview</h3>
          <CardPreview request={selectedRequest} />
        </div>
      )}
    </div>
  );
};

export default CombinedPage;
