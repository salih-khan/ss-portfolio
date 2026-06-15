<template>
  <div class="contact-page">
    <div class="contact-header">
      <h1 class="contact-title">INQUIRY // PROJECT BRIEF</h1>
      <p>
        Thank you for considering Surma Studio. <br /><br />
        At Surma Studio, we view every commission not merely as a booking, but as a considered
        collaboration to preserve moments in time, movement and heritage. Please complete the
        details below with as much information as possible, allowing us to gain a thorough
        understanding of the atmosphere, vision and flow of your project. We look forward to
        creating something timeless together.
      </p>
    </div>

    <!-- Two-column layout: Contact Info (left) + Form (right) -->
    <div class="two-column-layout">
      <!-- LEFT COLUMN - Contact & Social Info -->
      <div class="contact-info-panel">
        <!-- <div class="info-block">
          <h3 class="info-label">Phone</h3>
          <p class="info-value">+8801234567890</p>
        </div>

        <div class="info-block">
          <h3 class="info-label">Email</h3>
          <p class="info-value">contact@example.com</p>
        </div>

        <div class="info-block">
          <h3 class="info-label">Address</h3>
          <p class="info-value">Burnley, Lancashire, UK</p>
        </div> -->

        <div class="info-block">
          <h3 class="info-label">You can also find us on Instagram</h3>
          <div class="social-menu">
            <a
              href="https://www.instagram.com/thesurmastudio?igsh=MW5obHc3OWt2emgzYg%3D%3D"
              class="social-link"
              target="_blank"
              rel="noopener noreferrer"
              >@thesurmastudio</a
            >
          </div>
        </div>
      </div>

      <!-- RIGHT COLUMN - Minimal Seamless Form (no boxes/cards) -->
      <form @submit.prevent="handleSubmit" class="seamless-form">
        <!-- Section 1: Client Info -->
        <div class="form-section">
          <div class="section-title">01 / CLIENT INFO</div>
          <div class="form-row">
            <div class="form-group">
              <input type="text" v-model="formData.firstName" placeholder="First Name" required />
            </div>
            <div class="form-group">
              <input type="text" v-model="formData.lastName" placeholder="Last Name" required />
            </div>
          </div>
          <div class="form-group">
            <input type="email" v-model="formData.email" placeholder="Email Address" required />
          </div>
          <div class="form-group">
            <input type="tel" v-model="formData.phone" placeholder="Contact Number" required />
          </div>
        </div>

        <!-- Section 2: Logistics -->
        <div class="form-section">
          <div class="section-title">02 / LOGISTICS</div>
          <div class="form-row">
            <div class="form-group">
              <input
                type="text"
                ref="datePickerInput"
                v-model="formData.eventDate"
                placeholder="Event Date"
                required
                id="datePickerInput"
              />
            </div>
            <div class="form-group">
              <select v-model="formData.startTime" required>
                <option value="" disabled selected>Start Time</option>
                <option>Morning (06:00 AM)</option>
                <option>Midday (12:00 PM)</option>
                <option>Afternoon (04:00 PM)</option>
                <option>Evening (08:00 PM)</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <select v-model="formData.endTime" required>
                <option value="" disabled selected>End Time</option>
                <option>Midday (12:00 PM)</option>
                <option>Afternoon (04:00 PM)</option>
                <option>Evening (08:00 PM)</option>
                <option>Midnight (12:00 AM)</option>
              </select>
            </div>
            <div class="form-group">
              <input
                type="text"
                v-model="formData.venueLocation"
                placeholder="Venue Location / Postcode"
                required
              />
            </div>
          </div>
          <p
            style="
              font-size: 0.75rem;
              color: #ff8886;
              margin-top: -0.5rem;
              letter-spacing: 0.3px;
              font-weight: 500;
            "
          >
            If these times do not align with your schedule, please specify your exact timeline in
            the additional briefing box at the bottom of the form. *
          </p>
        </div>

        <!-- Section 3: Commission Details -->
        <div class="form-section">
          <div class="section-title">03 / COMMISSION DETAILS</div>
          <div class="form-row">
            <div class="form-group">
              <select v-model="formData.guestCount" required>
                <option value="" disabled selected>Estimated Guest Count (click to select)</option>
                <option>Under 50</option>
                <option>50 - 150</option>
                <option>150 - 300</option>
                <option>300+</option>
              </select>
            </div>
            <div class="form-group">
              <select v-model="formData.eventType" required>
                <option value="" disabled selected>Event Type (click to select)</option>
                <option>Nikkah</option>
                <option>Multi-day Wedding</option>
                <option>Commercial Product</option>
                <option>Editorial Movement / Fashion / Street</option>
                <option>Milestone Celebration / Birthday Set</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <!-- extra info for "Other" -->
          <div class="form-group" v-if="formData.eventType === 'Other'">
            <input
              type="text"
              v-model="formData.otherEventText"
              placeholder="Please specify event type"
            />
          </div>

          <!-- Primary house coverage -->
          <div class="form-group">
            <input
              type="text"
              v-model="formData.primaryCoverage"
              placeholder="Primary house coverage / additional charge (location required)"
            />
          </div>
          <!-- Secondary house coverage -->
          <div class="form-group">
            <input
              type="text"
              v-model="formData.secondaryCoverage"
              placeholder="Secondary house coverage / additional charge (location required)"
            />
          </div>
        </div>

        <!-- Section 4: Atmosphere & additional briefing -->
        <div class="form-section">
          <div class="section-title">04 / ATMOSPHERE & ADDITIONAL BRIEFING</div>
          <div class="form-group">
            <textarea
              v-model="formData.briefingInfo"
              rows="4"
              placeholder="Additional briefing information (vision, mood, flow, special moments)..."
            ></textarea>
          </div>
        </div>

        <!-- terms & submit -->
        <div class="form-section submit-section">
          <label class="checkbox-label">
            <input type="checkbox" v-model="formData.agreeTerms" required />
            <span class="checkmark"></span>
            <span class="checkbox-text">I agree to the terms & privacy policy *</span>
          </label>
          <button type="submit" class="submit-btn" :disabled="isSubmitting">
            {{ isSubmitting ? 'SENDING...' : 'SEND INQUIRY' }}
          </button>
        </div>
      </form>
    </div>

    <!-- success modal -->
    <Teleport to="body">
      <div v-if="showSuccess" class="success-modal" @click="closeSuccess">
        <div class="success-content" @click.stop>
          <div class="success-icon">✓</div>
          <h3>Message Sent!</h3>
          <p>
            Thank you for reaching out. We'll respond within 48 hours to discuss your project
            further.
          </p>
          <button @click="closeSuccess" class="close-success-btn">Close</button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import flatpickr from 'flatpickr'
import 'flatpickr/dist/flatpickr.min.css'

import { useEmailSender } from '@/composables/useEmailSender'

// Form data using reactive
const formData = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  eventDate: '',
  startTime: '',
  endTime: '',
  venueLocation: '',
  guestCount: '',
  eventType: '',
  otherEventText: '',
  primaryCoverage: '',
  secondaryCoverage: '',
  briefingInfo: '',
  agreeTerms: false,
})

const isSubmitting = ref(false)
const showSuccess = ref(false)
const datePickerInput = ref(null)
let flatpickrInstance = null

// Initialize flatpickr
onMounted(() => {
  if (datePickerInput.value) {
    flatpickrInstance = flatpickr(datePickerInput.value, {
      dateFormat: 'd-m-Y',
      minDate: 'today',
      altInput: true,
      altFormat: 'F j, Y',
      allowInput: false,
      onChange: (selectedDates, dateStr) => {
        formData.eventDate = dateStr
      },
    })
  }
})

// Watch for event type to reset other text when not Other
watch(
  () => formData.eventType,
  (newVal) => {
    if (newVal !== 'Other') {
      formData.otherEventText = ''
    }
  },
)

// Validation function
const validateForm = () => {
  if (!formData.firstName.trim()) {
    alert('Please enter first name')
    return false
  }
  if (!formData.lastName.trim()) {
    alert('Please enter last name')
    return false
  }
  if (!formData.email.trim() || !formData.email.includes('@')) {
    alert('Valid email address required')
    return false
  }
  if (!formData.phone.trim()) {
    alert('Contact number required')
    return false
  }
  if (!formData.eventDate.trim()) {
    alert('Please select event date')
    return false
  }
  if (!formData.startTime) {
    alert('Please select start time')
    return false
  }
  if (!formData.endTime) {
    alert('Please select end time')
    return false
  }
  if (!formData.venueLocation.trim()) {
    alert('Venue location / postcode required')
    return false
  }
  if (!formData.guestCount) {
    alert('Please select estimated guest count')
    return false
  }
  if (!formData.eventType) {
    alert('Please select event type')
    return false
  }
  if (formData.eventType === 'Other' && !formData.otherEventText.trim()) {
    alert("Please describe the 'Other' event type")
    return false
  }
  if (!formData.agreeTerms) {
    alert('You must agree to the terms & privacy policy')
    return false
  }
  return true
}

// Collect form data for submission
const collectFormData = () => {
  let finalEventType = formData.eventType
  if (finalEventType === 'Other' && formData.otherEventText.trim()) {
    finalEventType = `Other: ${formData.otherEventText.trim()}`
  }

  return {
    clientInfo: {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
    },
    logistics: {
      eventDate: formData.eventDate,
      startTime: formData.startTime,
      endTime: formData.endTime,
      venueLocation: formData.venueLocation.trim(),
    },
    commissionDetails: {
      estimatedGuestCount: formData.guestCount,
      primaryCoverage: formData.primaryCoverage.trim() || 'Not provided',
      secondaryCoverage: formData.secondaryCoverage.trim() || 'Not provided',
      eventType: finalEventType,
    },
    atmosphereBrief: formData.briefingInfo.trim() || 'No additional briefing provided',
    agreedToTerms: true,
  }
}

// Reset form after submission
const resetForm = () => {
  formData.firstName = ''
  formData.lastName = ''
  formData.email = ''
  formData.phone = ''
  formData.eventDate = ''
  formData.startTime = ''
  formData.endTime = ''
  formData.venueLocation = ''
  formData.guestCount = ''
  formData.eventType = ''
  formData.otherEventText = ''
  formData.primaryCoverage = ''
  formData.secondaryCoverage = ''
  formData.briefingInfo = ''
  formData.agreeTerms = false

  // Clear flatpickr
  if (flatpickrInstance) {
    flatpickrInstance.clear()
  }
}

// Handle form submission
// Initialize EmailJS composable
const { sendInquiryEmail } = useEmailSender()

// ... (keep all your flatpickr init, validation, collectFormData, resetForm exactly as they are)

// Modified handleSubmit using the composable
const handleSubmit = async () => {
  if (!validateForm()) return

  isSubmitting.value = true

  const formDataToSubmit = collectFormData()

  // Send email using composable
  const result = await sendInquiryEmail(formDataToSubmit)

  if (result.success) {
    resetForm()
    showSuccess.value = true
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setTimeout(() => {
      showSuccess.value = false
    }, 4000)
  } else {
    alert('Sorry, there was a problem sending your inquiry. Please try again later.')
  }

  isSubmitting.value = false
}
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
  font-family: 'Helvetica Now', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  color: #111;
  line-height: 1.4;
}

/* header */
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

/* TWO COLUMN LAYOUT */
.two-column-layout {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 4rem;
}

/* LEFT COLUMN - Contact & Social Info (minimal) */
.contact-info-panel {
  padding-right: 1rem;
}

.info-block {
  margin-bottom: 2.5rem;
}

.info-label {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #999;
  margin-bottom: 0.5rem;
}

.info-value {
  font-size: 1rem;
  color: #333;
  line-height: 1.4;
  font-weight: 500;
}

.social-menu {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.social-link {
  color: #333;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.2s ease;
}

.social-link:hover {
  color: #000;
}

/* RIGHT COLUMN - Seamless Form (NO BOXES, NO CARDS) */
.seamless-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-section {
  border-bottom: none;
}

.section-title {
  font-size: 1.2rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 600;
  color: #333;
  margin-bottom: 1.25rem;
  padding-bottom: 0.25rem;
  border-bottom: 1px solid #f0f0f0;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
  margin-bottom: 1rem;
}

.form-group {
  width: 100%;

  margin-bottom: 1rem;
}
.form-group-main {
  color: green;
}
.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem 0;
  border: none;
  border-bottom: 1px solid #eaeaea;
  font-size: 0.9rem;
  font-family: 'Helvetica Now', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-weight: 500;
  background: transparent;
  transition: border-color 0.2s ease;
  outline: none;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-bottom-color: #000;
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

/* Remove margin-bottom for last element in section */
.form-section:last-child .form-group:last-child {
  margin-bottom: 0;
}

/* Apply to both date input and select */
.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem 0;
  border: none;
  border-bottom: 1px solid #eaeaea; /* Only bottom border */
  font-size: 0.9rem;
  font-family: inherit;
  font-weight: 500;
  background: transparent;
  outline: none;
  transition: border-color 0.2s ease;
}

/* Clean up the select dropdown arrow */
select {
  cursor: pointer;
  appearance: none;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="1.5"><polyline points="6 9 12 15 18 9"></polyline></svg>');
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
}

/* Remove the default box shadow or border from flatpickr input */
.flatpickr-input {
  box-shadow: none !important;
  border-bottom: 1px solid #eaeaea !important;
}
/* Custom Checkbox */
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  user-select: none;
  margin-bottom: 1.5rem;
}

.checkbox-label input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  width: 18px;
  height: 18px;
  border: 1px solid #ccc;
  background: transparent;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.checkbox-label input:checked ~ .checkmark {
  background: #000;
  border-color: #000;
  position: relative;
}

.checkbox-label input:checked ~ .checkmark::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
}

.checkbox-text {
  font-size: 0.75rem;
  color: #666;
  letter-spacing: 0.3px;
  font-weight: 500;
}

/* Submit Button */
.submit-btn {
  background: #000;
  color: #fff;
  border: none;
  padding: 1rem 2rem;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  cursor: pointer;
  transition: opacity 0.2s ease;
  width: 100%;
  font-family: 'Helvetica Now', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-weight: 600;
}

.submit-btn:hover {
  opacity: 0.85;
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.submit-section {
  margin-top: 0.5rem;
}

/* modal */
.success-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: fadeIn 0.2s ease;
}

.success-content {
  background: white;
  padding: 2rem;
  border-radius: 24px;
  text-align: center;
  max-width: 340px;
  width: 90%;
  animation: slideUp 0.25s ease;
}

.success-icon {
  width: 52px;
  height: 52px;
  background: #000;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  margin: 0 auto 1rem;
}

.close-success-btn {
  background: none;
  border: 1px solid #ddd;
  padding: 0.6rem 1.5rem;
  font-size: 0.7rem;
  text-transform: uppercase;
  margin-top: 1rem;
  cursor: pointer;
  transition: 0.2s;
  font-weight: 600;
  border-radius: 40px;
}

.close-success-btn:hover {
  background: #000;
  color: white;
  border-color: #000;
}

/* responsive */
@media (max-width: 800px) {
  .two-column-layout {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .contact-info-panel {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    padding-right: 0;
  }

  .info-block {
    margin-bottom: 0;
    padding: 0.75rem;
    background: #fafafa;
  }

  .social-menu {
    flex-direction: row;
    gap: 1rem;
  }
}

@media (max-width: 600px) {
  .contact-page {
    padding: 1rem;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .contact-info-panel {
    grid-template-columns: 1fr;
  }

  .contact-title {
    font-size: 1.5rem;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

select {
  cursor: pointer;
  appearance: none;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>');
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
}
</style>
