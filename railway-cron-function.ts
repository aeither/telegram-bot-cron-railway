async function triggerBackend() {
    const url =
      "http://REPLACE_WITH_YOUR_RAILWAY_DOMAIN.railway.internal:3000/cron/trigger";
  
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CRON_SECRET}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "test",
        chatId: process.env.TG_CHAT_ID,
        message: "Cron test ping",
      }),
    });
  
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${await res.text()}`);
    }
  }
  
  triggerBackend().catch((err) => {
    console.error("Cron failed:", err);
    process.exit(1);
  });
  