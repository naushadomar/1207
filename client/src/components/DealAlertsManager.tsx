import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Bell, 
  Plus, 
  Edit, 
  Trash2, 
  Settings, 
  Target,
  MapPin,
  DollarSign,
  Hash,
  Toggle,
  AlertCircle,
  Check,
  Clock
} from "lucide-react";

const createAlertSchema = z.object({
  alertName: z.string().min(1, "Alert name is required"),
  categories: z.array(z.string()).optional(),
  minDiscountPercentage: z.number().min(0).max(100).optional(),
  maxPrice: z.number().min(0).optional(),
  keywords: z.string().optional(),
  cities: z.array(z.string()).optional(),
  maxDistance: z.number().min(1).max(50).optional(),
  emailNotifications: z.boolean().default(true),
  smsNotifications: z.boolean().default(false),
  pushNotifications: z.boolean().default(true),
});

type CreateAlertFormData = z.infer<typeof createAlertSchema>;

interface DealAlert {
  id: number;
  alertName: string;
  categories: string[];
  minDiscountPercentage?: number;
  maxPrice?: number;
  keywords?: string;
  cities: string[];
  maxDistance?: number;
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  isActive: boolean;
  totalMatches: number;
  lastTriggered?: string;
  createdAt: string;
}

export default function DealAlertsManager() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAlert, setEditingAlert] = useState<DealAlert | null>(null);

  const form = useForm<CreateAlertFormData>({
    resolver: zodResolver(createAlertSchema),
    defaultValues: {
      alertName: "",
      categories: [],
      minDiscountPercentage: 10,
      maxPrice: 5000,
      keywords: "",
      cities: [],
      maxDistance: 10,
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
    },
  });

  // Fetch user's alerts
  const { data: alerts = [], isLoading: alertsLoading } = useQuery({
    queryKey: ["/api/alerts"],
  });

  // Fetch categories and cities for the form
  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
  });

  const { data: cities = [] } = useQuery({
    queryKey: ["/api/cities"],
  });

  // Create alert mutation
  const createAlertMutation = useMutation({
    mutationFn: async (data: CreateAlertFormData) => {
      return await apiRequest("/api/alerts", "POST", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/alerts"] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Success!",
        description: "Your deal alert has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create deal alert",
        variant: "destructive",
      });
    },
  });

  // Update alert mutation
  const updateAlertMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<DealAlert> }) => {
      return await apiRequest(`/api/alerts/${id}`, "PUT", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/alerts"] });
      toast({
        title: "Success!",
        description: "Alert updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update alert",
        variant: "destructive",
      });
    },
  });

  // Delete alert mutation
  const deleteAlertMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/alerts/${id}`, "DELETE");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/alerts"] });
      toast({
        title: "Success!",
        description: "Alert deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete alert",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CreateAlertFormData) => {
    if (editingAlert) {
      updateAlertMutation.mutate({ id: editingAlert.id, data });
    } else {
      createAlertMutation.mutate(data);
    }
  };

  const toggleAlertStatus = (alert: DealAlert) => {
    updateAlertMutation.mutate({
      id: alert.id,
      data: { isActive: !alert.isActive }
    });
  };

  const startEditing = (alert: DealAlert) => {
    setEditingAlert(alert);
    form.reset({
      alertName: alert.alertName,
      categories: alert.categories || [],
      minDiscountPercentage: alert.minDiscountPercentage,
      maxPrice: alert.maxPrice,
      keywords: alert.keywords || "",
      cities: alert.cities || [],
      maxDistance: alert.maxDistance,
      emailNotifications: alert.emailNotifications,
      smsNotifications: alert.smsNotifications,
      pushNotifications: alert.pushNotifications,
    });
    setIsDialogOpen(true);
  };

  const cancelEditing = () => {
    setEditingAlert(null);
    form.reset();
    setIsDialogOpen(false);
  };

  if (alertsLoading) {
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
          <h2 className="text-2xl font-bold text-foreground">Custom Deal Alerts</h2>
          <p className="text-muted-foreground">Get notified when deals match your criteria</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingAlert(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Alert
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingAlert ? "Edit Deal Alert" : "Create New Deal Alert"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="alertName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alert Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Electronics Under ₹5000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categories"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categories (Optional)</FormLabel>
                      <div className="grid grid-cols-3 gap-2">
                        {categories.map((category: any) => (
                          <div key={category.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={category.id}
                              checked={field.value?.includes(category.id) || false}
                              onCheckedChange={(checked) => {
                                const currentValue = field.value || [];
                                if (checked) {
                                  field.onChange([...currentValue, category.id]);
                                } else {
                                  field.onChange(currentValue.filter((id) => id !== category.id));
                                }
                              }}
                            />
                            <Label htmlFor={category.id} className="text-sm">
                              {category.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="minDiscountPercentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Discount %</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <Slider
                              value={[field.value || 0]}
                              onValueChange={(value) => field.onChange(value[0])}
                              max={80}
                              min={5}
                              step={5}
                            />
                            <div className="text-center text-sm text-muted-foreground">
                              {field.value || 0}% minimum discount
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="maxPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Price (₹)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="5000"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="keywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Keywords (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., smartphone, laptop, fashion" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cities"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cities (Optional)</FormLabel>
                      <div className="grid grid-cols-3 gap-2">
                        {cities.slice(0, 9).map((city: any) => (
                          <div key={city.name} className="flex items-center space-x-2">
                            <Checkbox
                              id={city.name}
                              checked={field.value?.includes(city.name) || false}
                              onCheckedChange={(checked) => {
                                const currentValue = field.value || [];
                                if (checked) {
                                  field.onChange([...currentValue, city.name]);
                                } else {
                                  field.onChange(currentValue.filter((name) => name !== city.name));
                                }
                              }}
                            />
                            <Label htmlFor={city.name} className="text-sm">
                              {city.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maxDistance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Distance (km)</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <Slider
                            value={[field.value || 10]}
                            onValueChange={(value) => field.onChange(value[0])}
                            max={50}
                            min={1}
                            step={1}
                          />
                          <div className="text-center text-sm text-muted-foreground">
                            Within {field.value || 10} km
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <Label className="text-base font-medium">Notification Preferences</Label>
                  <div className="space-y-3">
                    <FormField
                      control={form.control}
                      name="emailNotifications"
                      render={({ field }) => (
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="email"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                          <Label htmlFor="email">Email notifications</Label>
                        </div>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pushNotifications"
                      render={({ field }) => (
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="push"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                          <Label htmlFor="push">Push notifications</Label>
                        </div>
                      )}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={cancelEditing}>
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createAlertMutation.isPending || updateAlertMutation.isPending}
                  >
                    {editingAlert ? "Update Alert" : "Create Alert"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {alerts.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No alerts yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first deal alert to get notified when great deals match your criteria
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {alerts.map((alert: DealAlert) => (
            <Card key={alert.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-foreground">{alert.alertName}</h3>
                      <Badge variant={alert.isActive ? "default" : "secondary"}>
                        {alert.isActive ? "Active" : "Inactive"}
                      </Badge>
                      {alert.totalMatches > 0 && (
                        <Badge variant="outline">
                          {alert.totalMatches} matches
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                      {alert.categories && alert.categories.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Hash className="h-3 w-3" />
                          <span>{alert.categories.join(", ")}</span>
                        </div>
                      )}
                      {alert.minDiscountPercentage && (
                        <div className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          <span>{alert.minDiscountPercentage}%+ discount</span>
                        </div>
                      )}
                      {alert.maxPrice && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          <span>Under ₹{alert.maxPrice}</span>
                        </div>
                      )}
                      {alert.cities && alert.cities.length > 0 && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{alert.cities.join(", ")}</span>
                        </div>
                      )}
                    </div>

                    {alert.lastTriggered && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>Last triggered: {new Date(alert.lastTriggered).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleAlertStatus(alert)}
                      disabled={updateAlertMutation.isPending}
                    >
                      <Toggle className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEditing(alert)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteAlertMutation.mutate(alert.id)}
                      disabled={deleteAlertMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}