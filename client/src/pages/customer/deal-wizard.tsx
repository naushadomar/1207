import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import { 
  Wand2, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle,
  Star,
  MapPin,
  Tag,
  DollarSign,
  Clock,
  Heart,
  Sparkles,
  Target,
  Calendar
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface WizardStep {
  id: string;
  title: string;
  description: string;
}

interface Preferences {
  categories: string[];
  priceRange: [number, number];
  location: string;
  interests: string[];
  timePreference: string;
  dealType: string;
  budget: number;
  frequency: string;
}

export default function DealRecommendationWizard() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState<Preferences>({
    categories: [],
    priceRange: [100, 5000],
    location: '',
    interests: [],
    timePreference: 'any',
    dealType: 'all',
    budget: 2000,
    frequency: 'weekly'
  });

  const steps: WizardStep[] = [
    {
      id: 'categories',
      title: 'What interests you?',
      description: 'Select categories you want deals for'
    },
    {
      id: 'budget',
      title: 'Set your budget',
      description: 'How much do you typically spend on deals?'
    },
    {
      id: 'location',
      title: 'Where are you?',
      description: 'Help us find deals near you'
    },
    {
      id: 'preferences',
      title: 'Your preferences',
      description: 'Tell us more about what you like'
    },
    {
      id: 'recommendations',
      title: 'Your recommendations',
      description: 'Here are deals picked just for you'
    }
  ];

  // Fetch available categories and cities
  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
  });

  const { data: cities = [] } = useQuery({
    queryKey: ["/api/cities"],
  });

  // Generate recommendations mutation
  const generateRecommendations = useMutation({
    mutationFn: async (prefs: Preferences) => {
      return await apiRequest("/api/deals/recommendations", "POST", prefs);
    },
    onSuccess: () => {
      toast({
        title: "Recommendations Generated!",
        description: "We found some great deals for you based on your preferences.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate recommendations. Please try again.",
        variant: "destructive",
      });
    },
  });

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCategoryToggle = (category: string) => {
    setPreferences(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleInterestToggle = (interest: string) => {
    setPreferences(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleFinish = () => {
    generateRecommendations.mutate(preferences);
    setTimeout(() => {
      navigate('/customer/deals');
    }, 2000);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card>
            <CardContent className="p-12 text-center">
              <Wand2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Login Required</h3>
              <p className="text-muted-foreground mb-4">Please log in to use the deal recommendation wizard</p>
              <Button asChild>
                <Link to="/login">Login Now</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case 'categories':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-2">What interests you?</h2>
              <p className="text-muted-foreground">Select all categories that interest you</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array.isArray(categories) ? categories.map((category: any, index: number) => {
                const colors = [
                  'bg-blue-50 hover:bg-blue-100 border-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:border-blue-800',
                  'bg-green-50 hover:bg-green-100 border-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 dark:border-green-800',
                  'bg-purple-50 hover:bg-purple-100 border-purple-200 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 dark:border-purple-800',
                  'bg-orange-50 hover:bg-orange-100 border-orange-200 dark:bg-orange-900/30 dark:hover:bg-orange-900/50 dark:border-orange-800',
                  'bg-pink-50 hover:bg-pink-100 border-pink-200 dark:bg-pink-900/30 dark:hover:bg-pink-900/50 dark:border-pink-800',
                  'bg-indigo-50 hover:bg-indigo-100 border-indigo-200 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 dark:border-indigo-800',
                  'bg-yellow-50 hover:bg-yellow-100 border-yellow-200 dark:bg-yellow-900/30 dark:hover:bg-yellow-900/50 dark:border-yellow-800',
                  'bg-red-50 hover:bg-red-100 border-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:border-red-800',
                  'bg-teal-50 hover:bg-teal-100 border-teal-200 dark:bg-teal-900/30 dark:hover:bg-teal-900/50 dark:border-teal-800',
                  'bg-cyan-50 hover:bg-cyan-100 border-cyan-200 dark:bg-cyan-900/30 dark:hover:bg-cyan-900/50 dark:border-cyan-800',
                  'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50 dark:border-emerald-800',
                  'bg-violet-50 hover:bg-violet-100 border-violet-200 dark:bg-violet-900/30 dark:hover:bg-violet-900/50 dark:border-violet-800'
                ];
                const colorClass = colors[index % colors.length];
                const isSelected = preferences.categories.includes(category.id);
                
                return (
                  <Button
                    key={category.id}
                    variant="outline"
                    className={`h-16 flex items-center justify-center transition-all duration-200 ${
                      isSelected 
                        ? 'bg-primary text-primary-foreground border-primary shadow-md' 
                        : colorClass
                    }`}
                    onClick={() => handleCategoryToggle(category.id)}
                  >
                    <span className="text-sm font-medium">{category.name}</span>
                  </Button>
                );
              }) : null}
            </div>
          </div>
        );

      case 'budget':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-2">What's your budget?</h2>
              <p className="text-muted-foreground">Set your typical spending range for deals</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium">Monthly Budget</Label>
                <div className="mt-4">
                  <Slider
                    value={[preferences.budget]}
                    onValueChange={(value) => setPreferences(prev => ({ ...prev, budget: value[0] }))}
                    max={10000}
                    min={500}
                    step={100}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-2">
                    <span>₹500</span>
                    <span className="font-medium text-lg text-primary">₹{preferences.budget}</span>
                    <span>₹10,000</span>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Price Range per Deal</Label>
                <div className="mt-4">
                  <Slider
                    value={preferences.priceRange}
                    onValueChange={(value) => setPreferences(prev => ({ ...prev, priceRange: value as [number, number] }))}
                    max={5000}
                    min={50}
                    step={50}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-2">
                    <span>₹50</span>
                    <span className="font-medium text-primary">₹{preferences.priceRange[0]} - ₹{preferences.priceRange[1]}</span>
                    <span>₹5,000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'location':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-2">Where are you located?</h2>
              <p className="text-muted-foreground">Help us find deals near you</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array.isArray(cities) ? cities.slice(0, 8).map((city: any, index: number) => {
                const colors = [
                  'bg-blue-50 hover:bg-blue-100 border-blue-200',
                  'bg-green-50 hover:bg-green-100 border-green-200',
                  'bg-purple-50 hover:bg-purple-100 border-purple-200',
                  'bg-orange-50 hover:bg-orange-100 border-orange-200',
                  'bg-pink-50 hover:bg-pink-100 border-pink-200',
                  'bg-indigo-50 hover:bg-indigo-100 border-indigo-200',
                  'bg-teal-50 hover:bg-teal-100 border-teal-200',
                  'bg-emerald-50 hover:bg-emerald-100 border-emerald-200'
                ];
                const colorClass = colors[index % colors.length];
                const isSelected = preferences.location === city.name;
                
                return (
                  <Button
                    key={city.name}
                    variant="outline"
                    className={`h-20 flex flex-col items-center justify-center space-y-1 transition-all duration-200 ${
                      isSelected 
                        ? 'bg-primary text-primary-foreground border-primary shadow-md' 
                        : colorClass
                    }`}
                    onClick={() => setPreferences(prev => ({ ...prev, location: city.name }))}
                  >
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm font-medium">{city.name}</span>
                    <span className="text-xs opacity-75">{city.dealCount || 0} deals</span>
                  </Button>
                );
              }) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="custom-location">Or enter your city</Label>
              <Input
                id="custom-location"
                placeholder="Enter your city name"
                value={preferences.location}
                onChange={(e) => setPreferences(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
          </div>
        );

      case 'preferences':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-2">Tell us your preferences</h2>
              <p className="text-muted-foreground">Help us personalize your experience</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <Label className="text-base font-medium">When do you prefer to shop?</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'weekdays', label: 'Weekdays', icon: Calendar },
                    { id: 'weekends', label: 'Weekends', icon: Calendar },
                    { id: 'evenings', label: 'Evenings', icon: Clock },
                    { id: 'any', label: 'Anytime', icon: Target }
                  ].map((time) => (
                    <Button
                      key={time.id}
                      variant={preferences.timePreference === time.id ? "default" : "outline"}
                      className="h-12"
                      onClick={() => setPreferences(prev => ({ ...prev, timePreference: time.id }))}
                    >
                      <time.icon className="h-4 w-4 mr-2" />
                      {time.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-base font-medium">Deal type preference</Label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { id: 'discount', label: 'Discount Deals', icon: Tag },
                    { id: 'bundle', label: 'Bundle Deals', icon: Star },
                    { id: 'all', label: 'All Types', icon: Sparkles }
                  ].map((type) => (
                    <Button
                      key={type.id}
                      variant={preferences.dealType === type.id ? "default" : "outline"}
                      className="h-12 justify-start"
                      onClick={() => setPreferences(prev => ({ ...prev, dealType: type.id }))}
                    >
                      <type.icon className="h-4 w-4 mr-2" />
                      {type.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-base font-medium">How often do you want recommendations?</Label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'daily', label: 'Daily' },
                  { id: 'weekly', label: 'Weekly' },
                  { id: 'monthly', label: 'Monthly' }
                ].map((freq) => (
                  <Button
                    key={freq.id}
                    variant={preferences.frequency === freq.id ? "default" : "outline"}
                    onClick={() => setPreferences(prev => ({ ...prev, frequency: freq.id }))}
                  >
                    {freq.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'recommendations':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">All set!</h2>
              <p className="text-muted-foreground">We're generating personalized recommendations for you</p>
            </div>

            <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Your Preferences Summary:</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Categories:</strong> {preferences.categories.length} selected</p>
                    <p><strong>Budget:</strong> ₹{preferences.budget}/month</p>
                    <p><strong>Location:</strong> {preferences.location || 'Not specified'}</p>
                  </div>
                  <div>
                    <p><strong>Price Range:</strong> ₹{preferences.priceRange[0]} - ₹{preferences.priceRange[1]}</p>
                    <p><strong>Time Preference:</strong> {preferences.timePreference}</p>
                    <p><strong>Frequency:</strong> {preferences.frequency}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <Button 
                onClick={handleFinish} 
                size="lg" 
                className="w-full md:w-auto"
                disabled={generateRecommendations.isPending}
              >
                {generateRecommendations.isPending ? (
                  <>Generating recommendations...</>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate My Recommendations
                  </>
                )}
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Wand2 className="h-8 w-8 text-primary mr-2" />
            <h1 className="text-3xl font-bold text-foreground">Deal Recommendation Wizard</h1>
          </div>
          <p className="text-muted-foreground">Let us help you find the perfect deals tailored just for you</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm text-gray-500">{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <Card className="mb-8">
          <CardContent className="p-8">
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {currentStep < steps.length - 1 && (
            <Button onClick={handleNext}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}