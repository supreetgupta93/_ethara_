import json
import os
from functools import lru_cache
from pydantic import field_validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Database
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/inventory"
    
    # Application
    APP_NAME: str = "Inventory & Order Management API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    # CORS
    CORS_ORIGINS: list[str] = ["*"]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, value):
        if isinstance(value, str):
            value = value.strip()
            if value == "*":
                return ["*"]
            try:
                parsed = json.loads(value)
                if isinstance(parsed, str):
                    return [parsed]
                return parsed
            except ValueError:
                return [origin.strip() for origin in value.split(",") if origin.strip()]
        if value is None:
            return ["*"]
        return value
    
    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
