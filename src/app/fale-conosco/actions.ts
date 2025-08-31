"use server";

import { z } from "zod";

const contactSchema = z.object({
  firstName: z.string().min(1, { message: "O nome é obrigatório." }),
  lastName: z.string().min(1, { message: "O sobrenome é obrigatório." }),
  email: z.string().email({ message: "Por favor, insira um email válido." }),
  message: z.string().min(1, { message: "A mensagem não pode estar vazia." }),
});

export async function sendContactEmail(formData: FormData) {
  const data = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    message: formData.get("message"),
  };

  const parsed = contactSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, message: "Dados inválidos." };
  }

  // **Simulação de Envio de Email**
  // Em uma aplicação real, aqui você usaria um serviço como SendGrid, Resend, etc.
  console.log("--- Nova Mensagem de Contato ---");
  console.log(`Nome: ${parsed.data.firstName} ${parsed.data.lastName}`);
  console.log(`Email: ${parsed.data.email}`);
  console.log(`Mensagem: ${parsed.data.message}`);
  console.log("--------------------------------");
  
  // Aqui você pode adicionar a lógica para enviar o email
  // Ex: await resend.emails.send({ ... });

  return { success: true, message: "Mensagem recebida!" };
}
