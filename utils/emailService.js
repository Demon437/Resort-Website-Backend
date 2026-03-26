import axios from "axios";

export const sendEnquiryEmail = async (data) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Resort Website",
          email: process.env.BREVO_EMAIL,
        },
        to: [
          {
            email: process.env.ADMIN_EMAIL,
          },
        ],
        subject: "🏝️ New Resort Enquiry",
        htmlContent: `
          <h2>New Enquiry</h2>
          <p><b>Name:</b> ${data.name}</p>
          <p><b>Email:</b> ${data.email}</p>
          <p><b>Phone:</b> ${data.phone}</p>
          <p><b>Room:</b> ${data.roomType}</p>
          <p><b>Guests:</b> ${data.guests}</p>
          <p><b>CheckIn:</b> ${data.checkIn}</p>
          <p><b>CheckOut:</b> ${data.checkOut}</p>
          <p><b>Message:</b> ${data.message}</p>
        `,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Email sent:", response.data);
  } catch (error) {
    console.error("❌ Email error:", error.response?.data || error.message);
  }
};