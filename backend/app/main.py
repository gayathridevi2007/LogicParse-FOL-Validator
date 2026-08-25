from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.session import engine, Base
from app.api.routes import validator, history, examples, practice, about

# Safe initialization of database schema
try:
    Base.metadata.create_all(bind=engine)
except Exception:
    pass

app = FastAPI(
    title="LogicParse API",
    description="First-Order Logic (FOL) Expression Parser, Validator, and Analyzer Engine",
    version="1.0.0"
)

# CORS configuration for development and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(validator.router)
app.include_router(history.router)
app.include_router(examples.router)
app.include_router(practice.router)
app.include_router(about.router)

@app.get("/")
def root():
    return {
        "app": "LogicParse",
        "title": "Predicate Logic Expression Validator for First-Order Logic",
        "status": "online",
        "docs_url": "/docs"
    }

@app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "service": "LogicParse Validation Engine",
        "engine": "Recursive Descent FOL Parser"
    }
