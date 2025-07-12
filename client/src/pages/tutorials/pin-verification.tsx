import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import { 
  Shield, 
  Users, 
  Store, 
  CheckCircle, 
  ArrowRight, 
  WifiOff, 
  Lock,
  Eye,
  MessageSquare,
  Clock,
  Star,
  Calculator,
  Receipt,
  MousePointer2
} from "lucide-react";

export default function PinVerificationTutorial() {
  const [activeTab, setActiveTab] = useState("customer");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-4 rounded-full">
              <Shield className="w-12 h-12 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Advanced PIN Verification Guide
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Learn how our multi-layer PIN system with rotating PINs makes deal redemption ultra-secure, simple, and works anywhere
          </p>
          
          <div className="flex justify-center gap-4 mt-6">
            <Badge variant="secondary" className="flex items-center gap-2">
              <WifiOff className="w-4 h-4" />
              Works Offline
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Secure
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Rotating PINs
            </Badge>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="customer" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              For Customers
            </TabsTrigger>
            <TabsTrigger value="vendor" className="flex items-center gap-2">
              <Store className="w-4 h-4" />
              For Vendors
            </TabsTrigger>
          </TabsList>

          <TabsContent value="customer" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  How to Redeem Deals with PIN Verification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">1. Click "Verify with PIN to Claim Deal"</h3>
                    <p className="text-muted-foreground text-sm">
                      Find deals you love and click the "Verify with PIN to Claim Deal" button. This opens the PIN verification dialog where you'll enter the store's PIN.
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">2. Visit Store & Get Current PIN</h3>
                    <p className="text-muted-foreground text-sm">
                      Go to the vendor's store and make your purchase. Ask them for their current 4-digit PIN (changes every 30 minutes) to complete the deal redemption.
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calculator className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">3. Enter PIN & Bill Amount</h3>
                    <p className="text-muted-foreground text-sm">
                      Enter the 4-digit PIN in the dialog to claim your deal, then add your actual bill amount to track precise savings and update your dashboard.
                    </p>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
                  <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    Pro Tips for Customers
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Multi-Layer PIN Security</p>
                        <p className="text-sm text-muted-foreground">Advanced security with rotating PINs (30-min cycles), secure hashed PINs, and legacy PIN support</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Real Savings Only</p>
                        <p className="text-sm text-muted-foreground">Only verified purchases contribute to your savings and statistics</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Anti-Fraud Protection</p>
                        <p className="text-sm text-muted-foreground">PIN verification prevents fake claims and ensures authentic redemptions</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Accurate Tracking</p>
                        <p className="text-sm text-muted-foreground">Dashboard statistics reflect only genuine store visits and purchases</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Bill Amount Tracking</p>
                        <p className="text-sm text-muted-foreground">Add your actual purchase amount for precise savings calculation</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Optional but Recommended</p>
                        <p className="text-sm text-muted-foreground">You can skip bill entry or add it later for convenience</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vendor" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="w-5 h-5 text-green-600" />
                  How to Set Up and Use PIN Verification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Lock className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">1. Set Your Deal PIN</h3>
                    <p className="text-muted-foreground text-sm">
                      When creating a deal, set a unique 4-digit PIN. The system also automatically generates rotating PINs (changes every 30 minutes) for enhanced security.
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">2. Share Current PIN with Customers</h3>
                    <p className="text-muted-foreground text-sm">
                      When customers visit your store for deals, provide them with the current rotating PIN (updates every 30 minutes) or your original deal PIN.
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">3. Track Redemptions</h3>
                    <p className="text-muted-foreground text-sm">
                      Monitor deal performance and redemptions in your vendor dashboard automatically.
                    </p>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
                  <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    Best Practices for Vendors
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Rotating PIN System</p>
                        <p className="text-sm text-muted-foreground">Use the automatic rotating PIN feature for maximum security (changes every 30 minutes)</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Access Current PIN</p>
                        <p className="text-sm text-muted-foreground">View current rotating PIN through vendor dashboard or API endpoint (refreshes every 30 minutes)</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium">No Internet Required</p>
                        <p className="text-sm text-muted-foreground">PIN verification works offline, perfect for all store environments</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Instant Analytics</p>
                        <p className="text-sm text-muted-foreground">Real-time tracking of deal redemptions and customer engagement</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-600" />
                  Rotating PIN System (Advanced Security)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6 mb-6">
                  <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-purple-600" />
                    How Rotating PINs Work
                  </h4>
                  <p className="text-gray-700 mb-4">
                    Every deal automatically has access to rotating PINs that change every 30 minutes using cryptographic algorithms. 
                    This provides maximum security while being completely transparent to vendors.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <Clock className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Automatic Rotation</p>
                        <p className="text-xs text-muted-foreground">PINs change every 30 minutes automatically</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Lock className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Cryptographic Security</p>
                        <p className="text-xs text-muted-foreground">SHA-256 hashing with deal ID + time window</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        <Eye className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Easy Access</p>
                        <p className="text-xs text-muted-foreground">View current PIN through API or dashboard</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-amber-100 p-2 rounded-full">
                        <WifiOff className="w-4 h-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Grace Period</p>
                        <p className="text-xs text-muted-foreground">Previous PIN accepted during transition</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white border border-purple-200 rounded-lg p-4">
                    <h5 className="font-medium mb-2">API Endpoint for Current PIN:</h5>
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">GET /api/vendors/deals/:id/current-pin</code>
                    <p className="text-xs text-muted-foreground mt-2">
                      Returns current PIN, next rotation time, and deal information. Refreshes automatically every 30 seconds.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowRight className="w-5 h-5 text-blue-600" />
                  Multi-Layer PIN Security System
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                  <h4 className="font-semibold text-lg mb-3">Multi-Layer PIN Security Architecture</h4>
                  <p className="text-gray-700 mb-4">
                    Our advanced PIN system uses three security layers in priority order to ensure maximum security and backward compatibility:
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-purple-200">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <span className="text-purple-600 font-bold text-sm">1</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">Rotating PIN Verification (Highest Security)</p>
                        <p className="text-xs text-muted-foreground">
                          Cryptographic PINs that change every 30 minutes using SHA-256 hashing. No storage required.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-blue-200">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <span className="text-blue-600 font-bold text-sm">2</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">Secure Hashed PIN Verification (High Security)</p>
                        <p className="text-xs text-muted-foreground">
                          Bcrypt hashing with unique salt (12 rounds). 90-day expiration with renewal.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
                      <div className="bg-gray-100 p-2 rounded-full">
                        <span className="text-gray-600 font-bold text-sm">3</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">Legacy PIN Verification (Backward Compatibility)</p>
                        <p className="text-xs text-muted-foreground">
                          Plain text comparison for existing deals. Temporary support during migration.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-800">
                      <strong>Rate Limiting:</strong> 5 attempts/hour, 10 attempts/day maximum with comprehensive audit logging and IP tracking.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">How do I get the current rotating PIN?</h4>
                <p className="text-muted-foreground text-sm mb-4">
                  Vendors can view the current rotating PIN through the API endpoint `/api/vendors/deals/:id/current-pin` or vendor dashboard. PINs change every 30 minutes automatically.
                </p>
                
                <h4 className="font-semibold mb-2">Does this work without internet?</h4>
                <p className="text-muted-foreground text-sm mb-4">
                  Yes! PIN verification is designed to work offline. Customers can enter the PIN even without internet connection, and it will sync when connection is restored.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">What's the difference between rotating and static PINs?</h4>
                <p className="text-muted-foreground text-sm mb-4">
                  Rotating PINs change every 30 minutes automatically for maximum security. Static PINs are set when creating deals. Both work seamlessly - the system tries rotating PIN first, then your static PIN.
                </p>
                
                <h4 className="font-semibold mb-2">How secure is the PIN system?</h4>
                <p className="text-muted-foreground text-sm mb-4">
                  Extremely secure with multi-layer protection: rotating PINs use SHA-256 cryptography, static PINs use bcrypt with 12 rounds + unique salt, 90-day expiration, rate limiting (5/hour, 10/day), and complete audit logging.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}