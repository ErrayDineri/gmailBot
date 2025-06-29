# 📧 Gmail Bot

A Node.js application that automatically listens for incoming Gmail messages and provides an API endpoint to send threaded replies. Perfect for building automated email response systems integrated with n8n workflows.

## ✨ Features

- **Real-time Email Monitoring**: Automatically detects new emails in your Gmail inbox using IMAP
- **Webhook Integration**: Forwards incoming email data to n8n or any webhook URL for processing
- **Threaded Replies**: Sends replies with proper email threading headers (`In-Reply-To`, `References`)
- **REST API**: Simple HTTP endpoint for sending email replies
- **Gmail Integration**: Seamless integration with Gmail using IMAP and SMTP

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- Gmail account with App Password enabled
- n8n instance or webhook endpoint (optional)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd gmailBot
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
EMAIL_ADDRESS=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
WEBHOOK_URL=https://your-n8n-instance.com/webhook/gmail
PORT=3000
```

4. Start the application:
```bash
node index.js
```

## 🔧 Configuration

### Gmail Setup

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
   - Use this password in your `.env` file

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `EMAIL_ADDRESS` | Your Gmail address | ✅ |
| `EMAIL_PASSWORD` | Gmail App Password | ✅ |
| `WEBHOOK_URL` | URL to send incoming email data | ✅ |
| `PORT` | Server port (default: 3000) | ❌ |

## 📡 API Endpoints

### Send Reply

Send a threaded reply to an email.

**Endpoint:** `POST /send-reply`

**Request Body:**
```json
{
  "to": "recipient@example.com",
  "subject": "Re: Original Subject",
  "message": "Your reply message here",
  "messageId": "<original-message-id@gmail.com>",
  "references": "<reference-chain>"
}
```

**Response:**
```json
{
  "status": "Reply sent with threading headers"
}
```

**Required Fields:**
- `to`: Recipient email address
- `subject`: Email subject
- `message`: Reply content

**Optional Fields:**
- `messageId`: Original message ID for proper threading
- `references`: Reference chain for email threading

## 🔄 How It Works

1. **Email Listening**: The bot connects to Gmail via IMAP and monitors the inbox for new messages
2. **Data Processing**: When a new email arrives, it extracts key information (sender, subject, content, etc.)
3. **Webhook Notification**: Email data is sent to your configured webhook URL for processing
4. **Reply API**: Use the `/send-reply` endpoint to send threaded responses

## 📊 Email Data Structure

When forwarding emails to your webhook, the following data structure is sent:

```json
{
  "from": "sender@example.com",
  "to": "your-email@gmail.com",
  "subject": "Email Subject",
  "date": "2025-06-29T10:30:00Z",
  "raw": "Raw email source including headers..."
}
```

## 🛠️ Integration Examples

### With n8n

1. Create a webhook node in n8n
2. Set the webhook URL in your `.env` file
3. Process incoming email data in your n8n workflow
4. Use the bot's API to send replies

### Manual API Usage

```bash
# Send a simple reply
curl -X POST http://localhost:3000/send-reply \
  -H "Content-Type: application/json" \
  -d '{
    "to": "user@example.com",
    "subject": "Re: Your Question",
    "message": "Thanks for your email! Here is my response..."
  }'
```

## 🔒 Security Notes

- Never commit your `.env` file to version control
- Use Gmail App Passwords instead of your main password
- Consider using environment variables in production
- Implement rate limiting for production use

## 📦 Dependencies

- **express**: Web framework for the API server
- **imapflow**: Modern IMAP client for email monitoring
- **nodemailer**: Email sending library
- **axios**: HTTP client for webhook requests
- **dotenv**: Environment variable management

## 🚨 Troubleshooting

### Common Issues

1. **Authentication Error**: Ensure you're using an App Password, not your regular Gmail password
2. **IMAP Connection Failed**: Check that IMAP is enabled in your Gmail settings
3. **Webhook Errors**: Verify your webhook URL is accessible and accepting POST requests

### Debugging

The application logs important events to the console:
- New email notifications
- Webhook errors
- Email sending results

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Made with ❤️ for automated email workflows**
