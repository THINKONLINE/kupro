import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

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
  const calInitialized = useRef(false);

  useEffect(() => {
    if (calInitialized.current) return;
    calInitialized.current = true;

    // Load Cal.com embed script
    const script = document.createElement("script");
    script.src = "https://app.cal.com/embed/embed.js";
    script.async = true;
    script.onload = () => {
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
      }
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup if needed
      if (script.parentNode) {
        script.parentNode.removeChild(script);
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

        {/* Cal.com Inline Widget */}
        <div
          id="my-cal-inline-showroom-afspraak-kupro"
          className="rounded-lg border bg-card overflow-auto"
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
