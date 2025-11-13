import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  voornaam: z.string().min(1, "Voornaam is verplicht"),
  achternaam: z.string().min(1, "Achternaam is verplicht"),
  adres: z.string().min(1, "Adres is verplicht"),
  nummer: z.string().min(1, "Huisnummer is verplicht"),
  postcode: z.string().optional(),
  woonplaats: z.string().optional(),
  email: z.string().email("Ongeldig emailadres").min(1, "Email is verplicht"),
  telefoon: z.string().min(1, "Telefoonnummer is verplicht"),
  opmerkingen: z.string().optional(),
  contactvoorkeur: z.enum(["bellen", "email", "whatsapp"]),
  bereikbaarheid: z.enum(["ochtend", "middag", "avond", "maakt-niet-uit"]),
});

type FormData = z.infer<typeof formSchema>;

const OfferteRoute = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const isThuisAfspraak = window.location.pathname === "/thuis-afspraak";

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contactvoorkeur: "bellen",
      bereikbaarheid: "maakt-niet-uit",
    },
  });

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
    toast.success("Formulier verzonden!");
    navigate(isThuisAfspraak ? "/bedankt-thuis-afspraak" : "/bedankt-offerte");
  };

  const nextStep = async () => {
    const fields = currentStep === 1 
      ? ["voornaam", "achternaam", "adres", "nummer", "email", "telefoon"]
      : ["contactvoorkeur", "bereikbaarheid"];
    
    const isValid = await form.trigger(fields as any);
    if (isValid) {
      setCurrentStep(2);
    }
  };

  const title = isThuisAfspraak ? "Thuisafspraak maken" : "Offerte aanvragen";

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
            <h1 className="text-3xl font-bold text-foreground mb-2">{title}</h1>
            <p className="text-muted-foreground mb-8">
              Vul onderstaande gegevens in en we nemen zo snel mogelijk contact met je op
            </p>

            <FormProgress currentStep={currentStep} totalSteps={2} stepLabels={["Jouw gegevens", "Contactvoorkeur"]} />

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {currentStep === 1 && (
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
                            <FormLabel>Adres *</FormLabel>
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
                            <FormLabel>Nummer *</FormLabel>
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

                    <Button type="button" onClick={nextStep} className="w-full" size="lg">
                      Volgende stap
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <FormField
                      control={form.control}
                      name="contactvoorkeur"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hoe kunnen wij jou het beste bereiken? *</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="grid grid-cols-1 gap-3"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0 border rounded-lg p-4 hover:bg-secondary/50 transition-colors cursor-pointer">
                                <FormControl>
                                  <RadioGroupItem value="bellen" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer flex-1">
                                  Bellen
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0 border rounded-lg p-4 hover:bg-secondary/50 transition-colors cursor-pointer">
                                <FormControl>
                                  <RadioGroupItem value="email" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer flex-1">
                                  E-mail
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0 border rounded-lg p-4 hover:bg-secondary/50 transition-colors cursor-pointer">
                                <FormControl>
                                  <RadioGroupItem value="whatsapp" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer flex-1">
                                  WhatsApp
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bereikbaarheid"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Wanneer kunnen wij jou het beste bereiken? *</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="grid grid-cols-2 gap-3"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0 border rounded-lg p-4 hover:bg-secondary/50 transition-colors cursor-pointer">
                                <FormControl>
                                  <RadioGroupItem value="ochtend" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer flex-1">
                                  Ochtend
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0 border rounded-lg p-4 hover:bg-secondary/50 transition-colors cursor-pointer">
                                <FormControl>
                                  <RadioGroupItem value="middag" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer flex-1">
                                  Middag
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0 border rounded-lg p-4 hover:bg-secondary/50 transition-colors cursor-pointer">
                                <FormControl>
                                  <RadioGroupItem value="avond" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer flex-1">
                                  Avond
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0 border rounded-lg p-4 hover:bg-secondary/50 transition-colors cursor-pointer">
                                <FormControl>
                                  <RadioGroupItem value="maakt-niet-uit" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer flex-1">
                                  Maakt niet uit
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

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
                      <Button type="submit" className="flex-1" size="lg">
                        Neem contact met mij op
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

export default OfferteRoute;
