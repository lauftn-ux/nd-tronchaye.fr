import sgMail from '@sendgrid/mail';
import { MailDataRequired } from '@sendgrid/mail';

// Configurer l'API key de SendGrid
if (!process.env.SENDGRID_API_KEY) {
  console.error("SENDGRID_API_KEY n'est pas défini dans les variables d'environnement");
}
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

/**
 * Envoie un email via SendGrid
 */
export async function sendEmail(emailData: MailDataRequired): Promise<boolean> {
  try {
    await sgMail.send(emailData);
    console.log(`Email envoyé à ${emailData.to}`);
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return false;
  }
}

/**
 * Envoie une notification du formulaire de contact au destinataire spécifié
 */
export async function sendContactFormEmail(
  name: string,
  email: string,
  subject: string,
  message: string,
  recipientEmail: string = 'sanctuaire@nd-tronchaye.fr'
): Promise<boolean> {
  const emailSubject = `[Contact Notre Dame de la Tronchaye] ${subject}`;
  
  // Corps du message en HTML et texte brut
  const textContent = `
    Nouveau message de contact du site Notre Dame de la Tronchaye
    
    De : ${name} (${email})
    Sujet : ${subject}
    
    Message :
    ${message}
  `;
  
  const htmlContent = `
    <h2>Nouveau message de contact du site Notre Dame de la Tronchaye</h2>
    <p><strong>De :</strong> ${name} (${email})</p>
    <p><strong>Sujet :</strong> ${subject}</p>
    <h3>Message :</h3>
    <p>${message.replace(/\n/g, '<br>')}</p>
  `;
  
  const senderEmail = process.env.SENDGRID_VERIFIED_SENDER || 'noreply@example.com';
  console.log(`Envoi de l'email depuis l'adresse vérifiée: ${senderEmail} vers ${recipientEmail}`);
  
  return sendEmail({
    to: recipientEmail,
    from: senderEmail, // Utilise l'adresse vérifiée dans SendGrid
    subject: emailSubject,
    content: [
      {
        type: 'text/plain',
        value: textContent
      },
      {
        type: 'text/html',
        value: htmlContent
      }
    ]
  });
}