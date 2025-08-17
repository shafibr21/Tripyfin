import { Receipt, Plane, PieChart } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Receipt,
      title: "Smart receipt capture",
      description: "Snap, email, or import — we auto-categorize and extract trip details with high accuracy."
    },
    {
      icon: Plane,
      title: "Per‑tour budgets",
      description: "Set limits by tour, traveler, or category. Get alerts before overspend happens."
    },
    {
      icon: PieChart,
      title: "Instant reporting",
      description: "Export-ready summaries and beautiful dashboards for finance and operations."
    }
  ];

  return (
    <section id="features" className="bg-secondary">
      <div className="container py-16 md:py-24">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <article key={index} className="p-6 bg-card rounded-xl shadow-elevated transition-transform hover:-translate-y-1">
                <div className="w-12 h-12 rounded-lg bg-accent text-accent-foreground flex items-center justify-center mb-4">
                  <IconComponent />
                </div>
                <h3 className="text-2xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  )
}

export default Features