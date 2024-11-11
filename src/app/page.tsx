"use client"; // Add this directive at the very top

import Image from "next/image";
import styles from "./page.module.css";
import ApiEmailContactForm from "@/app/components/ApiEmailContactForm";
import SMSForm from "@/app/components/SMSForm";

export default function Home() {
  return (
      <div className={styles.page}>
        <main className={styles.main}>
          <Image
              className={styles.logo}
              src="/next.svg"
              alt="Next.js logo"
              width={180}
              height={38}
              priority
          />
          <ApiEmailContactForm /> {/* Use the ApiEmailContactForm component here */}
            <SMSForm/>
        </main>
        <footer className={styles.footer}>
          {/* Footer content remains the same */}
        </footer>
      </div>
  );
}
