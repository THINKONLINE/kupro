import emailjs from '@emailjs/browser';

// EmailJS configuratie
const EMAILJS_SERVICE_ID = 'service_5waocs8';
const EMAILJS_TEMPLATE_ID = 'template_zau1wdm';
const EMAILJS_PUBLIC_KEY = 'T8TiAUxaUpcL2hboT';

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

// Email configuratie - hier kun je het ontvangende emailadres aanpassen
export const EMAIL_CONFIG = {
  recipientEmail: 'think.online.test@gmail.com', // <- Hier kun je het emailadres wijzigen
};

export interface FormSubmissionData {
  type: 'Offerte aanvragen' | 'Showroom afspraak' | 'Thuis afspraak' | 'Meer informatie opvragen';
  pageUrl: string;
  timestamp: string;
  fields: Record<string, any>;
}

/**
 * Stuurt een geformatteerde email met formuliergegevens
 */
export const sendFormEmail = async (data: FormSubmissionData): Promise<void> => {
  // Formatteer de velden naar een leesbaar formaat
  const formattedFields = Object.entries(data.fields)
    .map(([key, value]) => {
      const label = formatFieldLabel(key);
      const formattedValue = formatFieldValue(value);
      return `${label}: ${formattedValue}`;
    })
    .join('\n');

  // Email parameters
  const templateParams = {
    to_email: EMAIL_CONFIG.recipientEmail,
    subject: `[Kupro] Nieuwe ${data.type.toLowerCase()}`,
    type: data.type,
    page_url: data.pageUrl,
    timestamp: data.timestamp,
    fields: formattedFields,
    // Individuele velden voor betere template formatting
    voornaam: data.fields.voornaam || '',
    achternaam: data.fields.achternaam || '',
    adres: data.fields.adres || '',
    huisnummer: data.fields.huisnummer || '',
    postcode: data.fields.postcode || '',
    woonplaats: data.fields.woonplaats || '',
    email: data.fields.email || '',
    telefoon: data.fields.telefoon || '',
    opmerking: data.fields.opmerking || '',
  };

  try {
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );
    
    console.log('Email verzonden:', response.status, response.text);
  } catch (error) {
    console.error('Fout bij verzenden email:', error);
    throw new Error('Er ging iets mis bij het verzenden van het formulier. Probeer het opnieuw.');
  }
};

/**
 * Maakt veldnamen leesbaar
 */
const formatFieldLabel = (key: string): string => {
  const labelMap: Record<string, string> = {
    voornaam: 'Voornaam',
    achternaam: 'Achternaam',
    adres: 'Adres',
    huisnummer: 'Huisnummer',
    postcode: 'Postcode',
    woonplaats: 'Woonplaats',
    email: 'E-mailadres',
    telefoon: 'Telefoonnummer',
    opmerking: 'Opmerking',
    products: 'Gekozen product(en)',
    aantalKozijnen: 'Aantal kozijnen',
    orientation: 'Waar in het oriëntatieproces',
    contactVoorkeur: 'Hoe kunnen wij jou het beste bereiken',
    contactTiming: 'Wanneer kunnen wij jou het beste bereiken',
    bestandsnaam: 'Bijlage',
  };
  
  return labelMap[key] || key;
};

/**
 * Formatteer waarden voor in de email
 */
const formatFieldValue = (value: any): string => {
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  if (typeof value === 'boolean') {
    return value ? 'Ja' : 'Nee';
  }
  if (value === null || value === undefined || value === '') {
    return '(niet ingevuld)';
  }
  return String(value);
};
