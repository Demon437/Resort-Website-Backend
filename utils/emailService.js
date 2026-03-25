import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendEnquiryEmail = async (formData) => {
  try {
    const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
      <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #1a3a3a; border-bottom: 3px solid #d4af37; padding-bottom: 10px;">🏨 New Booking Enquiry</h2>
        
        <div style="margin-top: 20px;">
          <p style="margin: 10px 0;"><strong>👤 Name:</strong> ${formData.name}</p>
          <p style="margin: 10px 0;"><strong>📧 Email:</strong> ${formData.email}</p>
          <p style="margin: 10px 0;"><strong>📱 Phone:</strong> ${formData.phone}</p>
          <p style="margin: 10px 0;"><strong>🚪 Room Type:</strong> ${formData.roomType}</p>
          <p style="margin: 10px 0;"><strong>👥 Number of Guests:</strong> ${formData.guests}</p>
          <p style="margin: 10px 0;"><strong>📅 Check-in Date:</strong> ${formData.checkIn}</p>
          <p style="margin: 10px 0;"><strong>📅 Check-out Date:</strong> ${formData.checkOut}</p>
        </div>

        <div style="margin-top: 20px; background-color: #f9f9f9; padding: 15px; border-left: 4px solid #d4af37; border-radius: 4px;">
          <h4 style="color: #1a3a3a; margin-top: 0;">💬 Special Requests:</h4>
          <p style="margin: 0; white-space: pre-wrap; color: #333;">${formData.message}</p>
        </div>

        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center;">
          <p style="color: #666; font-size: 12px; margin: 0;">
            This is an automated message from Resort Booking System.<br>
            Please respond to the customer within 24 hours.
          </p>
        </div>
      </div>
    </div>
    `;

    // Send to admin
    const adminSubject = `[BOOKING] ${formData.roomType} | ${formData.guests} Guest(s) | ${formData.checkIn} | ${formData.name}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      replyTo: formData.email,
      subject: adminSubject,
      html: emailContent
    });

    // Send confirmation email to customer
    const customerEmail = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
      <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #1a3a3a; border-bottom: 3px solid #d4af37; padding-bottom: 10px;">✅ Booking Enquiry Received</h2>
        
        <p style="color: #333; line-height: 1.6;">
          Dear <strong>${formData.name}</strong>,
        </p>
        
        <p style="color: #333; line-height: 1.6;">
          Thank you for your booking enquiry! We have received your request and our team will contact you within 24 hours to confirm your reservation.
        </p>

        <div style="background-color: #f0f8ff; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <h4 style="color: #1a3a3a; margin-top: 0;">Your Enquiry Details:</h4>
          <p style="margin: 5px 0;"><strong>Room Type:</strong> ${formData.roomType}</p>
          <p style="margin: 5px 0;"><strong>Check-in:</strong> ${formData.checkIn}</p>
          <p style="margin: 5px 0;"><strong>Check-out:</strong> ${formData.checkOut}</p>
          <p style="margin: 5px 0;"><strong>Guests:</strong> ${formData.guests}</p>
        </div>

        <p style="color: #333; line-height: 1.6;">
          If you have any urgent questions, please contact us at <strong>${process.env.ADMIN_PHONE}</strong> or WhatsApp us directly.
        </p>

        <p style="color: #666; text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px;">
          Best regards,<br>
          <strong>Resort Booking Team</strong>
        </p>
      </div>
    </div>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: formData.email,
      subject: 'Booking Enquiry Confirmation - We Received Your Request',
      html: customerEmail
    });

    return { success: true, message: 'Emails sent successfully' };
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error('Failed to send email: ' + error.message);
  }
};
