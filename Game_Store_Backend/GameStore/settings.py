"""
Django settings for GameStore project.

Generated by 'django-admin startproject' using Django 4.2.1.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.2/ref/settings/
"""

from pathlib import Path
from datetime import timedelta
import cloudinary
import cloudinary.uploader
import cloudinary.api
import os

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent
MEDIA_ROOT = os.path.join(BASE_DIR , 'media')
MEDIA_URL = ''

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-dxlu-b(=_mido_z*+xcn=+0_s&=%ifdbbvmcf3t4y1(kqcd#30'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['192.168.1.30','192.168.1.5','127.0.0.1','192.168.1.6','192.168.1.3','192.168.1.14', '192.168.1.37','192.168.1.6','172.26.176.1','192.168.1.4','192.168.1.38', '192.168.1.10', '192.168.1.24', '192.168.1.3',
                 '192.168.1.7', '1b14-2405-4802-3c48-1d60-495b-115c-bc6e-797a.ngrok-free.app']


# Application definition

INSTALLED_APPS = [
    'home',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    #3rd party
    "rest_framework",
    "rest_framework_simplejwt",
    "algoliasearch_django",

    "product",
    "cart",
    "account",
    "cloudinary",
    "corsheaders",
]


MIDDLEWARE = [
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.LimitOffsetPagination',
}

SIMPLE_JWT = {
    'ROTATE_REFRESH_TOKENS': True,
}
CORS_ORIGIN_WHITELIST = (
    "http://192.168.1.4:3000",
)
CSRF_TRUSTED_ORIGINS = ['http://192.168.1.4:3000']
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    'https://1b14-2405-4802-3c48-1d60-495b-115c-bc6e-797a.ngrok-free.app'
]

ROOT_URLCONF = 'GameStore.urls'

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

WSGI_APPLICATION = 'GameStore.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

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


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = 'static/'

STATICFILES_DIRS = [
    BASE_DIR / "static",
]

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

cloudinary.config( 
  cloud_name = "dfo61m8dy", 
  api_key = "367537239722855", 
  api_secret = "fIAOgXw4ofp9xnrIdouNtcP4qvg" 
)

DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'

ALGOLIA = {
    'APPLICATION_ID': 'CBCBPTMVM7',
    'API_KEY': '04a1a1b4639f61d65975d70e215f429d',
    'INDEX_PREFIX': 'long'
}

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = "smtp.gmail.com"
EMAIL_USE_TLS = True
EMAIL_PORT = 587
EMAIL_HOST_USER = "thanhlongh124@gmail.com"
EMAIL_HOST_PASSWORD = "swhh jcpw lnvr ixio"
EMAIL_USE_TLS = True
EMAIL_USE_SSL = False


