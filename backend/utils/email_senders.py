from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from account.models import User


def send_verification_email(user: User, plain_code: str) -> None:
    """
    Send a verification email to a user.

    This function generates and sends an email containing a verification code 
    to the user's registered email address. The email is sent in both HTML 
    and plain text formats for compatibility with different email clients.

    Args:
        user (User): A user object with at least `email` and `first_name` attributes.
            Typically, this would be a Django `User` model instance.
        plain_code (str): The plain text verification code to be included in the email.

    Email Template:
        The HTML template used for the email is `emails/verification_email.html`. 
        It should be present in the template directory and include placeholders 
        for `first_name` and `verification_code` in the context.

    Dependencies:
        - `settings.DEFAULT_FROM_EMAIL` must be configured in your Django settings file.
        - `emails/verification_email.html` must exist in the templates directory.

    Raises:
        ValueError: If `settings.DEFAULT_FROM_EMAIL` is not configured.
        Any: Other exceptions raised during the email-sending process will propagate.

    Returns:
        None: This function does not return a value.
    """
    # Validate that DEFAULT_FROM_EMAIL is configured
    from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', None)
    if not from_email:
        raise ValueError(
            "DEFAULT_FROM_EMAIL is not configured in Django settings.")

    subject = 'Verify your email address'
    to_email = user.email

    # Context for rendering the email template
    context = {
        'first_name': user.first_name,
        'verification_code': plain_code,
    }

    # Render HTML content and generate plain text alternative
    html_content = render_to_string('verification_email.html', context)
    text_content = strip_tags(html_content)

    # Construct the email
    email = EmailMultiAlternatives(
        subject=subject,
        body=text_content,
        from_email=from_email,
        to=[to_email]
    )
    email.attach_alternative(html_content, "text/html")

    # Send the email
    email.send()
