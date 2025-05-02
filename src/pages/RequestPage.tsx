
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ReasonSuggestion } from "@/components/cards/ReasonSuggestion";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Mock data for employees
const employees = [
  { id: "1", name: "Ahmed Al-Sabah" },
  { id: "2", name: "Fatima Al-Ahmed" },
  { id: "3", name: "Mohammed Al-Rashid" },
  { id: "4", name: "Sara Al-Mutawa" },
  { id: "5", name: "Nasser Al-Salem" },
];

// Mock data for reason suggestions
const reasonSuggestions = [
  "Going above and beyond on project deadlines",
  "Excellent teamwork and collaboration",
  "Innovative problem solving skills",
  "Providing exceptional support to colleagues",
  "Outstanding leadership on recent initiative",
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

const RequestPage = () => {
  // Mock state for user quota
  const [quota] = useState({
    used: 1,
    total: 3,
  });

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
  };

  const handleSuggestionClick = (suggestion: string) => {
    form.setValue("reason", suggestion);
  };

  const remainingQuota = quota.total - quota.used;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-center mb-2">New Thank You Card</h2>
        <p className="text-center text-muted-foreground">
          Recognize your colleagues for their outstanding work
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="pt-6">
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
                    <Alert variant="destructive" className="mt-4">
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
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Reminding Cards</h3>
          <div className="space-y-3">
            {reasonSuggestions.map((suggestion, index) => (
              <ReasonSuggestion 
                key={index}
                suggestion={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestPage;
