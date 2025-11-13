import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormProgress } from "@/components/FormProgress";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const formSchema = z.object({
  producten: z.array(z.string()).min(1, "Selecteer minimaal één product"),
  anderProduct: z.string().optional(),
  aantalKozijnen: z.string().optional(),
  orientatie: z.string().min(1, "Maak een keuze"),
  voornaam: z.string().min(1, "Voornaam is verplicht"),
  achternaam: z.string().min(1, "Achternaam is verplicht"),
  adres: z.string().optional(),
  nummer: z.string().optional(),
  postcode: z.string().optional(),
  woonplaats: z.string().optional(),
  email: z.string().email("Ongeldig emailadres").min(1, "Email is verplicht"),
  telefoon: z.string().min(1, "Telefoonnummer is verplicht"),
  opmerkingen: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const ShowroomRoute = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      producten: [],
      orientatie: "",
    },
  });

  const watchProducten = form.watch("producten");
  const showKozijnenVraag = watchProducten?.includes("kozijnen");

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
    toast.success("Afspraak gepland!");
    navigate("/bedankt-showroom");
  };

  const nextStep = async () => {
    let fields: any = [];
    if (currentStep === 1) {
      fields = ["producten", "orientatie"];
      if (showKozijnenVraag) fields.push("aantalKozijnen");
    }
    // Step 2 is now Calendly embed, no validation needed
    
    const isValid = fields.length > 0 ? await form.trigger(fields) : true;
    if (isValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate("/contact-aanvragen")}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Terug
          </Button>

          <div className="bg-card rounded-2xl shadow-xl p-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Afspraak maken in de showroom</h1>
            <p className="text-muted-foreground mb-8">
              Plan jouw bezoek aan onze showroom in een paar eenvoudige stappen
            </p>

            <FormProgress 
              currentStep={currentStep} 
              totalSteps={3} 
              stepLabels={["Product & Oriëntatie", "Datum & Tijd", "Jouw gegevens"]} 
            />

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {currentStep === 1 && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <FormField
                      control={form.control}
                      name="producten"
                      render={() => (
                        <FormItem>
                          <FormLabel>Waar kunnen wij bij helpen? *</FormLabel>
                          <div className="space-y-3">
                            {[
                              { value: "kozijnen", label: "Kunststof kozijnen" },
                              { value: "dakkapel", label: "Dakkapel" },
                              { value: "gevelbekleding", label: "Gevelbekleding" },
                              { value: "deuren", label: "Kunststof deuren" },
                              { value: "schuifpui", label: "Schuifpui" },
                            ].map((item) => (
                              <FormField
                                key={item.value}
                                control={form.control}
                                name="producten"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 border rounded-lg p-4 hover:bg-secondary/50 transition-colors">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(item.value)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, item.value])
                                            : field.onChange(
                                                field.value?.filter((value) => value !== item.value)
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer flex-1">
                                      {item.label}
                                    </FormLabel>
                                  </FormItem>
                                )}
                              />
                            ))}
                            <FormField
                              control={form.control}
                              name="anderProduct"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input placeholder="Iets anders, namelijk..." {...field} />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {showKozijnenVraag && (
                      <FormField
                        control={form.control}
                        name="aantalKozijnen"
                        render={({ field }) => (
                          <FormItem className="animate-in fade-in duration-200">
                            <FormLabel>Over hoeveel kozijnen gaat het ongeveer?</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                value={field.value}
                                className="grid grid-cols-2 gap-3"
                              >
                                {[
                                  { value: "1-3", label: "1-3 kozijnen" },
                                  { value: "4-6", label: "4-6 kozijnen" },
                                  { value: "7+", label: "7 of meer" },
                                  { value: "niet-zeker", label: "Nog niet zeker" },
                                ].map((item) => (
                                  <FormItem key={item.value} className="flex items-center space-x-3 space-y-0 border rounded-lg p-4 hover:bg-secondary/50 transition-colors cursor-pointer">
                                    <FormControl>
                                      <RadioGroupItem value={item.value} />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer flex-1">
                                      {item.label}
                                    </FormLabel>
                                  </FormItem>
                                ))}
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={form.control}
                      name="orientatie"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hoe ver ben je al in de oriëntatie? *</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="space-y-3"
                            >
                              {[
                                { value: "oriënteren", label: "Ik ben me nog aan het oriënteren" },
                                { value: "weet-wat-ik-wil", label: "Ik weet al ongeveer wat ik wil" },
                                { value: "andere-offertes", label: "Ik heb al offertes van andere leveranciers" },
                                { value: "adviseren", label: "Ik laat me graag adviseren" },
                              ].map((item) => (
                                <FormItem key={item.value} className="flex items-center space-x-3 space-y-0 border rounded-lg p-4 hover:bg-secondary/50 transition-colors cursor-pointer">
                                  <FormControl>
                                    <RadioGroupItem value={item.value} />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer flex-1">
                                    {item.label}
                                  </FormLabel>
                                </FormItem>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="button" onClick={nextStep} className="w-full" size="lg">
                      Volgende stap
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Plan je afspraak</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Selecteer hieronder een datum en tijd die je het beste uitkomt
                        </p>
                      </div>
                      
                      {/* Calendly Inline Widget */}
                      <div className="rounded-lg border bg-card overflow-hidden" style={{ minHeight: '700px' }}>
                        <iframe
                          src="https://calendly.com/jouw-calendly-link"
                          width="100%"
                          height="700"
                          frameBorder="0"
                          title="Calendly Afspraak"
                          className="rounded-lg"
                        />
                      </div>
                      
                      <p className="text-xs text-muted-foreground text-center">
                        ⚠️ Vervang de Calendly URL in de code met jouw eigen Calendly link
                      </p>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCurrentStep(1)}
                        className="flex-1"
                        size="lg"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Vorige
                      </Button>
                      <Button type="button" onClick={nextStep} className="flex-1" size="lg">
                        Volgende stap
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-4 animate-in fade-in duration-300">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="voornaam"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Voornaam *</FormLabel>
                            <FormControl>
                              <Input placeholder="Voornaam" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="achternaam"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Achternaam *</FormLabel>
                            <FormControl>
                              <Input placeholder="Achternaam" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="adres"
                        render={({ field }) => (
                          <FormItem className="col-span-2">
                            <FormLabel>Adres</FormLabel>
                            <FormControl>
                              <Input placeholder="Straatnaam" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="nummer"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nummer</FormLabel>
                            <FormControl>
                              <Input placeholder="Nr." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="postcode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Postcode</FormLabel>
                            <FormControl>
                              <Input placeholder="1234 AB" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="woonplaats"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Woonplaats</FormLabel>
                            <FormControl>
                              <Input placeholder="Woonplaats" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Emailadres *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="jouw@email.nl" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="telefoon"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefoonnummer *</FormLabel>
                          <FormControl>
                            <Input placeholder="06 12345678" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="opmerkingen"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Opmerkingen</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Eventuele opmerkingen of vragen..." 
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCurrentStep(2)}
                        className="flex-1"
                        size="lg"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Vorige
                      </Button>
                      <Button type="submit" className="flex-1" size="lg">
                        Plan mijn afspraak in
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowroomRoute;
