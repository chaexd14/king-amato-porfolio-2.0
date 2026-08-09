"use client";

import React, { useActionState, useEffect, useState } from "react";
import { z } from "zod";
import { sendEmail, EmailFormState } from "@/app/actions/email";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Check, Copy, Mail } from "lucide-react";

const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .email("Please enter a valid email address");

const nameSchema = z.string().trim().min(1, "Name is required");
const subjectSchema = z.string().trim().min(1, "Subject is required");
const messageSchema = z.string().trim().optional();

export default function EmailForm() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [state, formAction, isPending] = useActionState<EmailFormState | null, FormData>(
    sendEmail,
    null
  );

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText("kingamato0@gmail.com");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy email:", err);
    }
  };

  const [formValues, setFormValues] = useState({
    subject: "",
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState<{
    subject?: string[];
    name?: string[];
    email?: string[];
    message?: string[];
    _form?: string[];
  }>({});

  // Sync server returned field values and errors when action responds
  useEffect(() => {
    if (state?.fields) {
      setFormValues({
        subject: state.fields.subject || "",
        name: state.fields.name || "",
        email: state.fields.email || "",
        message: state.fields.message || "",
      });
    }
    if (state?.errors) {
      setErrors(state.errors);
    }
  }, [state?.fields, state?.errors]);

  useEffect(() => {
    if (state?.success) {
      const timer = setTimeout(() => {
        setOpen(false);
        setFormValues({ subject: "", name: "", email: "", message: "" });
        setErrors({});
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state?.success]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));

    // Live validation on type
    if (name === "email") {
      const res = emailSchema.safeParse(value);
      if (!res.success) {
        setErrors((prev) => ({
          ...prev,
          email: res.error.issues.map((i) => i.message),
        }));
      } else {
        setErrors((prev) => ({ ...prev, email: undefined }));
      }
    } else if (name === "name") {
      const res = nameSchema.safeParse(value);
      if (!res.success) {
        setErrors((prev) => ({
          ...prev,
          name: res.error.issues.map((i) => i.message),
        }));
      } else {
        setErrors((prev) => ({ ...prev, name: undefined }));
      }
    } else if (name === "subject") {
      const res = subjectSchema.safeParse(value);
      if (!res.success) {
        setErrors((prev) => ({
          ...prev,
          subject: res.error.issues.map((i) => i.message),
        }));
      } else {
        setErrors((prev) => ({ ...prev, subject: undefined }));
      }
    } else if (name === "message") {
      setErrors((prev) => ({ ...prev, message: undefined }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" className="dark:bg-background hover:bg-middleground">Let's Work!</Button>} />
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Hello There!</DialogTitle>
          <DialogDescription>
            Send me a message and I'll get back to you as soon as possible.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/40 text-xs sm:text-sm my-1 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="font-mono text-muted-foreground truncate select-all">
              kingamato0@gmail.com
            </span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 px-2.5 text-xs flex items-center gap-1.5 shrink-0"
            onClick={handleCopyEmail}
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-emerald-500 font-medium">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Email</span>
              </>
            )}
          </Button>
        </div>

        {state?.success ? (
          <div className="p-4 my-2 rounded-lg bg-emerald-500/10 text-emerald-500 text-sm font-medium border border-emerald-500/20 text-center flex flex-col items-center gap-2">
            <p className="font-semibold text-base font-sans">Message Sent!</p>
            <p className="text-muted-foreground">{state.message}</p>
          </div>
        ) : (
          <form action={formAction} className="space-y-4">
            {errors?._form && (
              <FieldError errors={errors._form.map((m) => ({ message: m }))} />
            )}

            <FieldGroup>
              <FieldSet>
                <FieldGroup>
                  <Field data-invalid={!!errors?.subject}>
                    <FieldLabel htmlFor="subject">Subject<span className="text-destructive">*</span></FieldLabel>
                    <FieldContent>
                      <Input
                        id="subject"
                        type="text"
                        placeholder="Subject"
                        name="subject"
                        value={formValues.subject}
                        onChange={handleChange}
                        disabled={isPending}
                      />
                    </FieldContent>
                    <FieldError errors={errors?.subject?.map((m) => ({ message: m }))} />
                  </Field>
                </FieldGroup>

                <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field data-invalid={!!errors?.name}>
                    <FieldLabel htmlFor="name">Name<span className="text-destructive">*</span></FieldLabel>
                    <FieldContent>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Name"
                        name="name"
                        value={formValues.name}
                        onChange={handleChange}
                        disabled={isPending}
                      />
                    </FieldContent>
                    <FieldError errors={errors?.name?.map((m) => ({ message: m }))} />
                  </Field>

                  <Field data-invalid={!!errors?.email}>
                    <FieldLabel htmlFor="email">
                      Email<span className="text-destructive">*</span>
                    </FieldLabel>
                    <FieldContent>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={formValues.email}
                        onChange={handleChange}
                        disabled={isPending}
                      />
                    </FieldContent>
                    <FieldError errors={errors?.email?.map((m) => ({ message: m }))} />
                  </Field>
                </FieldGroup>

                <Field data-invalid={!!errors?.message}>
                  <FieldLabel htmlFor="message">Message</FieldLabel>
                  <FieldContent>
                    <Textarea
                      id="message"
                      placeholder="Message"
                      name="message"
                      rows={4}
                      value={formValues.message}
                      onChange={handleChange}
                      disabled={isPending}
                    />
                  </FieldContent>
                  <FieldError errors={errors?.message?.map((m) => ({ message: m }))} />
                </Field>

                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending ? "Sending..." : "Send Message"}
                </Button>
              </FieldSet>
            </FieldGroup>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
