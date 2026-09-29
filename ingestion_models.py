from sqlalchemy import Column, Integer, String, Text
from app.database import Base


class DealSource(Base):
    __tablename__ = "deal_sources"

    id = Column(Integer, primary_key=True, index=True)

    deal_id = Column(Integer, nullable=False, index=True)

    source_type = Column(String, nullable=False)
    # email / meeting / document / crm

    title = Column(String, nullable=True)

    content = Column(Text, nullable=False)

    created_at = Column(
        String,
        nullable=False
    )