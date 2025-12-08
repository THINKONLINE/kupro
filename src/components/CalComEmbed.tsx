import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

declare global {
  interface Window {
    Cal?: any;
  }
}

interface CalComEmbedProps {
  onNext: () => void;
  onPrev: () => void;
}

export const CalComEmbed = ({ onNext, onPrev }: CalComEmbedProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Clear any existing Cal.com content
    const container = document.getElementById("my-cal-inline-showroom-afspraak-kupro");
    if (container) {
      container.innerHTML = "";
    }

    // Check if script is already loaded
    const existingScript = document.querySelector('script[src="https://app.cal.com/embed/embed.js"]');
    
    const initCal = () => {
      try {
        if (window.Cal) {
          window.Cal("init", "showroom-afspraak-kupro", { origin: "https://app.cal.com" });
          window.Cal.ns["showroom-afspraak-kupro"]("inline", {
            elementOrSelector: "#my-cal-inline-showroom-afspraak-kupro",
            config: { layout: "month_view" },
            calLink: "kupro/showroom-afspraak-kupro",
          });
          window.Cal.ns["showroom-afspraak-kupro"]("ui", {
            hideEventTypeDetails: false,
            layout: "month_view",
          });
          
          // Wait a bit for the widget to render
          setTimeout(() => setIsLoading(false), 1500);
        }
      } catch (err) {
        console.error("Cal.com init error:", err);
        setError("Er ging iets mis bij het laden van de kalender.");
        setIsLoading(false);
      }
    };

    if (existingScript && window.Cal) {
      // Script already loaded, just init
      initCal();
    } else {
      // Load the script
      const script = document.createElement("script");
      script.src = "https://app.cal.com/embed/embed.js";
      script.async = true;
      script.onload = () => {
        initCal();
      };
      script.onerror = () => {
        setError("Kon de kalender niet laden. Controleer je internetverbinding.");
        setIsLoading(false);
      };
      document.head.appendChild(script);
    }

    return () => {
      // Cleanup container on unmount
      const container = document.getElementById("my-cal-inline-showroom-afspraak-kupro");
      if (container) {
        container.innerHTML = "";
      }
    };
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Plan je afspraak</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Selecteer hieronder een datum en tijd die je het beste uitkomt
          </p>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center h-[500px] rounded-lg border bg-card">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Kalender laden...</p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="flex flex-col items-center justify-center h-[500px] rounded-lg border bg-card">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Opnieuw proberen
            </Button>
          </div>
        )}

        {/* Cal.com Inline Widget */}
        <div
          id="my-cal-inline-showroom-afspraak-kupro"
          className={`rounded-lg border bg-card overflow-auto ${isLoading || error ? 'hidden' : ''}`}
          style={{ width: "100%", height: "700px" }}
        />
      </div>

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onPrev}
          className="flex-1"
          size="lg"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Vorige
        </Button>
        <Button type="button" onClick={onNext} className="flex-1" size="lg">
          Volgende stap
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
