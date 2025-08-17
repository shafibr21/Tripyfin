const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      title: "Create a tour",
      description: "Set budget rules, categories, and invite travelers."
    },
    {
      number: 2,
      title: "Capture & approve",
      description: "Receipts flow to approvers with smart suggestions."
    },
    {
      number: 3,
      title: "Report & export",
      description: "One‑click exports to your accounting tools."
    }
  ];

  return (
    <section id="how" className="bg-gradient-brand animate-gradient">
      <div className="container py-16 md:py-24 text-primary-foreground">
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">How it works</h2>
            <p className="opacity-90">Launch in minutes — TRIPYFIN fits your current trip planning workflow.</p>
          </div>
          <ol className="md:col-span-2 grid gap-6">
            {steps.map((step) => (
              <li key={step.number} className="p-6 rounded-xl bg-background/10 backdrop-blur">
                <strong className="block mb-1">{step.number}. {step.title}</strong>
                {step.description}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;