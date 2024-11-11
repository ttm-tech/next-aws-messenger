import React, { useCallback, useState } from "react";
import toast from "react-hot-toast";
import styles from "./ContactForm.module.css";

export default function ContactForm() {
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [toEmails, setToEmails] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Add a type annotation for the `e` parameter
    const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true); // Disable form while submitting

        try {
            const formData = new FormData();
            formData.append("subject", subject);
            formData.append("body", body);
            formData.append("to_emails", toEmails);

            const response = await fetch("http://localhost:8000/api/v1/email/send-email-api/", {
                method: "POST",
                headers: {
                    Authorization: "Bearer nUltWZrwMUsKSOKPos3CSuX4u75YOhK1vYwMBfXD5zodGQCq3HNDWja7ZUNJZtSN6rk3xFMiowtsmfIVWrKDu2ZavItC334l2u09",
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                toast.error(`Error ${response.status}: ${errorData.message || "Failed to send email"}`);
            } else {
                toast.success("Email sent successfully!");
                setSubject(""); // Clear fields after success
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
        <form onSubmit={handleSubmit} className={styles.form}>
            <h1>Contact Us</h1>
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
    );
}
