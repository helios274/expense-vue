import { Button } from "@/components/ui/button";

const Home = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-background text-foreground py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Simplify Your Finances with{" "}
            <span className="text-primary">ExpenseVue</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Effortlessly track your expenses and take control of your finances.
            Budget smarter and reach your goals faster.
          </p>
          <div className="mt-8 space-x-4">
            <Button
              variant="default"
              className="bg-primary text-primary-foreground px-6 py-3"
            >
              Get Started
            </Button>
            <Button variant="outline" className="px-6 py-3">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-16 bg-secondary text-secondary-foreground"
      >
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center">
            Why Choose ExpenseVue?
          </h2>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              title="Track Expenses"
              description="Easily monitor your daily spending and stay on top of your budget."
              icon="📊"
            />
            <FeatureCard
              title="Set Goals"
              description="Set savings goals and watch your progress in real-time."
              icon="🎯"
            />
            <FeatureCard
              title="Secure & Private"
              description="Your data is encrypted and secure, ensuring your privacy."
              icon="🔒"
            />
          </div>
        </div>
      </section>
    </>
  );
};

const FeatureCard = ({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) => {
  return (
    <div className="p-6 bg-card rounded-lg shadow-md">
      <div className="text-4xl">{icon}</div>
      <h3 className="mt-4 text-xl font-bold">{title}</h3>
      <p className="mt-2 text-muted-foreground">{description}</p>
    </div>
  );
};

export default Home;
