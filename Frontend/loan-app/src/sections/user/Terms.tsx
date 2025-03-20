import React from "react";
import { motion } from "framer-motion";

const Terms = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="p-6 bg-white min-h-screen text-gray-800 font-sans"
    >
      <h1 className="text-4xl font-bold mb-6 text-center">To-Loan Terms and Conditions</h1>

      <section className="mb-8 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-3">1. Introduction</h2>
        <p>
          Welcome to <span className="text-cyan-600 font-semibold">Tu-Loan</span>, your trusted partner for managing loans efficiently. By using our
          services, you agree to comply with and be bound by the following terms and conditions.
        </p>
      </section>

      <section className="mb-8 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-3">2. Eligibility</h2>
        <p>
          To apply for a loan, you must be at least 21 years old and a resident of the Philippines.
          You must provide accurate and complete information during the application process.
        </p>
      </section>

      <section className="mb-8 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-3">3. Philippine Lending Laws Compliance</h2>
        <p>
          Tu-Loan complies with the <span className="text-cyan-600 font-semibold">Republic Act No. 3765</span> (Truth in Lending Act) to ensure
          transparency in loan terms and fees. Additionally, we adhere to the <span className="text-cyan-600 font-semibold">Data Privacy Act of
          2012 (RA 10173)</span> to protect your personal information.
        </p>
      </section>

      <section className="mb-8 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-3">4. Loan Repayment</h2>
        <p>
          Loans must be repaid according to the agreed schedule. Late payments may incur penalties
          as stipulated under the <span className="text-cyan-600 font-semibold">Civil Code of the Philippines (Articles 1169 and 1170)</span>.
        </p>
      </section>

      <section className="mb-8 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-3">5. Default and Legal Action</h2>
        <p>
          In case of default, Tu-Loan reserves the right to pursue legal action under the <span className="text-cyan-600 font-semibold">Revised
          Penal Code (Article 315)</span> for fraud and misrepresentation.
        </p>
      </section>

      <section className="mb-8 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-3">6. Amendments</h2>
        <p>
          Tu-Loan may update these terms at any time. We will notify users of significant changes
          through the platform.
        </p>
      </section>

      <footer className="mt-10 text-sm text-gray-500 text-center">
        <p>&copy; {new Date().getFullYear()} Tu-Loan. All rights reserved.</p>
      </footer>
    </motion.div>
  );
};

export default Terms;
