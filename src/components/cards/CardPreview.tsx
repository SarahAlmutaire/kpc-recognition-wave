
import { Card, CardContent } from "@/components/ui/card";
import { FileTextIcon, CalendarIcon, CheckIcon, XIcon } from "lucide-react";

interface Employee {
  id: string;
  name: string;
}

interface ApprovalStep {
  name: string;
  status: string;
  date: string | null;
  reason?: string;
}

interface Request {
  id: string;
  employee: Employee;
  reason: string;
  status: string;
  submittedDate: string;
  approvalSteps: ApprovalStep[];
  sent: boolean;
}

interface CardPreviewProps {
  request: Request;
}

export function CardPreview({ request }: CardPreviewProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Pending";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case "approved":
        return <CheckIcon className="h-4 w-4 text-green-500" />;
      case "rejected":
        return <XIcon className="h-4 w-4 text-red-500" />;
      default:
        return <div className="h-4 w-4 rounded-full bg-gray-300"></div>;
    }
  };

  return (
    <Card className="overflow-hidden border-2 border-kpc-light-purple/30">
      <div className="bg-gradient-to-r from-kpc-light-purple to-kpc-purple text-white p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <FileTextIcon className="h-5 w-5" />
            <h3 className="font-bold">Thank You Card</h3>
          </div>
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-4 w-4" />
            <span className="text-xs">{formatDate(request.submittedDate)}</span>
          </div>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">To</h4>
            <p className="text-lg font-semibold">{request.employee.name}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Recognition Message</h4>
            <p className="text-gray-800 bg-kpc-soft-purple/30 p-4 rounded-md italic">
              {request.reason}
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Approval Status</h4>
            <div className="space-y-3">
              {request.approvalSteps.map((step, index) => (
                <div key={index} className="flex items-start">
                  <div className="mr-2 mt-1">
                    {getStatusIcon(step.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{step.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(step.date)}
                      </span>
                    </div>
                    {step.reason && (
                      <p className="text-xs text-red-500 mt-1">{step.reason}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
