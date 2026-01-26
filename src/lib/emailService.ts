import emailjs from '@emailjs/browser';

// EmailJS configuratie
const EMAILJS_SERVICE_ID = 'service_eu83xgf';
const EMAILJS_TEMPLATE_ID = 'template_g5vf9at';
const EMAILJS_PUBLIC_KEY = 'd8wPu78CAEwTUSYvx';

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

// Block field definitions
const BLOCK_FIELDS = {
  CONTACT: ['voornaam', 'achternaam', 'email', 'telefoon', 'contactVoorkeur', 'contactTiming'],
  ADRES: ['adres', 'huisnummer', 'postcode', 'woonplaats'],
  AANVRAAG: ['products', 'anderProduct', 'aantalKozijnen', 'orientation'],
  EXTRA: ['opmerking', 'wensen', 'bestandsnaam'],
};

/**
 * Check if a value is empty
 */
const isEmptyValue = (value: any): boolean => {
  if (value === null || value === undefined || value === '') return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (typeof value === 'string' && value.trim() === '') return true;
  return false;
};

/**
 * Pick only filled fields from an object
 */
const pickFilled = (fields: Record<string, any>, keys: string[]): Record<string, any> => {
  const result: Record<string, any> = {};
  for (const key of keys) {
    if (fields.hasOwnProperty(key) && !isEmptyValue(fields[key])) {
      result[key] = fields[key];
    }
  }
  return result;
};

/**
 * Format fields into readable lines
 */
const formatLines = (fields: Record<string, any>): string => {
  return Object.entries(fields)
    .map(([key, value]) => {
      const label = formatFieldLabel(key);
      const formattedValue = formatFieldValue(value);
      return `${label}: ${formattedValue}`;
    })
    .join('\n');
};

/**
 * Build email sections based on form type and fields
 */
const buildEmailSections = (type: string, fields: Record<string, any>): {
  contact_block: string;
  adres_block: string;
  aanvraag_block: string;
  extra_block: string;
} => {
  const contactFields = pickFilled(fields, BLOCK_FIELDS.CONTACT);
  const adresFields = pickFilled(fields, BLOCK_FIELDS.ADRES);
  const aanvraagFields = pickFilled(fields, BLOCK_FIELDS.AANVRAAG);
  const extraFields = pickFilled(fields, BLOCK_FIELDS.EXTRA);

  return {
    contact_block: Object.keys(contactFields).length > 0 
      ? `=== CONTACT ===\n${formatLines(contactFields)}` 
      : '',
    adres_block: Object.keys(adresFields).length > 0 
      ? `=== ADRES ===\n${formatLines(adresFields)}` 
      : '',
    aanvraag_block: Object.keys(aanvraagFields).length > 0 
      ? `=== AANVRAAG ===\n${formatLines(aanvraagFields)}` 
      : '',
    extra_block: Object.keys(extraFields).length > 0 
      ? `=== OPMERKINGEN / EXTRA ===\n${formatLines(extraFields)}` 
      : '',
  };
};

/**
 * Stuurt een geformatteerde email met formuliergegevens
 */
export const sendFormEmail = async (data: FormSubmissionData): Promise<void> => {
  // Formatteer de velden naar een leesbaar formaat (fallback)
  const formattedFields = Object.entries(data.fields)
    .filter(([_, value]) => !isEmptyValue(value))
    .map(([key, value]) => {
      const label = formatFieldLabel(key);
      const formattedValue = formatFieldValue(value);
      return `${label}: ${formattedValue}`;
    })
    .join('\n');

  // Build structured sections
  const sections = buildEmailSections(data.type, data.fields);

  // Email parameters
  const templateParams = {
    to_email: EMAIL_CONFIG.recipientEmail,
    subject: `[Kupro] Nieuwe ${data.type.toLowerCase()}`,
    type: data.type,
    page_url: data.pageUrl,
    timestamp: data.timestamp,
    fields: formattedFields, // Fallback
    // Structured blocks
    contact_block: sections.contact_block,
    adres_block: sections.adres_block,
    aanvraag_block: sections.aanvraag_block,
    extra_block: sections.extra_block,
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
    anderProduct: 'Anders, namelijk',
    wensen: 'Wensen / extra info',
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
