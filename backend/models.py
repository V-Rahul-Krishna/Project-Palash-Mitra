from sqlalchemy import Column, Integer, String, Text
from database import Base


class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    grade = Column(String)
    subject = Column(String)
    topic = Column(String)
    outcome = Column(Text)
    teaching_language = Column(String)
    classroom_language = Column(String)