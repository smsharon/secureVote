"""
Base Django settings for the Secure Vote System project.

This file contains all shared settings used across
different environments (development, production, testing).

Professional engineering principles applied:
- Environment variable management
- Modular app organization
- Secure defaults
- Scalability considerations
- Clear separation of concerns
- Readable structure
"""

import os
from datetime import timedelta
from pathlib import Path

from decouple import config

# =========================================================
# CORE PROJECT PATHS
# =========================================================

# BASE_DIR points to:
# backend/
#
# Using Pathlib improves readability and cross-platform support.
BASE_DIR = Path(__file__).resolve().parent.parent.parent


# =========================================================
# SECURITY SETTINGS
# =========================================================

# Secret key loaded from environment variables.
# Never hardcode secrets in source code.
SECRET_KEY = config("SECRET_KEY")

# DEBUG should only be True in development.
# In production this MUST be False.
DEBUG = config("DEBUG", cast=bool, default=False)

# Hosts/domain names allowed to serve the application.
# Populate appropriately in production.
ALLOWED_HOSTS = []


# =========================================================
# DJANGO APPLICATIONS
# =========================================================

# Applications maintained by Django itself.
DJANGO_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django_ratelimit",
]

# Third-party applications.
THIRD_PARTY_APPS = [
    # Django REST Framework
    "rest_framework",
    # JWT Authentication
    "rest_framework_simplejwt",
    # OpenAPI/Swagger documentation
    "drf_spectacular",
    # Filtering support
    "django_filters",
    # Cross-Origin Resource Sharing
    "corsheaders",
    "rest_framework_simplejwt.token_blacklist",
]

# Local project applications.
LOCAL_APPS = [
    "apps.users",
    "apps.elections",
    "apps.votes",
    "apps.common",
]

# Combined installed applications.
INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS


# =========================================================
# MIDDLEWARE CONFIGURATION
# =========================================================

MIDDLEWARE = [
    # Handles Cross-Origin requests.
    "corsheaders.middleware.CorsMiddleware",
    # Adds security-related protections.
    "django.middleware.security.SecurityMiddleware",
    # Manages sessions across requests.
    "django.contrib.sessions.middleware.SessionMiddleware",
    # Handles common HTTP functionality.
    "django.middleware.common.CommonMiddleware",
    # Protects against Cross-Site Request Forgery attacks.
    "django.middleware.csrf.CsrfViewMiddleware",
    # Associates authenticated users with requests.
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    # Enables Django messaging framework.
    "django.contrib.messages.middleware.MessageMiddleware",
    # Protects against clickjacking attacks.
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]


# =========================================================
# ROOT URL CONFIGURATION
# =========================================================

ROOT_URLCONF = "config.urls"


# =========================================================
# TEMPLATE CONFIGURATION
# =========================================================

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        # Global template directories.
        "DIRS": [],
        # Enables template discovery inside installed apps.
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]


# =========================================================
# WSGI / ASGI CONFIGURATION
# =========================================================

# WSGI is used for traditional synchronous deployment.
WSGI_APPLICATION = "config.wsgi.application"

# ASGI supports asynchronous features such as:
# - WebSockets
# - Real-time communication
# - Django Channels
ASGI_APPLICATION = "config.asgi.application"


# =========================================================
# DATABASE CONFIGURATION
# =========================================================

# PostgreSQL is used because it provides:
# - Reliability
# - Transactions
# - Scalability
# - Advanced indexing
# - Better production readiness
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": config("DB_NAME"),
        "USER": config("DB_USER"),
        "PASSWORD": config("DB_PASSWORD"),
        "HOST": config("DB_HOST"),
        "PORT": config("DB_PORT"),
    }
}


# =========================================================
# CUSTOM USER MODEL
# =========================================================

# Using a custom user model from the beginning avoids
# painful migrations later when additional user fields
# become necessary.
AUTH_USER_MODEL = "users.User"


# =========================================================
# PASSWORD VALIDATION
# =========================================================

# Built-in validators improve password security.
AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": (
            "django.contrib.auth.password_validation."
            "UserAttributeSimilarityValidator"
        ),
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


SIMPLE_JWT = {
    # Access token expires quickly
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=15),
    # Refresh token lasts longer
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    # Generate a new refresh token on refresh
    "ROTATE_REFRESH_TOKENS": True,
    # Blacklist old refresh tokens
    "BLACKLIST_AFTER_ROTATION": True,
    # Update last login time
    "UPDATE_LAST_LOGIN": True,
    "ALGORITHM": "HS256",
    "SIGNING_KEY": SECRET_KEY,
    "AUTH_HEADER_TYPES": ("Bearer",),
}


# =========================================================
# DJANGO REST FRAMEWORK CONFIGURATION
# =========================================================

REST_FRAMEWORK = {
    # JWT-based authentication.
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    # Secure-by-default permissions.
    # Endpoints are protected unless explicitly made public.
    "DEFAULT_PERMISSION_CLASSES": ("rest_framework.permissions.IsAuthenticated",),
    # OpenAPI schema generation.
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    # Enables filtering, searching, and ordering support.
    "DEFAULT_FILTER_BACKENDS": (
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.SearchFilter",
        "rest_framework.filters.OrderingFilter",
    ),
    # Global pagination configuration.
    "DEFAULT_PAGINATION_CLASS": "apps.common.pagination.StandardResultsPagination",
    "PAGE_SIZE": 10,
    # =====================================================
    # THROTTLING
    # =====================================================
    "DEFAULT_THROTTLE_CLASSES": (
        # Anonymous users
        "rest_framework.throttling.AnonRateThrottle",
        # Authenticated users
        "rest_framework.throttling.UserRateThrottle",
    ),
    "DEFAULT_THROTTLE_RATES": {
        # Limits unauthenticated requests
        "anon": "100/day",
        # Limits authenticated user requests
        "user": "1000/day",
    },
    "EXCEPTION_HANDLER": "apps.common.exceptions.custom_exception_handler",
}


# =========================================================
# JWT AUTHENTICATION CONFIGURATION
# =========================================================

SIMPLE_JWT = {
    # Short-lived access tokens improve security.
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=30),
    # Refresh tokens allow token renewal.
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
    # Rotating refresh tokens reduces replay attack risks.
    "ROTATE_REFRESH_TOKENS": True,
    # Invalidates old refresh tokens after rotation.
    "BLACKLIST_AFTER_ROTATION": True,
    # Authorization header format:
    # Authorization: Bearer <token>
    "AUTH_HEADER_TYPES": ("Bearer",),
}


# =========================================================
# API DOCUMENTATION SETTINGS
# =========================================================

SPECTACULAR_SETTINGS = {
    # =====================================================
    # API METADATA
    # =====================================================
    "TITLE": "Secure Vote API",
    "DESCRIPTION": (
        "Production-grade electronic voting "
        "system API built with Django REST Framework."
    ),
    "VERSION": "1.0.0",
    "SERVE_INCLUDE_SCHEMA": False,
    # =====================================================
    # SWAGGER UI SETTINGS
    # =====================================================
    "SWAGGER_UI_SETTINGS": {
        "deepLinking": True,
        "persistAuthorization": True,
    },
    # =====================================================
    # SECURITY DEFINITIONS
    # =====================================================
    "COMPONENT_SPLIT_REQUEST": True,
    "SECURITY": [
        {
            "BearerAuth": [],
        }
    ],
    "SECURITY_SCHEMES": {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
        }
    },
}


# =========================================================
# CORS CONFIGURATION
# =========================================================

# Allows frontend applications to communicate with backend.
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]

# Trusted origins for CSRF protection.
CSRF_TRUSTED_ORIGINS = [
    "http://localhost:5173",
]


# =========================================================
# STATIC & MEDIA FILES
# =========================================================

# Static files:
# CSS, JavaScript, framework assets.
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

# Media files:
# User uploads such as candidate images and party logos.
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"


# =========================================================
# INTERNATIONALIZATION
# =========================================================

LANGUAGE_CODE = "en-us"

# UTC is recommended for backend consistency.
TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True


# =========================================================
# DEFAULT PRIMARY KEY FIELD TYPE
# =========================================================

# BigAutoField supports larger scaling capacity.
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


# =========================================================
# INTERNAL IPS
# =========================================================

# Useful for debugging and development tooling.
INTERNAL_IPS = [
    "127.0.0.1",
]


# =========================================================
# LOGGING CONFIGURATION
# =========================================================

# Structured logging improves:
# - Debugging
# - Monitoring
# - Production diagnostics
# - Security auditing
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {
            "format": ("[{asctime}] " "{levelname} " "{module} " "{message}"),
            "style": "{",
        },
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "verbose",
        },
    },
    "root": {
        "handlers": ["console"],
        "level": "INFO",
    },
}


# ============================================================================
# Celery Configuration
# ============================================================================

CELERY_BROKER_URL = os.getenv(
    "CELERY_BROKER_URL",
    "redis://redis:6379/0",
)

CELERY_RESULT_BACKEND = os.getenv(
    "CELERY_RESULT_BACKEND",
    "redis://redis:6379/0",
)

CELERY_ACCEPT_CONTENT = ["json"]

CELERY_TASK_SERIALIZER = "json"

CELERY_RESULT_SERIALIZER = "json"

CELERY_TIMEZONE = "UTC"

SILENCED_SYSTEM_CHECKS = ["django_ratelimit.E003", "django_ratelimit.W001"]
CORS_ALLOW_CREDENTIALS = True
