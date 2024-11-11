import React, { useCallback, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import styles from "./ApiEmailContactForm.module.css";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const authToken = process.env.NEXT_PUBLIC_AUTH_TOKEN;

export default function ApiEmailContactForm() {
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [toEmails, setToEmails] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append("subject", subject);
            formData.append("body", body);
            formData.append("to_emails", toEmails);

            const response = await fetch(`${apiUrl}/email/send-email-api/`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                toast.error(`Error ${response.status}: ${errorData.message || "Failed to send email"}`);
            } else {
                toast.success("Email sent successfully!");
                setSubject("");
                setBody("");
                setToEmails("");
            }
        } catch (error) {
            toast.error("Failed to send email");
            console.error("Error:", error);
        } finally {
            setIsSubmitting(false);
        }
    }, [subject, body, toEmails]);

    return (
        <>
            <form onSubmit={handleSubmit} className={styles.form}>
                <h1>Email (API)</h1>
                <div className={styles.formGroup}>
                    <label htmlFor="toEmails">To Email:</label>
                    <input
                        type="email"
                        id="toEmails"
                        value={toEmails}
                        onChange={(e) => setToEmails(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="subject">Subject:</label>
                    <input
                        type="text"
                        id="subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="body">Message:</label>
                    <textarea
                        id="body"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send Email"}
                </button>
            </form>
            <Toaster position="top-right" reverseOrder={false} />
        </>
    );
}
