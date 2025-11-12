import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Home, FileText, Info } from "lucide-react";
import heroImage from "@/assets/customer-service-hero.jpg";

const HomePage = () => {
  const navigate = useNavigate();

  const options = [
    {
      icon: Calendar,
      title: "Ik wil graag een afspraak maken in de showroom",
      route: "/showroom",
      variant: "default" as const,
    },
    {
      icon: Home,
      title: "Ik wil graag een thuis afspraak maken",
      route: "/offerte?type=thuisafspraak",
      variant: "default" as const,
    },
    {
      icon: FileText,
      title: "Ik wil graag een offerte aanvragen",
      route: "/offerte?type=offerte",
      variant: "default" as const,
    },
    {
      icon: Info,
      title: "Ik wil graag meer informatie opvragen",
      route: "/informatie",
      variant: "secondary" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left side - Form options */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                  Hoe kunnen wij jou helpen?
                </h1>
                <p className="text-lg text-muted-foreground">
                  Kies hieronder wat het beste bij jouw situatie past
                </p>
              </div>

              <div className="space-y-4">
                {options.map((option, index) => (
                  <Button
                    key={index}
                    variant={option.variant}
                    size="lg"
                    className="w-full h-auto py-6 px-6 text-left justify-start gap-4 hover:scale-[1.02] transition-all duration-300 shadow-md hover:shadow-xl"
                    onClick={() => navigate(option.route)}
                  >
                    <option.icon className="w-6 h-6 shrink-0" />
                    <span className="text-base font-medium">{option.title}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Right side - Image */}
            <div className="relative hidden md:block">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={heroImage}
                  alt="Klantenservice medewerker"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
