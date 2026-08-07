import { z } from "zod";

const EmailSchema = z.object({
  subject: z.string().trim().min(1, "Subject is required"),
  name: z.string().trim().min(1, "Name is required"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  message: z.string().trim().optional(),
});

export type EmailFormState = {
  success?: boolean;
  fields?: {
    subject?: string;
    name?: string;
    email?: string;
    message?: string;
  };
  errors?: {
    subject?: string[];
    name?: string[];
    email?: string[];
    message?: string[];
    _form?: string[];
  };
  message?: string;
};

export async function sendEmail(
  prevState: EmailFormState | null,
  formData: FormData
): Promise<EmailFormState> {
  const rawData = {
    subject: (formData.get("subject") as string) || "",
    name: (formData.get("name") as string) || "",
    email: (formData.get("email") as string) || "",
    message: (formData.get("message") as string) || "",
  };

  const validatedFields = EmailSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      fields: rawData,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Validation failed. Please check the fields below.",
    };
  }

  const { subject, name, email, message } = validatedFields.data;

  try {
    const apiKey = process.env.emailAPI || process.env.RESEND_API_KEY;
    if (!apiKey) {
      return {
        success: false,
        fields: rawData,
        errors: { _form: ["API key is missing in environment variables."] },
        message: "Server configuration error.",
      };
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "King Amato <onboarding@resend.dev>",
        to: ["kingamato0@gmail.com"],
        subject: subject || `Portfolio Contact from ${name}`,
        html: `
          <h2>New Portfolio Contact</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <hr/>
          <p>${message || "No message provided."}</p>
        `,
      }),
    });

    const resData = await response.json();

    if (!response.ok) {
      console.error("Resend API Error:", resData);
      return {
        success: false,
        fields: rawData,
        errors: { _form: [resData.message || "Failed to send email via Resend."] },
        message: resData.message || "Failed to send email.",
      };
    }

    return {
      success: true,
      message: "Thank you! Your message has been sent successfully.",
    };
  } catch (err) {
    console.error("Error sending email:", err);
    return {
      success: false,
      fields: rawData,
      errors: { _form: ["An unexpected error occurred while sending your message."] },
      message: "An unexpected error occurred.",
    };
  }
}