from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
from routes.lessons import router as lesson_router
from routes.translation import router as translation_router
from routes.analytics import router as analytics_router
from routes.offline import router as offline_router

app = FastAPI(title="PALASH MITRA API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
Base.metadata.create_all(bind=engine)
app.include_router(lesson_router)
app.include_router(translation_router)
app.include_router(analytics_router)
app.include_router(offline_router)

@app.get("/")
def root():
    return {
        "message": "PALASH MITRA backend is running"
    }