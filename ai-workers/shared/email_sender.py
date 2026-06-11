"""
Email sender using SendGrid.
Only called AFTER human approves the outreach task.
"""

from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from .config import SENDGRID_API_KEY, FROM_EMAIL


def send_email(to_email: str, to_name: str, subject: str, body: str) -> dict:
    """
    Send email via SendGrid.
    Returns dict with success status.
    """
    if not SENDGRID_API_KEY:
        print(f"⚠️  SendGrid not configured — mock send to {to_email}")
        return {
            "success": True,
            "mock": True,
            "message": f"Mock email sent to {to_email} (set SENDGRID_API_KEY for real sending)",
        }

    try:
        message = Mail(
            from_email=FROM_EMAIL,
            to_emails=to_email,
            subject=subject,
            plain_text_content=body,
        )

        sg = SendGridAPIClient(SENDGRID_API_KEY)
        response = sg.send(message)

        return {
            "success": True,
            "mock": False,
            "status_code": response.status_code,
            "message": f"Email sent to {to_email}",
        }
    except Exception as e:
        print(f"❌ SendGrid error: {e}")
        return {
            "success": False,
            "error": str(e),
        }
