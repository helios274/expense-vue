from pathlib import Path
from datetime import timedelta
import environ


BASE_DIR = Path(__file__).resolve().parent.parent

env = environ.Env()
# read environment variables from .env file
environ.Env.read_env(BASE_DIR / '.env')


SECRET_KEY = env('SECRET_KEY')
DEBUG = env.bool('DEBUG', default=True)
ALLOWED_HOSTS = env.list('ALLOWED_HOSTS', str, default=['localhost'])


INSTALLED_APPS = [
    # 'django_debug_toolbar',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    "corsheaders",
    'rest_framework',
    'django_filters',
    "drf_standardized_errors",
    'storages',
    'account',
    'expense',
]


MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


ROOT_URLCONF = 'expense_vue.urls'


TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]


WSGI_APPLICATION = 'expense_vue.wsgi.application'


DATABASES = {
    'default': env.db_url('DB_URL')
}


AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

AUTHENTICATION_BACKENDS = [
    'account.backends.CustomAuthenticationBackend',
    'django.contrib.auth.backends.ModelBackend',
]


LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

if DEBUG:
    INTERNAL_IPS = [
        "127.0.0.1",
    ]

    STATIC_ROOT = BASE_DIR / 'static'
    STATIC_URL = '/static/'

else:
    CSRF_COOKIE_SECURE = True

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = env.list('CORS_ALLOWED_ORIGINS', str)

# STATICFILES_DIRS = [
#     BASE_DIR / 'static'
# ]

# Google cloud storage settings
# GS_CREDENTIALS = service_account.Credentials.from_service_account_file(
#     os.path.join(BASE_DIR, 'sto-admin-sa.json')
# )
# GS_PROJECT_ID = env('GS_PROJECT_ID')
# GS_BUCKET_NAME = env('GS_BUCKET_NAME')
# STATICFILES_STORAGE = 'custom_storages.StaticStorage'
# DEFAULT_FILE_STORAGE = 'custom_storages.MediaStorage'
# STATIC_URL = f'https://storage.googleapis.com/{GS_BUCKET_NAME}/static/'
# MEDIA_URL = f'https://storage.googleapis.com/{GS_BUCKET_NAME}/media/'


DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


AUTH_USER_MODEL = "account.User"


# LOGGING = {
#     'version': 1,
#     'disable_existing_loggers': False,
#     'handlers': {
#         'console': {
#             'level': 'DEBUG',
#             'class': 'logging.StreamHandler',
#         },
#     },
#     'loggers': {
#         'django.db.backends': {
#             'level': 'DEBUG',
#             'handlers': ['console'],
#         },
#     },
# }


REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': ['rest_framework.renderers.JSONRenderer'],
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    "NON_FIELD_ERRORS_KEY": "error",
    "EXCEPTION_HANDLER": "drf_standardized_errors.handler.exception_handler",
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 15,
}

DRF_STANDARDIZED_ERRORS = {
    "EXCEPTION_FORMATTER_CLASS": "utils.exceptions.CustomExceptionFormatter"
}


SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(days=env.int('ACCESS_TOKEN_LIFETIME_DAYS', 1)),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=env.int('REFRESH_TOKEN_LIFETIME_DAYS', 7)),
    "SIGNING_KEY": SECRET_KEY,
    "AUTH_HEADER_TYPES": ("Bearer",),
}

# Email settings
USE_CONSOLE_EMAIL = env.bool("USE_CONSOLE_EMAIL", True)

if DEBUG:
    if USE_CONSOLE_EMAIL:
        EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
    else:
        EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
else:
    EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

EMAIL_HOST = env.str('EMAIL_HOST', '')
EMAIL_PORT = env.str('EMAIL_PORT', '')
EMAIL_HOST_USER = env.str('EMAIL_HOST_USER', '')
EMAIL_HOST_PASSWORD = env.str('EMAIL_HOST_PASSWORD', '')
EMAIL_USE_TLS = env.bool('EMAIL_USE_TLS', False)
DEFAULT_FROM_EMAIL = env.str('DEFAULT_FROM_EMAIL', 'no-reply@expense-vue.com')
