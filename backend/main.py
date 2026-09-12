from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
from routes.lessons import router as lesson_router

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
@app.get("/")
def root():
    return {
        "message": "PALASH MITRA backend is running"
    }