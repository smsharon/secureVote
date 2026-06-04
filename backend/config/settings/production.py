"""
Production settings.
"""

from .base import *  # noqa: F401,F403

DEBUG = False

ALLOWED_HOSTS = [
    "securevote.com",
    "www.securevote.com",
]
# Secure Production Cookies
SESSION_COOKIE_SECURE = True

CSRF_COOKIE_SECURE = True

# Enable HSTS
SECURE_HSTS_SECONDS = 31536000

SECURE_HSTS_INCLUDE_SUBDOMAINS = True

SECURE_HSTS_PRELOAD = True

# Prevent MIME Sniffing
SECURE_CONTENT_TYPE_NOSNIFF = True

# Enable XSS Protection
SECURE_BROWSER_XSS_FILTER = True

# Prevent Clickjacking
X_FRAME_OPTIONS = "DENY"

# Redirect all HTTP traffic to HTTPS
SECURE_SSL_REDIRECT = True

# Use secure cookies and headers when behind a proxy
SECURE_PROXY_SSL_HEADER = (
    "HTTP_X_FORWARDED_PROTO",
    "https",
)

# Static files configuration for production
STATIC_ROOT = BASE_DIR / "staticfiles"   # noqa: F405
