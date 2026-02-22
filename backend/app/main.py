from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routes.outreach import router as outreach_router

app = FastAPI(
    title="TalentAI API",
    description="GenAI-powered recruitment marketing backend",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(outreach_router, tags=["outreach"])


@app.get("/health")
async def health():
    return {"status": "ok"}
