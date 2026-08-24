import os
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "LogicParse"
    API_V1_STR: str = "/api"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./logicparse.db")

settings = Settings()
