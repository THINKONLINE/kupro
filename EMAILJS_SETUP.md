# EmailJS Setup Instructies

## Stap 1: Maak een gratis EmailJS account
Ga naar [https://www.emailjs.com](https://www.emailjs.com) en maak een gratis account aan.

## Stap 2: Voeg een email service toe
1. Ga naar de EmailJS dashboard
2. Klik op "Email Services" in het menu
3. Klik op "Add New Service"
4. Kies je email provider (Gmail, Outlook, etc.)
5. Volg de instructies om je email te connecteren
6. Kopieer de **Service ID**

## Stap 3: Maak een email template
1. Ga naar "Email Templates" in het menu
2. Klik op "Create New Template"
3. Gebruik deze template inhoud:

### Subject:
```
[Kupro] Nieuwe {{type}}
```

### Content:
```
Nieuwe aanvraag via Kupro

Type aanvraag: {{type}}
Pagina: {{page_url}}
Datum & tijd: {{timestamp}}

=== Contactgegevens ===
Naam: {{voornaam}} {{achternaam}}
Adres: {{adres}} {{huisnummer}}
Postcode: {{postcode}}
Woonplaats: {{woonplaats}}
E-mailadres: {{email}}
Telefoonnummer: {{telefoon}}

=== Formuliergegevens ===
{{fields}}

---
Dit bericht is automatisch verzonden via het Kupro contactformulier.
```

4. Sla de template op en kopieer de **Template ID**

## Stap 4: Vind je Public Key
1. Ga naar "Account" in het menu
2. Kopieer je **Public Key** (staat bij "API Keys")

## Stap 5: Configureer de applicatie
Open het bestand: `src/lib/emailService.ts`

Vervang deze regels (bovenaan het bestand):
```typescript
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID'; // <- Plak hier je Service ID
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'; // <- Plak hier je Template ID
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY'; // <- Plak hier je Public Key
```

## Emailadres wijzigen
Om het ontvangende emailadres te wijzigen, pas deze regel aan in `src/lib/emailService.ts`:
```typescript
export const EMAIL_CONFIG = {
  recipientEmail: 'demy@think-online.nl', // <- Wijzig hier het emailadres
};
```

## Testen
1. Vul een van de formulieren in op de website
2. Controleer of je een email ontvangt op het geconfigureerde emailadres
3. Als het niet werkt, controleer de browser console voor foutmeldingen

## Gratis limiet EmailJS
- 200 emails per maand (gratis)
- Voor meer emails: upgrade naar een betaald plan op EmailJS

## Troubleshooting
- **Fout "Service ID not found"**: Controleer of je Service ID correct is
- **Fout "Template ID not found"**: Controleer of je Template ID correct is
- **Fout "Public Key invalid"**: Controleer of je Public Key correct is
- **Email komt niet aan**: Controleer spam folder en EmailJS dashboard logs
