<template>
  <div class="privacy-page">
    <!-- Header -->
    <div class="privacy-header">
      <h1 class="privacy-title">Terms of service // Enquiry submission</h1>
      <p class="privacy-subtitle">Terms of service, data management &amp; privacy.</p>
    </div>

    <!-- Content -->
    <div class="privacy-content">
      <!-- Terms of Service -->
      <section class="policy-section">
        <h2 class="section-title">Terms // Submission Registry</h2>

        <div class="policy-card">
          <div class="policy-item">
            <span class="policy-number"></span>
            <div class="policy-body">
              <h3 class="policy-heading">01 // Purpose of Enquiry</h3>
              <p class="policy-text">Submission of this form constitutes a formal request for availability and commission budgeting. It does not secure a booking, guarantee studio availability or create a binding contractual agreement to shoot.</p>
            </div>
          </div>

          <div class="policy-item">
            <span class="policy-number"></span>
            <div class="policy-body">
              <h3 class="policy-heading">02 // Communications &amp; Delivery</h3>
              <p class="policy-text">By submitting your details, you authorise Surma Studio to contact you via the provided channels regarding your specific project enquiry. All project briefs, initial consultations and custom rate sheets remain the intellectual property of Surma Studio and are intended solely for the recipient.</p>
            </div>
          </div>

          <div class="policy-item">
            <span class="policy-number"></span>
            <div class="policy-body">
              <h3 class="policy-heading">03 // Retainers &amp; Bookings</h3>
              <p class="policy-text">A commission is only officially secured once a bespoke services contract is signed by both parties and a non-refundable retainer fee has been processed. Dates are held exclusively on a first-committed basis.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Privacy Policy -->
      <section class="policy-section">
        <h2 class="section-title">Privacy // Data Management</h2>

        <div class="policy-card">
          <div class="policy-item">
            <span class="policy-number"></span>
            <div class="policy-body">
              <h3 class="policy-heading">01 // Data Collection</h3>
              <p class="policy-text">We collect only the information necessary to evaluate your creative brief: your name, contact information, event logistics and creative intent. We do not use tracking cookies for marketing or distribute your data to third-party networks.</p>
            </div>
          </div>

          <div class="policy-item">
            <span class="policy-number"></span>
            <div class="policy-body">
              <h3 class="policy-heading">02 // Use &amp; Security</h3>
              <p class="policy-text">Your personal details are treated with strict confidentiality. They are used exclusively by Surma Studio to communicate regarding your enquiry, log your project into our internal studio calendar and structure your booking contract.</p>
            </div>
          </div>

          <div class="policy-item">
            <span class="policy-number"></span>
            <div class="policy-body">
              <h3 class="policy-heading">03 // Retention &amp; Rights</h3>
              <p class="policy-text">Unsecured enquiry data is periodically cleared from our temporary servers to maintain system hygiene. You retain the right at any time to request the absolute removal or correction of your personal data from our registry by contacting the studio directly.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Contact Footer -->
      <div class="policy-footer">
        <p>For any questions regarding your data, please contact us directly.</p>
        <router-link to="/enquiry" class="contact-link">Enquiry →</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
// No additional logic needed
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.privacy-page {
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
  padding: 3rem 2rem;
  min-height: 100vh;
  background: #ffffff;
}
/* Header */
.privacy-header {
  text-align: center;
  margin-bottom: 4rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #ececec;
}

.privacy-title {
   font-size: 2rem;
  font-weight: 600;
  color: #000;
    letter-spacing: -0.02em;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
}

.privacy-subtitle {
  margin: 0 auto;
  font-size: 0.95rem;
  line-height: 1.5;
  color: #2c2c2c;
  font-weight: 400;
}

/* Content */
.privacy-content {
  max-width: 820px;
  margin: 0 auto;
}

.policy-section {
  margin-bottom: 4rem;
}

.section-title {
  font-size: 1.2rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 600;
  color: #333;
  margin-bottom: 3rem;
  padding-bottom: 0.25rem;
  border-bottom: 1px solid #f0f0f0;
}

.policy-card {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.policy-item {
  grid-template-columns: 40px 1fr;
  gap: 1.5rem;
  align-items: flex-start;
}

.policy-number {
  font-size: 0.8rem;
  font-weight: 600;
  color: #ccc;
  letter-spacing: 1px;
  padding-top: 0.1rem;
}

.policy-body {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.policy-heading {
  font-size: 1rem;
  letter-spacing: 2px;
  font-weight: 600;
  color: #333;
  margin-bottom: 1.25rem;
  padding-bottom: 0.25rem;
  border-bottom: 1px solid #f0f0f0;
}

.policy-text {
  font-size: 1rem;
  line-height: 1.6;
  color: #555;
  font-weight: 400;
  max-width: 680px;
}

/* Footer */
.policy-footer {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #ececec;
  text-align: center;
}

.policy-footer p {
  font-size: 0.85rem;
  color: #888;
  margin-bottom: 1rem;
}

.contact-link {
  display: inline-block;
  font-size: 0.9rem;
  color: #000;
  text-decoration: none;
  letter-spacing: 2px;
  text-transform: uppercase;
  padding: 0.5rem 1rem;
  transition: all 0.2s ease;
}

.contact-link:hover {
  background: #f5f5f5;
}

/* Responsive */
@media (max-width: 768px) {
  .privacy-page {
    padding: 2rem 1.5rem;
  }

  .privacy-title {
    font-size: 1.5rem;
  }

  .privacy-header {
    margin-bottom: 3rem;
    padding-bottom: 1.5rem;
  }

  .policy-section {
    margin-bottom: 3rem;
  }

  .policy-item {
    grid-template-columns: 30px 1fr;
    gap: 1rem;
  }

  .policy-number {
    font-size: 0.7rem;
  }

  .policy-heading {
    font-size: 0.9rem;
  }

  .policy-text {
    font-size: 0.85rem;
  }

  .section-title {
    font-size: 0.85rem;
    letter-spacing: 2px;
  }
}

@media (max-width: 480px) {
  .privacy-page {
    padding: 1.5rem 1rem;
  }

  .privacy-title {
    font-size: 1.5rem;
  }

  .policy-item {
    grid-template-columns: 1fr;
    gap: 0.25rem;
  }

  .policy-number {
    font-size: 0.65rem;
    color: #aaa;
  }

  .policy-text {
    font-size: 0.8rem;
  }
}
</style>
