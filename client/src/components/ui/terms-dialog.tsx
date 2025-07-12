import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface TermsDialogProps {
  children: React.ReactNode;
}

export function TermsDialog({ children }: TermsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Terms and Conditions
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6 text-sm">
            <section>
              <h3 className="font-semibold text-lg mb-3">1. Acceptance of Terms</h3>
              <p className="text-muted-foreground">
                By registering and using the Instoredealz platform, you accept and agree to be bound by the terms and provisions of this agreement.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-3">2. Service Description</h3>
              <p className="text-muted-foreground">
                Instoredealz is a platform that connects customers with local businesses offering discounts and deals. We provide a marketplace for vendors to showcase their offers and for customers to discover and claim deals.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-3">3. Vendor Responsibilities</h3>
              <div className="space-y-2 text-muted-foreground">
                <p>• Provide accurate business information and documentation</p>
                <p>• Honor all published deals and discounts</p>
                <p>• Maintain valid business licenses and certifications</p>
                <p>• Respond to customer inquiries in a timely manner</p>
                <p>• Comply with all applicable laws and regulations</p>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-3">4. Customer Responsibilities</h3>
              <div className="space-y-2 text-muted-foreground">
                <p>• Use the platform in accordance with these terms</p>
                <p>• Provide accurate personal information</p>
                <p>• Respect vendor policies and terms for individual deals</p>
                <p>• Report any issues or concerns promptly</p>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-3">5. Privacy Policy</h3>
              <p className="text-muted-foreground">
                We are committed to protecting your privacy. Personal information collected is used solely for platform operations and improving our services. We do not sell or share personal data with third parties without consent.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-3">6. Prohibited Activities</h3>
              <div className="space-y-2 text-muted-foreground">
                <p>• Publishing false or misleading information</p>
                <p>• Engaging in fraudulent activities</p>
                <p>• Violating intellectual property rights</p>
                <p>• Attempting to manipulate platform ratings or reviews</p>
                <p>• Using the platform for illegal activities</p>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-3">7. Account Termination</h3>
              <p className="text-muted-foreground">
                We reserve the right to suspend or terminate accounts that violate these terms or engage in inappropriate behavior. Users may also terminate their accounts at any time.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-3">8. Limitation of Liability</h3>
              <p className="text-muted-foreground">
                Instoredealz is not liable for any damages arising from the use of our platform, including but not limited to direct, indirect, incidental, or consequential damages.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-3">9. Changes to Terms</h3>
              <p className="text-muted-foreground">
                We reserve the right to modify these terms at any time. Users will be notified of significant changes, and continued use of the platform constitutes acceptance of the revised terms.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-3">10. Contact Information</h3>
              <p className="text-muted-foreground">
                For questions about these terms, please contact us at support@instoredealz.com or through our customer support portal.
              </p>
            </section>

            <section className="border-t pt-4">
              <p className="text-xs text-muted-foreground">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}