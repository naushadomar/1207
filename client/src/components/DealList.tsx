import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { generateDealClaimQR } from '../lib/qr-code';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Gift, Star, MapPin, Calendar, QrCode, Calculator, Receipt, Shield } from 'lucide-react';
import { PinVerificationDialog } from '@/components/ui/pin-verification-dialog';

interface Deal {
  id: number;
  title: string;
  description: string;
  category: string;
  originalPrice: string;
  discountedPrice: string;
  discountPercentage: number;
  validUntil: string;
  vendor: {
    id: number;
    name: string;
    city: string;
    state: string;
  };
  isActive: boolean;
  maxRedemptions?: number;
  currentRedemptions?: number;
}

interface ClaimResponse {
  id: number;
  dealId: number;
  userId: number;
  savingsAmount: string;
  claimedAt: string;
}

const DealList = () => {
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [billingDeal, setBillingDeal] = useState<Deal | null>(null);
  const [billAmount, setBillAmount] = useState<string>('');
  const [calculatedSavings, setCalculatedSavings] = useState<number>(0);
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [pinDialogDeal, setPinDialogDeal] = useState<Deal | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Parse category from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(location.split('?')[1] || '');
    const category = urlParams.get('category');
    if (category) {
      setSelectedCategory(category);
    }
  }, [location]);

  // Fetch deals using TanStack Query with category filtering
  const { data: deals = [], isLoading, error } = useQuery<Deal[]>({
    queryKey: ['/api/deals', selectedCategory === 'all' ? '' : selectedCategory],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedCategory && selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }
      
      const response = await fetch(`/api/deals?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch deals');
      return response.json();
    },
  });

  // Fetch user claims to check which deals have been claimed
  const { data: userClaims = [], isLoading: isLoadingClaims } = useQuery<Array<{id: number, dealId: number, status: string}>>({
    queryKey: ['/api/users/claims'],
    staleTime: 0, // Always fetch fresh data for claims
    retry: 3,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  // Calculate savings based on bill amount
  const calculateSavings = (billAmountValue: string, discountPercentage: number) => {
    const amount = parseFloat(billAmountValue);
    if (isNaN(amount) || amount <= 0) return 0;
    return (amount * discountPercentage) / 100;
  };

  // Update bill amount mutation
  const updateBillMutation = useMutation({
    mutationFn: async ({ dealId, billAmount, savings }: { dealId: number, billAmount: number, savings: number }) => {
      return apiRequest(`/api/deals/${dealId}/update-bill`, 'POST', {
        billAmount,
        actualSavings: savings
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Bill Updated Successfully!",
        description: `Your actual savings of ₹${calculatedSavings.toFixed(2)} have been recorded.`,
        variant: "default",
      });
      
      // Reset and close billing dialog
      setBillingDeal(null);
      setBillAmount('');
      setCalculatedSavings(0);
      
      // Refresh user data to update dashboard
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      queryClient.invalidateQueries({ queryKey: ["/api/users/claims"] });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: "Failed to update bill amount. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleDealClick = (dealId: number) => {
    setLocation(`/deals/${dealId}`);
  };

  if (isLoading || isLoadingClaims) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-lg text-muted-foreground">
            {isLoading ? "Loading amazing deals..." : "Loading your claimed deals..."}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="text-center space-y-4 max-w-md">
          <div className="text-red-500 text-6xl">⚠️</div>
          <h3 className="text-xl font-semibold text-red-600">Oops! Something went wrong</h3>
          <p className="text-muted-foreground">{(error as Error).message}</p>
          <Button 
            onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/deals'] })}
            variant="outline"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          🔥 Hot Deals
        </h1>
        <p className="text-lg text-muted-foreground">
          Discover amazing discounts and save money on your favorite products!
        </p>
      </div>
      
      {deals.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-8xl mb-4">🛍️</div>
          <h3 className="text-xl font-semibold mb-2">No deals available</h3>
          <p className="text-muted-foreground">Check back later for amazing offers!</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {deals.map((deal, index) => {
            const isExpired = new Date(deal.validUntil) < new Date();
            const isLimitReached = deal.maxRedemptions && deal.currentRedemptions && 
              deal.currentRedemptions >= deal.maxRedemptions;
            const canClaim = deal.isActive && !isExpired && !isLimitReached;
            
            // Check if user has claimed this deal
            const userClaim = userClaims.find(claim => claim.dealId === deal.id);
            const hasClaimedDeal = !!userClaim;
            
            // Show Add Bill Amount button for verified/completed claims (status 'used')
            // This button allows customers to add their actual bill amount for savings calculation
            const showBillAmountButton = hasClaimedDeal && userClaim?.status === 'used';
            
            // Debug logging for troubleshooting
            if (hasClaimedDeal) {
              // Debug: Deal claim status and button visibility logic
            }
            
            return (
              <Card 
                key={`deal-${deal.id}-${index}`} 
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/20 cursor-pointer"
                onClick={() => handleDealClick(deal.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                      {deal.category}
                    </Badge>
                    <div className="flex items-center space-x-1 text-orange-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm font-medium">{deal.discountPercentage}% OFF</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {deal.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {deal.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-green-600">
                          ₹{deal.discountedPrice}
                        </span>
                        <span className="text-sm text-muted-foreground line-through">
                          ₹{deal.originalPrice}
                        </span>
                      </div>
                      <div className="text-sm text-green-600 font-medium">
                        Save ₹{(parseFloat(deal.originalPrice) - parseFloat(deal.discountedPrice)).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons - Moved above validity section */}
                  <div className="flex flex-col gap-2">
                    {!hasClaimedDeal ? (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPinDialogDeal(deal);
                          setShowPinDialog(true);
                        }}
                        disabled={!canClaim}
                        className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                        size="lg"
                      >
                        {!canClaim ? (
                          isExpired ? "⏰ Expired" : 
                          isLimitReached ? "🚫 Limit Reached" : 
                          "❌ Unavailable"
                        ) : (
                          <>
                            <Shield className="h-4 w-4 mr-2" />
                            Verify with PIN to Claim Deal
                          </>
                        )}
                      </Button>
                    ) : (
                      <div className="space-y-2">
                        <div className="text-center text-sm text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-900/30 rounded-lg py-2">
                          ✅ Deal Claimed
                        </div>
                        {userClaim?.status === 'pending' && (
                          <div className="text-center text-sm text-amber-600 dark:text-amber-400 font-medium bg-amber-50 dark:bg-amber-900/30 rounded-lg py-2">
                            📍 Visit store to verify PIN
                          </div>
                        )}
                        {showBillAmountButton && (
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              setBillingDeal(deal);
                            }}
                            variant="outline"
                            className="w-full border-orange-300 text-orange-600 hover:bg-orange-50 hover:border-orange-400"
                            size="sm"
                          >
                            <Receipt className="h-4 w-4 mr-2" />
                            Add Bill Amount
                          </Button>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {deal.vendor ? 
                          `${deal.vendor.name || 'Vendor'} - ${deal.vendor.city}, ${deal.vendor.state}` : 
                          'Location not available'
                        }
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Valid until {new Date(deal.validUntil).toLocaleDateString()}</span>
                    </div>
                    {deal.maxRedemptions && (
                      <div className="flex items-center space-x-2">
                        <Gift className="h-4 w-4" />
                        <span>{deal.currentRedemptions || 0}/{deal.maxRedemptions} claimed</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* QR Code Dialog */}
      <Dialog open={!!selectedDeal && !!qrCode} onOpenChange={closeDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-green-600">
              🎉 Deal Claimed Successfully!
            </DialogTitle>
            <DialogDescription className="text-center">
              Your deal has been claimed. Show this QR code to the vendor to redeem your discount.
            </DialogDescription>
          </DialogHeader>
          
          {qrCode && (
            <div className="flex flex-col items-center space-y-4 py-4">
              <div className="p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg">
                <img 
                  src={qrCode} 
                  alt="Deal Claim QR Code" 
                  className="w-48 h-48 mx-auto"
                />
              </div>
              <div className="text-center space-y-2">
                <p className="font-semibold text-lg">{selectedDeal?.title}</p>
                <p className="text-sm text-muted-foreground">
                  Present this QR code at {selectedDeal?.vendor.name}
                </p>
                <div className="flex items-center justify-center space-x-2 text-green-600">
                  <QrCode className="h-4 w-4" />
                  <span className="text-sm font-medium">Scan to verify claim</span>
                </div>
              </div>
              <Button onClick={closeDialog} className="w-full">
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Bill Amount Dialog */}
      <Dialog open={!!billingDeal} onOpenChange={() => setBillingDeal(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-orange-600" />
              Calculate Your Savings
            </DialogTitle>
            <DialogDescription>
              Enter the total bill amount to calculate your actual savings
            </DialogDescription>
          </DialogHeader>
          
          {billingDeal && (
            <div className="space-y-4 py-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-1 text-gray-900 dark:text-gray-100">{billingDeal.title}</h3>
                <p className="text-sm text-muted-foreground">Discount: {billingDeal.discountPercentage}% OFF</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bill-amount">Total Bill Amount (₹)</Label>
                <Input
                  id="bill-amount"
                  type="number"
                  placeholder="Enter your total bill amount"
                  value={billAmount}
                  onChange={(e) => {
                    setBillAmount(e.target.value);
                    const savings = calculateSavings(e.target.value, billingDeal.discountPercentage);
                    setCalculatedSavings(savings);
                  }}
                  className="text-lg"
                />
              </div>
              
              {billAmount && calculatedSavings > 0 && (
                <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-700 dark:text-green-300">Your Savings:</span>
                    <span className="text-xl font-bold text-green-600 dark:text-green-400">
                      ₹{calculatedSavings.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                    {billingDeal.discountPercentage}% off ₹{billAmount}
                  </div>
                </div>
              )}
              
              <div className="flex gap-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setBillingDeal(null);
                    setBillAmount('');
                    setCalculatedSavings(0);
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => {
                    if (calculatedSavings > 0) {
                      updateBillMutation.mutate({
                        dealId: billingDeal.id,
                        billAmount: parseFloat(billAmount),
                        savings: calculatedSavings
                      });
                    }
                  }}
                  disabled={!billAmount || calculatedSavings <= 0 || updateBillMutation.isPending}
                  className="flex-1 bg-orange-600 hover:bg-orange-700"
                >
                  {updateBillMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Receipt className="h-4 w-4 mr-2" />
                      Record Savings
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* PIN Verification Dialog */}
      <PinVerificationDialog
        open={showPinDialog}
        onOpenChange={setShowPinDialog}
        dealId={pinDialogDeal?.id || 0}
        dealTitle={pinDialogDeal?.title || ''}
        dealDiscountPercentage={pinDialogDeal?.discountPercentage || 0}
        onSuccess={async () => {
          setShowPinDialog(false);
          setPinDialogDeal(null);
          // Refresh all relevant data
          await Promise.all([
            queryClient.invalidateQueries({ queryKey: ['/api/deals'] }),
            queryClient.invalidateQueries({ queryKey: ["/api/users/claims"] }),
            queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] }),
            queryClient.invalidateQueries({ queryKey: ["/api/wishlist"] }),
          ]);
          queryClient.refetchQueries({ queryKey: ["/api/auth/me"] });
        }}
      />
    </div>
  );
};

export default DealList;