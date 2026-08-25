import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

def get_database_url() -> str:
    env_url = os.getenv("DATABASE_URL")
    if env_url:
        return env_url
    
    # In Vercel serverless / Linux read-only root environments, use /tmp
    if os.environ.get("VERCEL") or (os.name != "nt" and os.path.exists("/tmp")):
        return "sqlite:////tmp/logicparse.db"
    
    # Local development
    return "sqlite:///./logicparse.db"

DATABASE_URL = get_database_url()

try:
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
    )
except Exception:
    # Fallback to in-memory SQLite if file cannot be created
    DATABASE_URL = "sqlite:///:memory:"
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False}
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
