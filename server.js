const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Routes

// Serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API endpoint for lead generation
app.post('/api/generate-leads', async (req, res) => {
    try {
        const { industry, targetRole, companySize, location, painPoints } = req.body;

        // Validate input
        if (!industry || !targetRole || !companySize || !location || !painPoints) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Generate leads using AI logic (mock implementation)
        const leads = generateAILeads({
            industry,
            targetRole,
            companySize,
            location,
            painPoints
        });

        res.json({
            success: true,
            count: leads.length,
            leads: leads
        });
    } catch (error) {
        console.error('Error generating leads:', error);
        res.status(500).json({ error: 'Failed to generate leads' });
    }
});

// API endpoint for sending emails
app.post('/api/send-email', async (req, res) => {
    try {
        const { to, subject, body } = req.body;

        // Validate input
        if (!to || !subject || !body) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // In production, integrate with SendGrid or similar
        console.log(`Email sent to ${to}:`);
        console.log(`Subject: ${subject}`);
        console.log(`Body: ${body}`);

        // Mock email sending
        const emailResult = {
            success: true,
            messageId: `msg_${Date.now()}`,
            to: to,
            subject: subject,
            timestamp: new Date()
        };

        res.json({
            success: true,
            message: 'Email sent successfully',
            data: emailResult
        });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
});

// API endpoint for sending SMS
app.post('/api/send-sms', async (req, res) => {
    try {
        const { to, message } = req.body;

        // Validate input
        if (!to || !message) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        if (message.length > 160) {
            return res.status(400).json({ error: 'Message exceeds 160 characters' });
        }

        // In production, integrate with Twilio or similar
        console.log(`SMS sent to ${to}:`);
        console.log(`Message: ${message}`);

        // Mock SMS sending
        const smsResult = {
            success: true,
            messageId: `sms_${Date.now()}`,
            to: to,
            message: message,
            characterCount: message.length,
            timestamp: new Date()
        };

        res.json({
            success: true,
            message: 'SMS sent successfully',
            data: smsResult
        });
    } catch (error) {
        console.error('Error sending SMS:', error);
        res.status(500).json({ error: 'Failed to send SMS' });
    }
});

// API endpoint for user authentication
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { email, password, company } = req.body;

        // Validate input
        if (!email || !password || !company) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // In production, hash password and save to database
        const user = {
            id: Date.now(),
            email,
            company,
            createdAt: new Date(),
            credits: {
                emails: 100,
                sms: 100
            }
        };

        res.json({
            success: true,
            message: 'Account created successfully',
            user
        });
    } catch (error) {
        console.error('Error signing up:', error);
        res.status(500).json({ error: 'Failed to create account' });
    }
});

// API endpoint for saving leads
app.post('/api/leads/save', async (req, res) => {
    try {
        const { leads, userId } = req.body;

        if (!leads || !userId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // In production, save to database
        const savedLeads = {
            id: Date.now(),
            userId,
            leads,
            savedAt: new Date(),
            count: leads.length
        };

        res.json({
            success: true,
            message: 'Leads saved successfully',
            data: savedLeads
        });
    } catch (error) {
        console.error('Error saving leads:', error);
        res.status(500).json({ error: 'Failed to save leads' });
    }
});

// API endpoint for CRM integration (mock)
app.post('/api/crm/sync', async (req, res) => {
    try {
        const { crmType, leads, credentials } = req.body;

        if (!crmType || !leads) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // In production, integrate with actual CRM APIs
        res.json({
            success: true,
            message: `Successfully synced ${leads.length} leads to ${crmType}`,
            synced: leads.length
        });
    } catch (error) {
        console.error('Error syncing to CRM:', error);
        res.status(500).json({ error: 'Failed to sync to CRM' });
    }
});

// API endpoint for contact form submissions
app.post('/api/contact', async (req, res) => {
    try {
        const { email, company } = req.body;

        if (!email || !company) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // In production, save to database and send confirmation email
        const contactRequest = {
            id: Date.now(),
            email,
            company,
            createdAt: new Date()
        };

        res.json({
            success: true,
            message: 'Demo request submitted successfully',
            data: contactRequest
        });
    } catch (error) {
        console.error('Error submitting contact form:', error);
        res.status(500).json({ error: 'Failed to submit contact form' });
    }
});

// AI Lead Generation Function
function generateAILeads({ industry, targetRole, companySize, location, painPoints }) {
    const leads = [];
    
    // Mock data based on criteria
    const mockCompanies = [
        { name: 'TechFlow Solutions', size: '51-200', location: 'USA', phone: '+1-555-0101' },
        { name: 'CloudScale Inc', size: '201-500', location: 'USA', phone: '+1-555-0102' },
        { name: 'DataSync Corp', size: '11-50', location: 'Europe', phone: '+1-555-0103' },
        { name: 'AutomateHub', size: '51-200', location: 'USA', phone: '+1-555-0104' },
        { name: 'SecureVault Systems', size: '201-500', location: 'Global', phone: '+1-555-0105' },
        { name: 'BrandHub Digital', size: '51-200', location: 'USA', phone: '+1-555-0106' },
        { name: 'ContentAI', size: '11-50', location: 'Europe', phone: '+1-555-0107' },
        { name: 'ShopXpress', size: '11-50', location: 'USA', phone: '+1-555-0108' },
        { name: 'RetailEdge', size: '51-200', location: 'USA', phone: '+1-555-0109' },
        { name: 'MediTech Solutions', size: '51-200', location: 'USA', phone: '+1-555-0110' }
    ];

    // Filter and score leads
    const filteredCompanies = mockCompanies
        .filter(company => {
            const sizeMatch = !companySize || company.size === companySize;
            const locationMatch = !location || location.toLowerCase() === 'global' || company.location.toLowerCase().includes(location.toLowerCase());
            return sizeMatch && locationMatch;
        })
        .slice(0, 5); // Return top 5

    filteredCompanies.forEach((company, index) => {
        const score = Math.floor(Math.random() * 25) + 75;
        leads.push({
            id: index,
            company: company.name,
            role: targetRole || 'CEO',
            email: `contact@${company.name.toLowerCase().replace(/\s+/g, '')}.com`,
            phone: company.phone,
            size: company.size,
            location: company.location,
            score: Math.min(score, 100),
            matchedKeywords: painPoints.split(',').slice(0, 3)
        });
    });

    return leads;
}

// Campaign tracking (mock)
const campaigns = {};

app.post('/api/campaigns/create', (req, res) => {
    const { name, type, leads } = req.body;
    
    if (!name || !type || !leads) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const campaignId = Date.now().toString();
    campaigns[campaignId] = {
        id: campaignId,
        name,
        type,
        leadsCount: leads.length,
        status: 'active',
        createdAt: new Date(),
        sentCount: 0,
        openCount: 0,
        clickCount: 0,
        responseCount: 0
    };

    res.json({
        success: true,
        message: 'Campaign created successfully',
        campaign: campaigns[campaignId]
    });
});

app.get('/api/campaigns/:id', (req, res) => {
    const campaign = campaigns[req.params.id];
    
    if (!campaign) {
        return res.status(404).json({ error: 'Campaign not found' });
    }

    res.json({
        success: true,
        campaign
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 AI Lead Generator server running on http://localhost:${PORT}`);
    console.log(`📊 Open your browser to http://localhost:${PORT}`);
    console.log(`📧 Email API: POST /api/send-email`);
    console.log(`💬 SMS API: POST /api/send-sms`);
});

module.exports = app;