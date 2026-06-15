<template>
  <div class="contact-page">
    <div class="contact-header">
      <h1 class="contact-title">ECHO // CLIENT REFLECTIONS</h1>
      <p>
        Below is a collection of honest reflections from couples, brands and families who have
        stepped into the flow of Surma Studio. To honor the trust placed in our vision, these
        accounts represent the real-time, unedited dialogue of our archive
      </p>
    </div>

    <!-- Reviews Grid -->
    <div class="reviews-grid">
      <div
        v-for="(review, index) in reviews"
        :key="index"
        class="review-card"
        :class="{ featured: review.featured }"
      >
        <div class="quote-mark">“</div>
        <p class="review-text">{{ review.text }}</p>
        <div class="client-info">
          <div class="client-name">{{ review.name }}</div>
          <div class="client-role">{{ review.role }}</div>
        </div>
      </div>
    </div>
    <p style="text-align: center; color: #888; font-size: 0.9rem">
      Client reflections for 2026 are currently being compiled. Index coming soon.
    </p>
  </div>
</template>

<script setup>
// Hardcoded reviews data
const reviews = [
  // {
  //   text: "Working with SurmaStudio was an absolute dream. They captured the raw emotion of our wedding day without ever being intrusive. Every time I look at these photos, I'm transported back to that feeling.",
  //   name: 'Jenna & Marcus',
  //   role: 'Wedding Clients',
  //   featured: true,
  // },
]
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.contact-page {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem 2rem 4rem;
  min-height: 100vh;
  font-family:
    'Helvetica Now ',
    -apple-system,
    BlinkMacSystemFont,
    'Helvetica Neue',
    Helvetica,
    Arial,
    sans-serif;
  color: #111;
  line-height: 1.4;
}

.contact-header {
  text-align: center;
  margin-bottom: 3rem;
  border-bottom: 1px solid #ececec;
  padding-bottom: 2rem;
}

.contact-title {
  font-size: 2rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: #000;
  margin-bottom: 1rem;
  text-transform: uppercase;
}

.contact-header p {
  max-width: 720px;
  margin: 0 auto;
  font-size: 0.95rem;
  line-height: 1.5;
  color: #2c2c2c;
  font-weight: 400;
}

/* Reviews Grid */
.reviews-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 2rem;
}

.review-card {
  background: #ffffff;
  border: 1px solid #ececec;
  padding: 2rem;
  transition: all 0.2s ease;
}

.review-card:hover {
  border-color: #d0d0d0;
}

.review-card.featured {
  background: #fafafa;
  border-left: 3px solid #000;
}

.quote-mark {
  font-size: 3rem;
  font-weight: 500;
  color: #d4d4d4;
  line-height: 1;
  margin-bottom: 1rem;
  font-family: Georgia, serif;
}

.review-text {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #2c2c2c;
  margin-bottom: 1.5rem;
  font-style: normal;
}

.client-info {
  border-top: 1px solid #ececec;
  padding-top: 1.25rem;
}

.client-name {
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: #000;
  margin-bottom: 0.25rem;
}

.client-role {
  font-size: 0.75rem;
  color: #888;
  letter-spacing: 0.3px;
}

/* Responsive */
@media (max-width: 768px) {
  .reviews-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .review-card {
    padding: 1.5rem;
  }
}

@media (max-width: 600px) {
  .contact-page {
    padding: 1rem;
  }
  .contact-title {
    font-size: 1.5rem;
  }
}
</style>
