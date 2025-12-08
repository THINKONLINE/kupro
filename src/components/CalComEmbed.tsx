import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface CalComEmbedProps {
  onNext: () => void;
  onPrev: () => void;
}

export const CalComEmbed = ({ onNext, onPrev }: CalComEmbedProps) => {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "showroom-afspraak-kupro" });
      cal("ui", {
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
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
        <div className="rounded-lg border bg-card overflow-hidden" style={{ height: "700px" }}>
          <Cal
            namespace="showroom-afspraak-kupro"
            calLink="kupro/showroom-afspraak-kupro"
            style={{ width: "100%", height: "100%", overflow: "scroll" }}
            config={{ layout: "month_view" }}
          />
        </div>
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
