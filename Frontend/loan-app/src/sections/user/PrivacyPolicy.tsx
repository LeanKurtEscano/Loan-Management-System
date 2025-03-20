import React from "react";
import { motion } from "framer-motion";

const PrivacyPolicy = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="p-6 bg-white min-h-screen text-gray-800 font-sans"
    >
      <h1 className="text-4xl font-bold mb-6 text-center">To-Loan Privacy Policy</h1>

      <section className="mb-8 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-3">1. Introduction</h2>
        <p>
          At <span className="text-cyan-600 font-semibold">Tu-Loan</span>, we prioritize your privacy. This policy outlines how we collect,
          use, and protect your personal data.
        </p>
      </section>

      <section className="mb-8 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-3">2. Data Collection</h2>
        <p>
          We collect personal data such as your name, contact information, and financial details
          to process your loan application, in accordance with the <span className="text-cyan-600 font-semibold">Data Privacy Act of 2012 (RA 10173)</span>.
        </p>
      </section>

      <section className="mb-8 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-3">3. Data Usage</h2>
        <p>
          Your data is used for loan evaluation, account management, and customer support. We do not
          sell or share your information with third parties without your consent, except as required by law.
        </p>
      </section>

      <section className="mb-8 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-3">4. Data Security</h2>
        <p>
          Tu-Loan employs advanced security measures to protect your data from unauthorized access.
          This includes encryption and secure servers.
        </p>
      </section>

      <section className="mb-8 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-3">5. Your Rights</h2>
        <p>
          You have the right to access, correct, or delete your data. To exercise these rights, contact
          our support team.
        </p>
      </section>

      <section className="mb-8 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-3">6. Policy Updates</h2>
        <p>
          Tu-Loan may update this policy to reflect changes in data laws or business practices. We
          will notify you of significant updates.
        </p>
      </section>

      <footer className="mt-10 text-sm text-gray-500 text-center">
        <p>&copy; {new Date().getFullYear()} Tu-Loan. All rights reserved.</p>
      </footer>
    </motion.div>
  );
};

export default PrivacyPolicy;
