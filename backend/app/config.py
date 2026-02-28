from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    anthropic_api_key: str = ""
    database_url: str = "postgresql+asyncpg://postgres:password@localhost:5432/talentai"
    crm_api_url: str = "https://lead-management-umber.vercel.app/api/leads"
    supabase_url: str = ""
    supabase_key: str = ""
    cors_origins: list[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:3003",
        "https://lead-management-umber.vercel.app",
    ]

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
