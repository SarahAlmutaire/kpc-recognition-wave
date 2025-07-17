import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Form, 
  FormControl, 
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Plus } from "lucide-react";

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
    employee: "Ahmed Al-Sabah",
    reason: "For leading the team during the system migration project with exceptional dedication and ensuring zero downtime.",
    status: "Approved",
    submittedDate: "Apr 28, 2023",
  },
  {
    id: "2",
    employee: "Mohammed Al-Rashid",
    reason: "For his outstanding contribution to the quarterly financial report, delivering it ahead of schedule with comprehensive analysis.",
    status: "Pending",
    submittedDate: "May 1, 2023",
  },
  {
    id: "3",
    employee: "Sara Al-Mutawa",
    reason: "For implementing a new process that improved the department's efficiency by 25% and reduced processing time significantly.",
    status: "Rejected",
    submittedDate: "Apr 20, 2023",
  },
  {
    id: "4",
    employee: "Fatima Al-Ahmed",
    reason: "For her exceptional client management during the recent project delivery, receiving positive feedback from all stakeholders.",
    status: "Approved",
    submittedDate: "Apr 15, 2023",
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

const CombinedPage = () => {
  // Mock state for user quota
  const [quota] = useState({
    used: 1,
    total: 3,
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employee: "",
      reason: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    toast.success("Thank you card request submitted successfully!");
    console.log(values);
    form.reset();
    setIsDialogOpen(false);
  };

  const remainingQuota = quota.total - quota.used;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">Approved</Badge>;
      case "Rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "Pending":
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredRequests = mockRequests.filter(request => {
    if (activeTab === "all") return true;
    return request.status.toLowerCase() === activeTab;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold mb-2">Thank You Cards</h2>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-kpc-purple hover:bg-kpc-light-purple">
              <Plus className="w-4 h-4 mr-2" />
              New Request
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>New Thank You Card</DialogTitle>
            </DialogHeader>
            
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
                      <FormLabel>Reason</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe why this employee deserves a thank you card..."
                          className="min-h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Yearly cards remaining: {remainingQuota} out of {quota.total}
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
          </DialogContent>
        </Dialog>
      </div>

      {/* My Requests Section */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">My Requests</h3>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-6">
              <div className="space-y-4">
                {filteredRequests.map((request) => (
                  <Card key={request.id} className="border">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-semibold text-lg">{request.employee}</h4>
                          <p className="text-sm text-muted-foreground">{request.submittedDate}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(request.status)}
                          {request.status === "Approved" && (
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">PDF</Button>
                              <Button size="sm" className="bg-kpc-purple hover:bg-kpc-light-purple">Send</Button>
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{request.reason}</p>
                    </CardContent>
                  </Card>
                ))}
                
                {filteredRequests.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No requests found for this status.
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default CombinedPage;
