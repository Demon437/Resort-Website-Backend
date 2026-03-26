import express from 'express';
import Enquiry from '../models/Enquiry.js';
import { sendEnquiryEmail } from '../utils/emailService.js';

const router = express.Router();

// Submit booking enquiry
router.post('/submit-enquiry', async (req, res) => {
    try {
        console.log('📩 Enquiry received:', req.body);

        const { name, email, phone, roomType, guests, checkIn, checkOut, message } = req.body;

        // Validate required fields
        if (!name || !email || !phone || !guests || !checkIn || !checkOut || !message) {
            console.log('❌ Missing required fields');
            return res.status(400).json({ error: 'All fields are required' });
        }

        console.log('✅ Validation passed');

        // Create new enquiry
        const enquiry = new Enquiry({
            name,
            email,
            phone,
            roomType: roomType || 'Not specified',
            guests,
            checkIn: new Date(checkIn),
            checkOut: new Date(checkOut),
            message
        });

        // Save to database
        await enquiry.save();
        console.log('💾 Enquiry saved to database:', enquiry._id);

        // Send email notifications
        await sendEnquiryEmail({
            name,
            email,
            phone,
            roomType: roomType || 'Not specified',
            guests,
            checkIn,
            checkOut,
            message
        });
        console.log('📧 Email sent successfully');

        res.status(200).json({
            success: true,
            message: 'Enquiry submitted successfully! Check your email for confirmation.',
            enquiryId: enquiry._id
        });
    } catch (error) {
        console.error('❌ Error submitting enquiry:', error);
        res.status(500).json({
            error: 'Failed to submit enquiry. Please try again.',
            details: error.message
        });
    }
});

// Get all enquiries (for admin)
router.get('/enquiries', async (req, res) => {
    try {
        const enquiries = await Enquiry.find().sort({ createdAt: -1 });
        res.status(200).json(enquiries);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch enquiries' });
    }
});

// Get enquiry by ID
router.get('/enquiry/:id', async (req, res) => {
    try {
        const enquiry = await Enquiry.findById(req.params.id);
        if (!enquiry) {
            return res.status(404).json({ error: 'Enquiry not found' });
        }
        res.status(200).json(enquiry);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch enquiry' });
    }
});

// Update enquiry status
router.put('/enquiry/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const enquiry = await Enquiry.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        res.status(200).json({
            success: true,
            message: 'Enquiry updated successfully',
            enquiry
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update enquiry' });
    }
});

export default router;
