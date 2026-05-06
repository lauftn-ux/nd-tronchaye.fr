import sgMail from "@sendgrid/mail";
import { MailDataRequired } from "@sendgrid/mail";

if (!process.env.SENDGRID_API_KEY) {
  console.error("SENDGRID_API_KEY n'est pas défini dans les variables d'environnement");
}
sgMail.setApiKey(process.env.SENDGRID_API_KEY ?? "");

const SUBJECT_LABELS: Record<string, string> = {
  information: "Demande d'information",
  baptism: "Préparation au baptême",
  marriage: "Préparation au mariage",
  mass: "Demande de messe",
  visit: "Organisation d'une visite",
  other: "Autre demande",
};

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendEmail(emailData: MailDataRequired): Promise<boolean> {
  try {
    await sgMail.send(emailData);
    return true;
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    return false;
  }
}

export async function sendContactFormEmail(
  name: string,
  email: string,
  subject: string,
  message: string,
  recipientEmail: string = "sanctuaire@nd-tronchaye.fr"
): Promise<boolean> {
  const frenchSubject = SUBJECT_LABELS[subject] ?? subject;
  const emailSubject = `[Contact Notre Dame de la Tronchaye] ${frenchSubject}`;

  const textContent = `Nouveau message de contact du site Notre Dame de la Tronchaye

De : ${name} (${email})
Sujet : ${frenchSubject}

Message :
${message}
`;

  const htmlContent = `
    <h2>Nouveau message de contact du site Notre Dame de la Tronchaye</h2>
    <p><strong>De :</strong> ${escapeHtml(name)} (${escapeHtml(email)})</p>
    <p><strong>Sujet :</strong> ${escapeHtml(frenchSubject)}</p>
    <h3>Message :</h3>
    <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
  `;

  const senderEmail = process.env.SENDGRID_VERIFIED_SENDER ?? "noreply@example.com";

  return sendEmail({
    to: recipientEmail,
    from: senderEmail,
    subject: emailSubject,
    content: [
      { type: "text/plain", value: textContent },
      { type: "text/html", value: htmlContent },
    ],
  });
}