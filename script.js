// Mock AI Lead Generation Data
const mockLeadsDatabase = {
    'saas': {
        'ceo': [
            { company: 'TechFlow Solutions', role: 'CEO', email: 'john@techflow.com', phone: '+1-555-0101', size: '51-200', location: 'USA', score: 95, reason: 'High-growth SaaS company, recent funding' },
            { company: 'CloudScale Inc', role: 'CEO', email: 'sarah@cloudscale.io', phone: '+1-555-0102', size: '201-500', location: 'USA', reason: 'Enterprise cloud platform, expanding sales team' },
            { company: 'DataSync Corp', role: 'CEO', email: 'mike@datasync.io', phone: '+1-555-0103', size: '11-50', location: 'Europe', reason: 'Data integration platform, recent Series A' },
            { company: 'AutomateHub', role: 'CEO', email: 'lisa@automatehub.com', phone: '+1-555-0104', size: '51-200', location: 'USA', reason: 'Workflow automation, strong growth metrics' },
            { company: 'SecureVault Systems', role: 'CEO', email: 'david@securevault.io', phone: '+1-555-0105', size: '201-500', location: 'Global', reason: 'Security-focused SaaS, enterprise clients' },
        ],
        'marketing manager': [
            { company: 'BrandHub Digital', role: 'Marketing Manager', email: 'emma@brandhub.com', phone: '+1-555-0106', size: '51-200', location: 'USA', score: 88, reason: 'Digital marketing platform, aggressive growth' },
            { company: 'ContentAI', role: 'Marketing Manager', email: 'alex@contentai.io', phone: '+1-555-0107', size: '11-50', location: 'Europe', reason: 'AI content creation, scaling up marketing' },
        ]
    },
    'ecommerce': {
        'ceo': [
            { company: 'ShopXpress', role: 'CEO', email: 'tom@shopxpress.com', phone: '+1-555-0108', size: '11-50', location: 'USA', score: 92, reason: 'High-volume e-commerce platform, seeking optimization' },
            { company: 'RetailEdge', role: 'CEO', email: 'jennifer@retailedge.io', phone: '+1-555-0109', size: '51-200', location: 'USA', reason: 'Omnichannel retail platform, expanding markets' },
        ]
    },
    'healthcare': {
        'ceo': [
            { company: 'MediTech Solutions', role: 'CEO', email: 'robert@meditech.io', phone: '+1-555-0110', size: '51-200', location: 'USA', score: 90, reason: 'Healthcare IT, growing patient base' },
            { company: 'HealthFlow', role: 'CEO', email: 'patricia@healthflow.com', phone: '+1-555-0111', size: '11-50', location: 'Europe', reason: 'Digital health platform, regulatory expansion' },
        ]
    }
};

// Email Templates
const emailTemplates = {
    'initial': {
        subject: 'Quick Question About Your Growth Strategy',
        body: `Hi {NAME},

I came across {COMPANY} and was impressed by your work in {INDUSTRY}.

I wanted to reach out because we help companies like yours streamline lead generation and accelerate growth. Many of your peers are already seeing 3-5x improvements in their conversion rates.

Would you be open to a quick 15-minute conversation? I'd love to explore how we could help.

Best regards,
{YOUR_NAME}`
    },
    'followup': {
        subject: 'Following up - Growth opportunity for {COMPANY}',
        body: `Hi {NAME},

I hope this finds you well. I wanted to follow up on my previous message.

We've helped {INDUSTRY} companies reduce their customer acquisition costs by 40% on average. Given your company's current trajectory, I thought it might be worth exploring.

Would you have 15 minutes next week?

Best regards,
{YOUR_NAME}`
    },
    'demo': {
        subject: 'See how we can scale {COMPANY}',
        body: `Hi {NAME},

Quick thought: What if you could generate qualified leads 10x faster than you currently do?

That's what we specialize in. We've put together a personalized demo showing how {COMPANY} could benefit.

Let me know if you'd like to see it.

{YOUR_NAME}`
    }
};

// SMS Templates
const smsTemplates = {
    'initial': 'Hi {NAME}, we help {INDUSTRY} companies scale faster. Saw your profile and thought you might find it valuable. Quick call? {URL}',
    'followup': 'Hey {NAME}, quick follow-up on our message. Would love to show you how we\'re helping companies like {COMPANY} grow. Free 15 min call?',
    'demo': 'Hi {NAME}, we created a personalized demo for {COMPANY}. Worth 5 mins? {URL}'
};

// Utility Functions
function scrollTo(selector) {
    const element = document.querySelector(selector);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

function showElement(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'block';
}

function hideElement(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
}

// AI Lead Generation Function
async function generateLeads(event) {
    event.preventDefault();

    const industry = document.getElementById('industry').value.toLowerCase();
    const targetRole = document.getElementById('targetRole').value.toLowerCase();
    const companySize = document.getElementById('companySize').value;
    const location = document.getElementById('location').value;
    const painPoints = document.getElementById('painPoints').value;

    // Show loading state
    hideElement('results');
    showElement('loading');

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate leads (mock AI)
    const leads = generateMockLeads(industry, targetRole, companySize, location, painPoints);

    // Display results
    displayLeads(leads);
    hideElement('loading');
    showElement('results');
}

function generateMockLeads(industry, targetRole, companySize, location, painPoints) {
    let leads = [];

    // Get leads from database based on industry
    const industryKey = Object.keys(mockLeadsDatabase).find(key => industry.includes(key)) || 'saas';
    const roleKey = Object.keys(mockLeadsDatabase[industryKey]).find(key => targetRole.includes(key)) || 'ceo';

    let candidateLeads = mockLeadsDatabase[industryKey][roleKey] || [];

    // Filter by company size and location
    candidateLeads = candidateLeads.filter(lead => {
        const sizeMatch = !companySize || lead.size === companySize;
        const locationMatch = !location || location.toLowerCase() === 'global' || lead.location.toLowerCase().includes(location.toLowerCase());
        return sizeMatch && locationMatch;
    });

    // If no exact matches, return all
    if (candidateLeads.length === 0) {
        candidateLeads = mockLeadsDatabase[industryKey][roleKey];
    }

    // Add pain point keywords to leads
    const keywords = painPoints.split(',').map(p => p.trim());
    leads = candidateLeads.map((lead, index) => ({
        ...lead,
        id: index,
        score: calculateScore(lead, keywords, painPoints),
        matchedKeywords: keywords.filter(k => Math.random() > 0.3) // Random keyword matching
    }));

    // Sort by score descending
    return leads.sort((a, b) => b.score - a.score);
}

function calculateScore(lead, keywords, painPoints) {
    let score = Math.floor(Math.random() * 25) + 75; // Base score 75-100
    
    // Adjust based on company size
    const sizeScoreBonus = {
        '1-10': 5,
        '11-50': 8,
        '51-200': 10,
        '201-500': 12,
        '500+': 15
    };
    
    score += sizeScoreBonus[lead.size] || 0;
    score = Math.min(score, 100);
    
    return score;
}

function displayLeads(leads) {
    const leadsList = document.getElementById('leadsList');
    leadsList.innerHTML = '';

    if (leads.length === 0) {
        leadsList.innerHTML = '<p style="text-align: center; color: #64748b; padding: 40px;">No leads found matching your criteria. Try adjusting your filters.</p>';
        return;
    }

    leads.forEach(lead => {
        const scoreClass = lead.score >= 90 ? 'high' : lead.score >= 80 ? 'medium' : 'low';
        const scoreLabel = lead.score >= 90 ? 'High Intent' : lead.score >= 80 ? 'Medium Intent' : 'Low Intent';

        const leadCard = document.createElement('div');
        leadCard.className = 'lead-card';
        leadCard.innerHTML = `
            <div class="lead-header">
                <span class="lead-company">${lead.company}</span>
                <span class="lead-score ${scoreClass}">${scoreLabel} (${lead.score}%)</span>
            </div>
            <div class="lead-details">
                <div class="lead-detail"><strong>Role:</strong> ${lead.role}</div>
                <div class="lead-detail"><strong>Email:</strong> ${lead.email}</div>
                <div class="lead-detail"><strong>Phone:</strong> ${lead.phone}</div>
                <div class="lead-detail"><strong>Company Size:</strong> ${lead.size}</div>
                <div class="lead-detail"><strong>Location:</strong> ${lead.location}</div>
            </div>
            <div style="margin-bottom: 15px; font-size: 14px; color: #64748b;">
                <strong>Why this lead:</strong> ${lead.reason}
            </div>
            <div class="lead-tags">
                ${lead.matchedKeywords.map(keyword => `<span class="tag">${keyword}</span>`).join('')}
            </div>
            <div class="lead-actions">
                <button class="btn btn-primary" onclick="openEmailModal('${lead.company}', '${lead.email}', '${lead.role}')">📧 Send Email</button>
                <button class="btn btn-secondary" onclick="openSMSModal('${lead.company}', '${lead.phone}', '${lead.role}')">💬 Send SMS</button>
                <button class="btn btn-secondary" onclick="saveLead('${lead.company}', '${lead.email}')">💾 Save</button>
            </div>
        `;
        leadsList.appendChild(leadCard);
    });

    // Store leads for export
    window.currentLeads = leads;
}

// Email Modal Functions
function openEmailModal(company, email, role) {
    document.getElementById('modalEmailCompany').value = company;
    document.getElementById('modalEmailAddress').value = email;
    document.getElementById('modalContactRole').value = role;
    
    // Set default template
    document.getElementById('emailTemplate').value = 'initial';
    updateEmailPreview();
    
    showElement('emailModal');
    document.body.style.overflow = 'hidden';
}

function closeEmailModal() {
    hideElement('emailModal');
    document.body.style.overflow = 'auto';
}

function updateEmailPreview() {
    const template = document.getElementById('emailTemplate').value;
    const company = document.getElementById('modalEmailCompany').value;
    const role = document.getElementById('modalContactRole').value;
    
    let subject = emailTemplates[template].subject
        .replace('{COMPANY}', company);
    
    let body = emailTemplates[template].body
        .replace('{NAME}', role.split(' ')[0])
        .replace('{COMPANY}', company)
        .replace('{YOUR_NAME}', 'Your Name')
        .replace('{INDUSTRY}', 'your industry');
    
    document.getElementById('emailSubjectPreview').textContent = subject;
    document.getElementById('emailBodyPreview').textContent = body;
}

function customizeEmail() {
    const subject = prompt('Enter email subject:', document.getElementById('emailSubjectPreview').textContent);
    if (subject !== null) {
        document.getElementById('emailSubjectPreview').textContent = subject;
    }
}

function sendEmail() {
    const email = document.getElementById('modalEmailAddress').value;
    const company = document.getElementById('modalEmailCompany').value;
    const subject = document.getElementById('emailSubjectPreview').textContent;
    
    // In production, call backend to send email
    fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            to: email,
            subject: subject,
            body: document.getElementById('emailBodyPreview').textContent
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            showNotification(`✅ Email sent to ${company}!`, 'success');
            closeEmailModal();
        } else {
            showNotification('❌ Failed to send email', 'error');
        }
    })
    .catch(err => {
        console.error(err);
        showNotification('❌ Error sending email', 'error');
    });
}

// SMS Modal Functions
function openSMSModal(company, phone, role) {
    document.getElementById('modalSMSCompany').value = company;
    document.getElementById('modalPhoneNumber').value = phone;
    document.getElementById('modalSMSRole').value = role;
    
    // Set default template
    document.getElementById('smsTemplate').value = 'initial';
    updateSMSPreview();
    
    showElement('smsModal');
    document.body.style.overflow = 'hidden';
}

function closeSMSModal() {
    hideElement('smsModal');
    document.body.style.overflow = 'auto';
}

function updateSMSPreview() {
    const template = document.getElementById('smsTemplate').value;
    const company = document.getElementById('modalSMSCompany').value;
    const role = document.getElementById('modalSMSRole').value;
    
    let message = smsTemplates[template]
        .replace('{NAME}', role.split(' ')[0])
        .replace('{COMPANY}', company)
        .replace('{INDUSTRY}', 'your industry')
        .replace('{URL}', 'leadai.com/demo');
    
    const charCount = message.length;
    document.getElementById('smsPreview').textContent = message;
    document.getElementById('charCount').textContent = `${charCount} / 160 characters`;
    
    if (charCount > 160) {
        document.getElementById('charCount').style.color = '#ef4444';
    } else {
        document.getElementById('charCount').style.color = '#10b981';
    }
}

function customizeSMS() {
    const message = prompt('Customize your message:', document.getElementById('smsPreview').textContent);
    if (message !== null && message.length <= 160) {
        document.getElementById('smsPreview').textContent = message;
        updateSMSPreview();
    } else if (message !== null) {
        alert('Message exceeds 160 characters!');
    }
}

function sendSMS() {
    const phone = document.getElementById('modalPhoneNumber').value;
    const company = document.getElementById('modalSMSCompany').value;
    const message = document.getElementById('smsPreview').textContent;
    
    // In production, call backend to send SMS via Twilio
    fetch('/api/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            to: phone,
            message: message
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            showNotification(`✅ SMS sent to ${company}!`, 'success');
            closeSMSModal();
        } else {
            showNotification('❌ Failed to send SMS', 'error');
        }
    })
    .catch(err => {
        console.error(err);
        showNotification('❌ Error sending SMS', 'error');
    });
}

// Notification Function
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function saveLead(company, email) {
    // In production, save to user account/CRM
    showNotification(`✅ ${company} saved to your leads!`, 'success');
}

function exportLeads() {
    if (!window.currentLeads || window.currentLeads.length === 0) {
        alert('No leads to export');
        return;
    }

    // Create CSV content
    let csv = 'Company,Role,Email,Phone,Company Size,Location,Score\n';
    
    window.currentLeads.forEach(lead => {
        csv += `"${lead.company}","${lead.role}","${lead.email}","${lead.phone}","${lead.size}","${lead.location}",${lead.score}\n`;
    });

    // Create download link
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads_${new Date().getTime()}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

function submitContact(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    showNotification('✅ Demo request sent! Check your email.', 'success');
    event.target.reset();
}

// Close modals on outside click
document.addEventListener('click', function(event) {
    const emailModal = document.getElementById('emailModal');
    const smsModal = document.getElementById('smsModal');
    
    if (event.target === emailModal) {
        closeEmailModal();
    }
    if (event.target === smsModal) {
        closeSMSModal();
    }
});

// Close modals on Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeEmailModal();
        closeSMSModal();
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Add animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe sections for animation
    document.querySelectorAll('.features-grid, .pricing-grid, .lead-card').forEach(el => {
        observer.observe(el);
    });
});