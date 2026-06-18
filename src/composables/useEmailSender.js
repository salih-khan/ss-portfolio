import emailjs from '@emailjs/browser'

// Get environment variables
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID

export function useEmailSender() {
  const sendEnquiryEmail = async (formData) => {
    // Validate env vars are set
    if (!PUBLIC_KEY || !SERVICE_ID || !TEMPLATE_ID) {
      console.error('EmailJS credentials missing in environment variables')
      throw new Error('Email service not configured')
    }

    // Initialize EmailJS with public key
    emailjs.init(PUBLIC_KEY)

    // Map your form data to EmailJS template variables
    const emailParams = {
      firstName: formData.clientInfo.firstName, // matches {{firstName}}
      lastName: formData.clientInfo.lastName, // matches {{lastName}}
      email: formData.clientInfo.email, // matches {{email}}
      phone: formData.clientInfo.phone, // matches {{phone}}
      eventDate: formData.logistics.eventDate, // matches {{eventDate}}
      startTime: formData.logistics.startTime, // matches {{startTime}}
      endTime: formData.logistics.endTime, // matches {{endTime}}
      venueLocation: formData.logistics.venueLocation, // matches {{venueLocation}}
      guestCount: formData.commissionDetails.estimatedGuestCount, // matches {{guestCount}}
      eventType: formData.commissionDetails.eventType, // matches {{eventType}}
      primaryCoverage: formData.commissionDetails.primaryCoverage, // matches {{primaryCoverage}}
      secondaryCoverage: formData.commissionDetails.secondaryCoverage, // matches {{secondaryCoverage}}
      briefingInfo: formData.atmosphereBrief, // matches {{briefingInfo}}
    }

    try {
      const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, emailParams)
      console.log('Email sent successfully:', response)
      return { success: true, data: response }
    } catch (error) {
      console.error('Email sending failed:', error)
      return { success: false, error }
    }
  }

  return { sendEnquiryEmail }
}
