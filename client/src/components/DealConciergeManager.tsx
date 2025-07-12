import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Sparkles, 
  Plus, 
  MessageCircle, 
  Clock, 
  CheckCircle,
  AlertCircle,
  User,
  Calendar,
  Target,
  DollarSign,
  MapPin,
  Star,
  ThumbsUp,
  ThumbsDown,
  Search
} from "lucide-react";

const createRequestSchema = z.object({
  requestTitle: z.string().min(1, "Request title is required"),
  description: z.string().min(10, "Please provide more details (at least 10 characters)"),
  category: z.string().optional(),
  budgetRange: z.string().optional(),
  preferredLocation: z.string().optional(),
  urgency: z.enum(["low", "medium", "high"]).default("medium"),
});

type CreateRequestFormData = z.infer<typeof createRequestSchema>;

interface ConciergeRequest {
  id: number;
  requestTitle: string;
  description: string;
  category?: string;
  budgetRange?: string;
  preferredLocation?: string;
  urgency: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  assignedTo?: number;
  conciergeNotes?: string;
  recommendedDeals: number[];
  lastContactDate?: string;
  responseDeadline?: string;
  customerSatisfaction?: number;
  createdAt: string;
  updatedAt: string;
}

const urgencyColors = {
  low: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  high: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
};

const statusColors = {
  pending: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  in_progress: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
};

const statusIcons = {
  pending: Clock,
  in_progress: User,
  completed: CheckCircle,
  cancelled: AlertCircle
};

export default function DealConciergeManager() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ConciergeRequest | null>(null);
  const [satisfactionRating, setSatisfactionRating] = useState<number>(0);

  const form = useForm<CreateRequestFormData>({
    resolver: zodResolver(createRequestSchema),
    defaultValues: {
      requestTitle: "",
      description: "",
      category: "",
      budgetRange: "",
      preferredLocation: "",
      urgency: "medium",
    },
  });

  // Fetch user's concierge requests
  const { data: requests = [], isLoading: requestsLoading } = useQuery({
    queryKey: ["/api/concierge"],
  });

  // Fetch categories for the form
  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
  });

  // Create request mutation
  const createRequestMutation = useMutation({
    mutationFn: async (data: CreateRequestFormData) => {
      return await apiRequest("/api/concierge", "POST", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/concierge"] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Success!",
        description: "Your concierge request has been submitted. Our team will contact you soon.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit concierge request",
        variant: "destructive",
      });
    },
  });

  // Update satisfaction rating mutation
  const updateSatisfactionMutation = useMutation({
    mutationFn: async ({ id, rating }: { id: number; rating: number }) => {
      return await apiRequest(`/api/concierge/${id}`, "PUT", { customerSatisfaction: rating });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/concierge"] });
      toast({
        title: "Thank you!",
        description: "Your feedback has been submitted.",
      });
      setSelectedRequest(null);
      setSatisfactionRating(0);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit rating",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CreateRequestFormData) => {
    createRequestMutation.mutate(data);
  };

  const submitSatisfactionRating = (request: ConciergeRequest, rating: number) => {
    updateSatisfactionMutation.mutate({ id: request.id, rating });
  };

  if (requestsLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Personal Deal Concierge</h2>
          <p className="text-muted-foreground">Let our experts find the perfect deals for you</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Concierge Request</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="requestTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Request Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Looking for premium laptop deals under ₹80,000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Detailed Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Please describe what you're looking for in detail. Include specifications, preferences, and any specific requirements..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category (Optional)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category: any) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
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
                    name="urgency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Urgency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select urgency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">Low - Within a week</SelectItem>
                            <SelectItem value="medium">Medium - Within 3 days</SelectItem>
                            <SelectItem value="high">High - Within 24 hours</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="budgetRange"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Budget Range (Optional)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select budget range" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="under-500">Under ₹500</SelectItem>
                            <SelectItem value="500-1000">₹500 - ₹1,000</SelectItem>
                            <SelectItem value="1000-5000">₹1,000 - ₹5,000</SelectItem>
                            <SelectItem value="5000-10000">₹5,000 - ₹10,000</SelectItem>
                            <SelectItem value="10000-25000">₹10,000 - ₹25,000</SelectItem>
                            <SelectItem value="25000-50000">₹25,000 - ₹50,000</SelectItem>
                            <SelectItem value="above-50000">Above ₹50,000</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="preferredLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Location (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Mumbai, Delhi" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createRequestMutation.isPending}>
                    Submit Request
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {requests.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No requests yet</h3>
            <p className="text-muted-foreground mb-4">
              Submit your first concierge request and let our experts find the perfect deals for you
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {requests.map((request: ConciergeRequest) => {
            const StatusIcon = statusIcons[request.status];
            return (
              <Card key={request.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{request.requestTitle}</CardTitle>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={statusColors[request.status]}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {request.status.replace('_', ' ')}
                        </Badge>
                        <Badge className={urgencyColors[request.urgency as keyof typeof urgencyColors]}>
                          {request.urgency} priority
                        </Badge>
                        {request.category && (
                          <Badge variant="outline">
                            {request.category}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{request.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    {request.budgetRange && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span>Budget: {request.budgetRange}</span>
                      </div>
                    )}
                    {request.preferredLocation && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{request.preferredLocation}</span>
                      </div>
                    )}
                    {request.responseDeadline && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Due: {new Date(request.responseDeadline).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  {request.conciergeNotes && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <div className="flex items-start gap-2">
                        <MessageCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                            Concierge Notes:
                          </p>
                          <p className="text-blue-800 dark:text-blue-200 text-sm">
                            {request.conciergeNotes}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {request.recommendedDeals && request.recommendedDeals.length > 0 && (
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-4 w-4 text-green-600" />
                        <p className="font-medium text-green-900 dark:text-green-100">
                          Recommended Deals ({request.recommendedDeals.length})
                        </p>
                      </div>
                      <Button variant="outline" size="sm" className="text-green-700 border-green-300">
                        <Search className="h-3 w-3 mr-1" />
                        View Recommendations
                      </Button>
                    </div>
                  )}

                  {request.status === "completed" && !request.customerSatisfaction && (
                    <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
                      <p className="font-medium text-amber-900 dark:text-amber-100 mb-3">
                        How satisfied are you with our service?
                      </p>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <Button
                            key={rating}
                            variant="ghost"
                            size="sm"
                            className="p-1"
                            onClick={() => submitSatisfactionRating(request, rating)}
                            disabled={updateSatisfactionMutation.isPending}
                          >
                            <Star
                              className={`h-5 w-5 ${
                                rating <= satisfactionRating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {request.customerSatisfaction && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>You rated this service {request.customerSatisfaction}/5 stars</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}