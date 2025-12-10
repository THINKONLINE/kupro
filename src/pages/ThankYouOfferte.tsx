import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Home } from "lucide-react";

const ThankYouOfferte = () => {
  const navigate = useNavigate();

  const inspirationLinks = [
    { title: "Kozijnen", href: "https://www.kupro.nl/producten/kunststof-kozijnen" },
    { title: "Deuren", href: "https://www.kupro.nl/producten/kunststof-deuren" },
    { title: "Schuifpuien", href: "https://www.kupro.nl/producten/schuifpuien" },
    { title: "Dakkapellen", href: "https://www.kupro.nl/producten/dakkapellen" },
    { title: "Gevelbekleding", href: "https://www.kupro.nl/producten/kunststof-gevelbekleding" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background py-6 sm:py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-card rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 md:p-12 text-center">
            <div className="mb-4 sm:mb-6 flex justify-center">
              <CheckCircle2 className="w-14 h-14 sm:w-20 sm:h-20 text-success" />
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Bedankt voor je bericht!
            </h1>
            
            <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8">
              We gaan voor je aan de slag – je hoort binnen twee werkdagen van ons.
            </p>

            <div className="bg-secondary/50 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4">
                In de tussentijd alvast wat inspiratie opdoen?
              </h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
                {inspirationLinks.map((link) => (
                  <Button
                    key={link.title}
                    variant="outline"
                    className="w-full text-sm sm:text-base"
                    onClick={() => window.open(link.href, '_blank')}
                  >
                    {link.title}
                  </Button>
                ))}
              </div>
            </div>

            <Button
              size="lg"
              asChild
              className="gap-2"
            >
              <a href="https://www.kupro.nl/">
                <Home className="w-4 h-4" />
                Terug naar home
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYouOfferte;
