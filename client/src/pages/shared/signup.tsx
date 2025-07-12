import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Signup() {
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "customer" as "customer" | "vendor",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { signup } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.email || !formData.phone || !formData.password) {
      setError("Please fill in all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const { confirmPassword, ...signupData } = formData;
      
      // Prepare signup data
      const finalSignupData = {
        ...signupData,
        // Use email as username for login
        username: formData.email,
        name: formData.email.split('@')[0], // Default name from email
      };
      
      await signup(finalSignupData);
      
      toast({
        title: "Account created successfully!",
        description: formData.role === "customer" 
          ? "Welcome to Instoredealz! Start exploring deals now."
          : "Your vendor account has been created. Please complete your business registration.",
      });
      
      // Redirect based on role
      if (formData.role === "vendor") {
        navigate("/vendor/register");
      } else {
        navigate("/customer/deals");
      }
    } catch (err: any) {
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-royal/5 flex items-center justify-center p-4">
      <div className="w-full max-w-[90vw] sm:max-w-md mx-auto">
        {/* Logo */}
        <div className="text-center mb-6 sm:mb-8">
          <Link to="/">
            <h1 className="text-2xl sm:text-3xl font-bold text-primary">Instoredealz</h1>
          </Link>
          <p className="text-sm sm:text-base text-muted-foreground mt-2 px-4">Join India's fastest-growing deals platform</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>
              Start saving money with exclusive deals
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Role Selection with Radio Buttons */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Account Type *</Label>
                <RadioGroup 
                  value={formData.role} 
                  onValueChange={(value) => handleInputChange("role", value)}
                  className="flex flex-col space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="customer" id="customer" />
                    <Label htmlFor="customer" className="text-sm font-medium cursor-pointer">
                      Customer - Find and claim deals
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="vendor" id="vendor" />
                    <Label htmlFor="vendor" className="text-sm font-medium cursor-pointer">
                      Vendor - Offer deals to customers
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  disabled={isLoading}
                  required
                  className="w-full py-3 px-3 text-sm sm:text-base border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  disabled={isLoading}
                  required
                  className="w-full py-3 px-3 text-sm sm:text-base border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password *</Label>
                <PasswordInput
                  id="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  disabled={isLoading}
                  required
                  showStrengthIndicator={true}
                  showRequirements={true}
                  className="w-full py-3 px-3 text-sm sm:text-base border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password *</Label>
                <PasswordInput
                  id="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  disabled={isLoading}
                  required
                  className="w-full py-3 px-3 text-sm sm:text-base border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Promotional Banner */}
              <div className="bg-success/10 border border-success/20 rounded-lg p-3">
                <p className="text-sm font-medium text-success">🎉 Limited Time Offer!</p>
                <p className="text-xs text-success/80">
                  Get 1 year free Premium membership (valid until Aug 14, 2026)
                </p>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full py-3 text-sm sm:text-base font-medium" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Account
              </Button>

              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary hover:underline">
                    Sign in
                  </Link>
                </p>
                <Link to="/" className="text-sm text-gray-500 hover:underline">
                  Back to Home
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
