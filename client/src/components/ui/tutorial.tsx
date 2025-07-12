import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  CheckCircle, 
  Search, 
  Heart, 
  Tag, 
  MapPin, 
  Star,
  Users,
  Store,
  BarChart3,
  Plus,
  MousePointer2,
  Calculator,
  Eye,
  Clock,
  HelpCircle,
  BookOpen,
  Target,
  Gift,
  CreditCard,
  Bell,
  Shield
} from "lucide-react";

interface TutorialStep {
  id: number;
  title: string;
  description: string;
  icon: any;
  content: string;
  action?: string;
}

interface TutorialProps {
  type: 'customer' | 'vendor';
  onComplete?: () => void;
}

export default function Tutorial({ type, onComplete }: TutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const customerSteps: TutorialStep[] = [
    {
      id: 1,
      title: "Welcome to Instoredealz",
      description: "Discover amazing deals from local vendors",
      icon: Gift,
      content: "Welcome to Instoredealz! This platform connects you with incredible deals from local businesses. You can browse deals by category, location, and membership level.",
      action: "Get Started"
    },
    {
      id: 2,
      title: "Browse Deals",
      description: "Find deals using search and filters",
      icon: Search,
      content: "Use the search bar to find specific deals or browse by categories like Fashion, Electronics, Food, and more. Filter by location to find deals near you.",
      action: "Try Searching"
    },
    {
      id: 3,
      title: "View Deal Details",
      description: "Click 'View Deal Details' for complete information",
      icon: Eye,
      content: "Each deal card shows basic info, but click 'View Deal Details' to see complete information including vendor details, terms, and exclusive discount codes.",
      action: "View a Deal"
    },
    {
      id: 4,
      title: "Membership Benefits",
      description: "Upgrade for exclusive discount codes",
      icon: Star,
      content: "Basic members can browse deals, but Premium and Ultimate members get access to exclusive discount codes and special offers. Upgrade to unlock more savings!",
      action: "Check Membership"
    },
    {
      id: 5,
      title: "Claim Deals Online",
      description: "Save deals for in-store redemption",
      icon: MousePointer2,
      content: "Found a deal you want? Click 'Claim Deal' to reserve it for in-store use. This creates a pending claim that you'll complete at the vendor's location.",
      action: "Try Claiming"
    },
    {
      id: 6,
      title: "Visit Store & Verify PIN",
      description: "Complete your deal redemption in-store",
      icon: Shield,
      content: "Take your claimed deal to the vendor's store. Ask the vendor for their 4-digit verification PIN, then enter it in the app to verify your purchase. This works even without internet!",
      action: "Learn PIN Process"
    },
    {
      id: 7,
      title: "Add Your Bill Amount",
      description: "Calculate exact savings from your purchase",
      icon: Calculator,
      content: "After PIN verification, you can enter your actual bill amount to see your precise savings. This helps track your real spending and gives you accurate insights into your deal benefits.",
      action: "Try Bill Entry"
    },
    {
      id: 8,
      title: "Track Your Savings",
      description: "Monitor your deals and savings dashboard",
      icon: BarChart3,
      content: "View your claimed deals, total savings, and deal history in your dashboard. Track which deals are pending, completed, and see your overall savings progress.",
      action: "View Dashboard"
    },
    {
      id: 9,
      title: "Save Favorites",
      description: "Heart icon to save deals for later",
      icon: Heart,
      content: "Click the heart icon on any deal to save it to your favorites. Access your saved deals anytime from your profile to never miss a great offer.",
      action: "Save a Deal"
    },
    {
      id: 8,
      title: "Location-Based Deals",
      description: "Find deals near you",
      icon: MapPin,
      content: "Set your location to see deals from nearby vendors. The platform shows distance and helps you find the best deals in your area for easy redemption.",
      action: "Set Location"
    },
    {
      id: 9,
      title: "Get Support",
      description: "Help is always available",
      icon: HelpCircle,
      content: "Need help? Contact our support team through the help section. We're here to assist with any questions about deals, memberships, or platform usage.",
      action: "Contact Support"
    }
  ];

  const vendorSteps: TutorialStep[] = [
    {
      id: 1,
      title: "Welcome Vendor Partner",
      description: "Start reaching customers with great deals",
      icon: Store,
      content: "Welcome to the Instoredealz vendor platform! Here you can create and manage deals to attract customers, track performance, and grow your business.",
      action: "Get Started"
    },
    {
      id: 2,
      title: "Complete Your Profile",
      description: "Set up your business information",
      icon: Users,
      content: "Complete your vendor profile with business details, logo, description, and location. A complete profile builds trust and attracts more customers to your deals.",
      action: "Edit Profile"
    },
    {
      id: 3,
      title: "Create Your First Deal",
      description: "Add deals with secure PIN verification",
      icon: Plus,
      content: "Click 'Create New Deal' to add your first offer. Include attractive images, clear descriptions, discount percentages, validity periods, and a unique 4-digit PIN for secure customer verification at your store.",
      action: "Create Deal"
    },
    {
      id: 4,
      title: "Understanding Deal Claims",
      description: "How customers claim your deals online",
      icon: MousePointer2,
      content: "Customers can claim your deals online, which creates a 'pending' status. This reserves the deal but doesn't count as a sale yet. Customers must visit your store to complete redemption.",
      action: "Learn Claims"
    },
    {
      id: 5,
      title: "PIN Verification Process",
      description: "Help customers complete deal redemption",
      icon: Shield,
      content: "When customers visit your store with claimed deals, they'll ask for the 4-digit PIN. Give them the PIN so they can verify their purchase in the app. This confirms the sale and updates both your analytics and their savings.",
      action: "Learn PIN Process"
    },
    {
      id: 6,
      title: "Bill Amount Tracking",
      description: "Customers can add actual purchase amounts",
      icon: Calculator,
      content: "After PIN verification, customers can enter their actual bill amount to calculate precise savings. This gives them better insights and helps track real spending patterns versus estimated savings.",
      action: "Learn Bill Tracking"
    },
    {
      id: 7,
      title: "Deal Management",
      description: "Edit, activate, and monitor your deals",
      icon: Target,
      content: "Manage all your deals from the dashboard. Edit details, activate/deactivate deals, set redemption limits, and monitor which offers perform best.",
      action: "Manage Deals"
    },
    {
      id: 6,
      title: "Analytics Dashboard",
      description: "Track performance and insights",
      icon: BarChart3,
      content: "View detailed analytics about your deals including views, claims, conversion rates, and revenue. Use these insights to optimize future offers.",
      action: "View Analytics"
    },
    {
      id: 7,
      title: "Approval Process",
      description: "Admin review ensures quality",
      icon: CheckCircle,
      content: "New deals require admin approval to maintain platform quality. This typically takes 24-48 hours. Approved deals appear immediately to customers.",
      action: "Check Status"
    },
    {
      id: 8,
      title: "Customer Notifications",
      description: "Reach customers with promotions",
      icon: Bell,
      content: "When customers follow your business or claim your deals, they'll receive notifications about new offers. Build a loyal customer base over time.",
      action: "Send Notification"
    }
  ];

  const steps = type === 'customer' ? customerSteps : vendorSteps;

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const markStepComplete = (stepId: number) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
  };

  const completeTutorial = () => {
    markStepComplete(steps[currentStep].id);
    setIsOpen(false);
    onComplete?.();
  };

  const currentStepData = steps[currentStep];
  const StepIcon = currentStepData.icon;

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4" />
            <span>{type === 'customer' ? 'Customer Tutorial' : 'Vendor Tutorial'}</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5" />
              <span>{type === 'customer' ? 'Customer Tutorial' : 'Vendor Tutorial'}</span>
              <Badge variant="outline" className="ml-auto">
                {currentStep + 1} of {steps.length}
              </Badge>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Progress</span>
                <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Current Step */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <StepIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{currentStepData.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{currentStepData.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{currentStepData.content}</p>
                
                {currentStepData.action && (
                  <div className="mt-4">
                    <Button
                      onClick={() => markStepComplete(currentStepData.id)}
                      className="w-full"
                      variant={completedSteps.includes(currentStepData.id) ? "outline" : "default"}
                    >
                      {completedSteps.includes(currentStepData.id) ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Completed
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          {currentStepData.action}
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Separator />

            {/* Step Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center space-x-2"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </Button>

              <div className="flex space-x-1">
                {steps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStep(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                      index === currentStep
                        ? 'bg-primary'
                        : index < currentStep
                        ? 'bg-primary/50'
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              {currentStep === steps.length - 1 ? (
                <Button onClick={completeTutorial} className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Complete Tutorial</span>
                </Button>
              ) : (
                <Button onClick={nextStep} className="flex items-center space-x-2">
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Quick Overview */}
            <Card className="bg-gray-50">
              <CardHeader>
                <CardTitle className="text-sm">Tutorial Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {steps.map((step, index) => (
                    <div
                      key={step.id}
                      className={`flex items-center space-x-2 p-2 rounded text-xs transition-all duration-200 ${
                        index === currentStep
                          ? 'bg-primary/10 text-primary'
                          : completedSteps.includes(step.id)
                          ? 'bg-green-50 text-green-700'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {completedSteps.includes(step.id) ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <step.icon className="h-3 w-3" />
                      )}
                      <span className="truncate">{step.title}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}