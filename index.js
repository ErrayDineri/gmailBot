const express = require("express");
const {
    ImapFlow
} = require("imapflow");
const nodemailer = require("nodemailer");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(express.json());

const {
    EMAIL_ADDRESS,
    EMAIL_PASSWORD,
    WEBHOOK_URL,
    PORT = 3000,
} = process.env;

// 1. Setup IMAP Client to listen to new messages
async function startEmailListener() {
    const client = new ImapFlow({
        host: "imap.gmail.com",
        port: 993,
        secure: true,
        auth: {
            user: EMAIL_ADDRESS,
            pass: EMAIL_PASSWORD,
        },
    });

    await client.connect();
    await client.mailboxOpen("INBOX");

    client.on("exists", async () => {
        let message = await client.fetchOne("*", {
            envelope: true,
            source: true,
        });
        const {
            envelope,
            source
        } = message;

        const emailData = {
            from: envelope.from[0].address,
            to: envelope.to[0].address,
            subject: envelope.subject,
            date: envelope.date,
            raw: source.toString(),
        };

        console.log("📨 New Email:", emailData.subject);

        // Send to n8n webhook for processing
        await axios.post(WEBHOOK_URL, emailData).catch((err) =>
            console.error("Webhook error:", err.message)
        );
    });
}

// 2. HTTP Endpoint to reply to sender with threading headers
app.post("/send-reply", async (req, res) => {
    const {
        to,
        subject,
        message,
        messageId,
        references
    } = req.body;

    if (!to || !subject || !message)
        return res.status(400).json({
            error: "Missing fields"
        });

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: EMAIL_ADDRESS,
            pass: EMAIL_PASSWORD,
        },
    });

    // Build mail options with possible In-Reply-To and References headers
    const mailOptions = {
        from: EMAIL_ADDRESS,
        to,
        subject,
        text: message,
        headers: {},
    };

    if (messageId) {
        mailOptions.headers["In-Reply-To"] = messageId;
    }

    if (references) {
        mailOptions.headers["References"] = references + (messageId ? ` ${messageId}` : "");
    } else if (messageId) {
        mailOptions.headers["References"] = messageId;
    }

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({
            status: "Reply sent with threading headers"
        });
    } catch (err) {
        console.error("Send error:", err.message);
        res.status(500).json({
            error: "Failed to send"
        });
    }
});

// 3. Start server and IMAP listener
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    startEmailListener().catch(console.error);
});