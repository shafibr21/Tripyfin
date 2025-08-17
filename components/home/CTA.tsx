import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const CTA = () => {
  const handlePrimary = () => toast.success("Getting started soon — demo action");

  return (
    <section id="cta" className="bg-accent text-accent-foreground">
      <div className="container py-14 md:py-20 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold">Ready to keep every tour on budget?</h2>
          <p className="mt-2 opacity-90">Start free today — no credit card required.</p>
        </div>
        <div className="flex gap-4">
          <Button variant="default" size="lg" onClick={handlePrimary}>Create account</Button>
        </div>
      </div>
    </section>
  );
};

export default CTA;