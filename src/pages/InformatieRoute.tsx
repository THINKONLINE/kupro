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
  FormDescription,
} from "@/components/ui/form";
import { FormProgress } from "@/components/FormProgress";
import { ArrowLeft, ArrowRight, Upload } from "lucide-react";
import { toast } from "sonner";
import { sendFormEmail } from "@/lib/emailService";

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z.object({
  producten: z.array(z.string()).min(1, "Selecteer minimaal één product"),
  anderProduct: z.string().optional(),
  wensen: z.string().optional(),
  foto: z
    .any()
    .refine((file) => !file || file?.size <= MAX_FILE_SIZE, `Max bestandsgrootte is 5MB.`)
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Alleen .jpg, .jpeg, .png en .webp bestanden zijn toegestaan."
    )
    .optional(),
  voornaam: z.string().min(1, "Voornaam is verplicht"),
  achternaam: z.string().min(1, "Achternaam is verplicht"),
  adres: z.string().optional(),
  nummer: z.string().optional(),
  postcode: z.string().optional(),
  woonplaats: z.string().optional(),
  email: z.string().email("Ongeldig emailadres").min(1, "Email is verplicht"),
  telefoon: z.string().min(1, "Telefoonnummer is verplicht"),
  opmerkingen: z.string().optional(),
  contactvoorkeur: z.enum(["bellen", "email", "whatsapp"]),
  bereikbaarheid: z.enum(["ochtend", "middag", "avond", "maakt-niet-uit"]),
});

type FormData = z.infer<typeof formSchema>;

const InformatieRoute = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [fileName, setFileName] = useState<string>("");

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      producten: [],
      contactvoorkeur: "bellen",
      bereikbaarheid: "maakt-niet-uit",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      // Verzend email met formuliergegevens
      await sendFormEmail({
        type: 'Meer informatie opvragen',
        pageUrl: window.location.href,
        timestamp: new Date().toLocaleString('nl-NL'),
        fields: {
          voornaam: data.voornaam,
          achternaam: data.achternaam,
          adres: data.adres,
          huisnummer: data.nummer,
          postcode: data.postcode,
          woonplaats: data.woonplaats,
          email: data.email,
          telefoon: data.telefoon,
          opmerking: data.opmerkingen,
          products: data.producten,
          anderProduct: data.anderProduct,
          wensen: data.wensen,
          bestandsnaam: fileName || '(geen bijlage)',
          contactVoorkeur: data.contactvoorkeur,
          contactTiming: data.bereikbaarheid,
        }
      });
      
      toast.success("Aanvraag verzonden!");
      navigate("/bedankt-informatie");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Er ging iets mis bij het verzenden. Probeer het opnieuw.");
    }
  };

  const nextStep = async () => {
    let fields: any = [];
    if (currentStep === 1) {
      fields = ["producten"];
    } else if (currentStep === 2) {
      fields = ["voornaam", "achternaam", "email", "telefoon"];
    }
    
    const isValid = await form.trigger(fields);
    if (isValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background py-6 sm:py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate("/contact-aanvragen")}
            className="mb-4 sm:mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Terug
          </Button>

          <div className="bg-card rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-8">
            <h1 className="text-xl sm:text-3xl font-bold text-foreground mb-2">Meer informatie aanvragen</h1>
            <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8">
              Vertel ons waar je meer over wilt weten en we sturen je vrijblijvend informatie toe
            </p>

            <FormProgress 
              currentStep={currentStep} 
              totalSteps={3} 
              stepLabels={["Informatiebehoefte", "Jouw gegevens", "Contactvoorkeur"]} 
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
                          <FormLabel>Waar zou je graag meer informatie over willen hebben? *</FormLabel>
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

                    <FormField
                      control={form.control}
                      name="wensen"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Eventuele opmerkingen of wensen</FormLabel>
                          <FormDescription>
                            Bijv. aantal kozijnen, type woning, gewenste kleur etc.
                          </FormDescription>
                          <FormControl>
                            <Textarea 
                              placeholder="Vertel ons meer over jouw situatie..." 
                              className="min-h-[120px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="foto"
                      render={({ field: { value, onChange, ...field } }) => (
                        <FormItem>
                          <FormLabel>Upload hier jouw foto (optioneel)</FormLabel>
                          <FormControl>
                            <div className="flex items-center gap-4">
                              <Input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                id="foto-upload"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    setFileName(file.name);
                                    onChange(file);
                                  }
                                }}
                                {...field}
                              />
                              <label htmlFor="foto-upload">
                                <Button type="button" variant="outline" asChild>
                                  <span className="cursor-pointer">
                                    <Upload className="w-4 h-4 mr-2" />
                                    Kies bestand
                                  </span>
                                </Button>
                              </label>
                              {fileName && (
                                <span className="text-sm text-muted-foreground">{fileName}</span>
                              )}
                            </div>
                          </FormControl>
                          <FormDescription>
                            Max 5MB - JPG, PNG of WEBP
                          </FormDescription>
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
                  <div className="space-y-4 animate-in fade-in duration-300">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                      <FormField
                        control={form.control}
                        name="adres"
                        render={({ field }) => (
                          <FormItem className="col-span-2 sm:col-span-3">
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                              placeholder="Eventuele opmerkingen..." 
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
                        onClick={() => setCurrentStep(2)}
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

export default InformatieRoute;
