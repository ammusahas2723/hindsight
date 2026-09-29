from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.ai_engine import analyze_deal
from app.database import engine, Base, update_database
from app import models
from app.routes.deals import router as deals_router
from app.routes.auth import router as auth_router
from app.ingestion_models import DealSource

app = FastAPI(
    title="DealMind API",
    description="AI-powered Deal Intelligence Agent",
    version="1.0.0"
)

Base.metadata.create_all(bind=engine)
update_database()

app.include_router(deals_router)
app.include_router(auth_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class DealAnalysisRequest(BaseModel):
    deal_context: str


@app.get("/")
def root():
    return {
        "message": "DealMind API is working!"
    }


@app.get("/api/health")
def health():
    return {
        "status": "healthy"
    }


@app.post("/api/ai/analyze-deal")
def analyze_deal_endpoint(request: DealAnalysisRequest):
    result = analyze_deal(request.deal_context)

    return {
        "success": True,
        "intelligence": result
    }