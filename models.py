from sqlalchemy import Column, Integer, String, Text
from app.database import Base


class Deal(Base):
    __tablename__ = "deals"

    id = Column(Integer, primary_key=True, index=True)
    company = Column(String, nullable=False)
    product = Column(String, nullable=False)
    value = Column(String, nullable=False)
    stage = Column(String, nullable=False)
    health = Column(String, nullable=False)
    source_text = Column(Text, nullable=True)
    intelligence_json = Column(Text, nullable=True)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)