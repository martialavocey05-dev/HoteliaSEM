"""
HoteliaSEM Flask Configuration
Manages environment-specific settings for authentication and database
"""
import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()


class Config:
    """Base configuration with secure defaults"""
    
    # Application
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'hsem-dev-secret-key-change-in-production'
    ENV = os.environ.get('FLASK_ENV', 'development')
    DEBUG = ENV == 'development'
    
    # Database Configuration (SQL Server for HoteliaSEM)
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'mssql+pyodbc://username:password@localhost/HoteliaSEM?driver=ODBC+Driver+18+for+SQL+Server'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = DEBUG
    
    # JWT Configuration
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or SECRET_KEY
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    JWT_TOKEN_LOCATION = ['headers', 'cookies']
    JWT_COOKIE_SECURE = ENV == 'production'
    JWT_COOKIE_CSRF_PROTECT = ENV == 'production'
    JWT_ACCESS_COOKIE_NAME = 'access_token_cookie'
    JWT_REFRESH_COOKIE_NAME = 'refresh_token_cookie'
    
    # Security Headers
    SESSION_COOKIE_SECURE = ENV == 'production'
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'
    PERMANENT_SESSION_LIFETIME = timedelta(days=31)
    
    # CORS Settings
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', 'http://localhost:3000').split(',')
    CORS_SUPPORTS_CREDENTIALS = True
    
    # Password Policy
    MIN_PASSWORD_LENGTH = 8
    MAX_PASSWORD_LENGTH = 128
    REQUIRE_SPECIAL_CHAR = True
    REQUIRE_UPPERCASE = True
    REQUIRE_LOWERCASE = True
    REQUIRE_DIGIT = True
    
    # Rate Limiting
    RATELIMIT_ENABLED = True
    MAX_LOGIN_ATTEMPTS = 5
    LOCKOUT_DURATION = timedelta(minutes=15)
    
    # File Upload (for media/avatars)
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB
    UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'glb', 'mp4'}
    
    # Audit Logging
    ENABLE_AUDIT_LOG = True
    

class DevelopmentConfig(Config):
    """Development-specific configuration"""
    DEBUG = True
    SQLALCHEMY_ECHO = True


class ProductionConfig(Config):
    """Production-specific configuration"""
    DEBUG = False
    SQLALCHEMY_ECHO = False
    JWT_COOKIE_SECURE = True
    JWT_COOKIE_CSRF_PROTECT = True
    SESSION_COOKIE_SECURE = True


class TestingConfig(Config):
    """Testing-specific configuration"""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=5)


# Configuration dictionary
config_dict = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}
