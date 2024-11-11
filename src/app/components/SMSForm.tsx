import React, { useCallback, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import styles from "./SMSForm.module.css"; // Create a similar CSS file for this component

const smsApiUrl = `${process.env.NEXT_PUBLIC_API_URL}/sms/send-message`;
const authToken = process.env.NEXT_PUBLIC_AUTH_TOKEN;

export default function SMSForm() {
    const [smsTo, setSmsTo] = useState("");
    const [smsBody, setSmsBody] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const formData = new URLSearchParams();
            formData.append("sms_to", smsTo);
            formData.append("sms_body", smsBody);

            const response = await fetch(smsApiUrl, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${authToken}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                toast.error(`Error ${response.status}: ${errorData.message || "Failed to send SMS"}`);
            } else {
                toast.success("SMS sent successfully!");
                setSmsTo("");
                setSmsBody("");
            }
        } catch (error) {
            toast.error("Failed to send SMS");
            console.error("Error:", error);
        } finally {
            setIsSubmitting(false);
        }
    }, [smsTo, smsBody]);

    return (
        <>
            <form onSubmit={handleSubmit} className={styles.form}>
                <h1>Send SMS</h1>
                <div className={styles.formGroup}>
                    <label htmlFor="smsTo">Phone Number:</label>
                    <input
                        type="tel"
                        id="smsTo"
                        value={smsTo}
                        onChange={(e) => setSmsTo(e.target.value)}
                        required
                        placeholder="+1234567890"
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="smsBody">Message:</label>
                    <textarea
                        id="smsBody"
                        value={smsBody}
                        onChange={(e) => setSmsBody(e.target.value)}
                        required
                        placeholder="Enter your message here"
                    />
                </div>
                <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send SMS"}
                </button>
            </form>
            <Toaster position="top-right" reverseOrder={false} />
        </>
    );
}
