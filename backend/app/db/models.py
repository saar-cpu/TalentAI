from datetime import datetime

from sqlalchemy import (
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.dialects.postgresql import ARRAY, JSONB
from sqlalchemy.orm import DeclarativeBase, relationship


class Base(DeclarativeBase):
    pass


class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    headline = Column(String)
    skills = Column(ARRAY(String), default=[])
    experience_level = Column(String)
    years_of_experience = Column(Integer)
    interests = Column(ARRAY(String), default=[])
    current_role = Column(String)
    current_company = Column(String)
    location = Column(String)
    # Vector embedding stored as JSON — swap for pgvector extension in production
    skills_embedding = Column(JSONB)
    created_at = Column(DateTime, default=datetime.utcnow)

    engagements = relationship("EngagementEvent", back_populates="candidate")


class Job(Base):
    __tablename__ = "jobs"

    id = Column(String, primary_key=True)
    title = Column(String, nullable=False)
    company = Column(String, nullable=False)
    description = Column(Text)
    requirements = Column(ARRAY(String), default=[])
    benefits = Column(ARRAY(String), default=[])
    location = Column(String)
    salary_range = Column(String)
    # Vector embedding of the job description
    description_embedding = Column(JSONB)
    created_at = Column(DateTime, default=datetime.utcnow)

    engagements = relationship("EngagementEvent", back_populates="job")


class EngagementEvent(Base):
    __tablename__ = "engagement_events"

    id = Column(Integer, primary_key=True, autoincrement=True)
    candidate_id = Column(String, ForeignKey("candidates.id"), nullable=False)
    job_id = Column(String, ForeignKey("jobs.id"), nullable=False)
    event_type = Column(String, nullable=False)  # page_view | click | apply | reply
    engagement_score = Column(Float, default=0.0)
    metadata = Column(JSONB, default={})
    timestamp = Column(DateTime, default=datetime.utcnow)

    candidate = relationship("Candidate", back_populates="engagements")
    job = relationship("Job", back_populates="engagements")
