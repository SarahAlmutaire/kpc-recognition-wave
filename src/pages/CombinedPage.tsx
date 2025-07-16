
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
    reason: "Exceptional work on the quarterly report presentation",
    status: "Pending",
    submittedDate: "2024-01-15",
  },
  {
    id: "2",
    employee: "Fatima Al-Ahmed",
    reason: "Outstanding customer service during the crisis",
    status: "Approved",
    submittedDate: "2024-01-10",
  },
  {
    id: "3",
    employee: "Mohammed Al-Rashid",
    reason: "Innovative solution for the software bug",
    status: "Rejected",
    submittedDate: "2024-01-08",
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "text-green-600";
      case "Rejected":
        return "text-red-600";
      case "Pending":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

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

      {/* Requests Grid */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">My Requests</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.employee}</TableCell>
                  <TableCell className="max-w-xs truncate">{request.reason}</TableCell>
                  <TableCell>
                    <span className={`font-medium ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </TableCell>
                  <TableCell>{request.submittedDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default CombinedPage;
