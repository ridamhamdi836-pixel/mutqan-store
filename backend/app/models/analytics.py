import uuid
from sqlalchemy import Column, String, Integer, ForeignKey, DateTime, Text, func
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.db.base import Base


class AnalyticsEvent(Base):
    __tablename__ = "analytics_events"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    event_id = Column(String, nullable=False, unique=True)
    order_id = Column(UUID(as_uuid=True), ForeignKey("orders.id"))
    platform = Column(String, nullable=False)
    event_name = Column(String, nullable=False, index=True)
    payload = Column(JSONB)
    sent_at = Column(DateTime(timezone=True))
    status = Column(String, nullable=False, default="pending")
    error_message = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False, index=True)

    order = relationship("Order", back_populates="analytics_events")


class WebhookDelivery(Base):
    __tablename__ = "webhook_deliveries"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id = Column(UUID(as_uuid=True), ForeignKey("orders.id", ondelete="CASCADE"), index=True)
    destination = Column(String, nullable=False)
    event_type = Column(String, nullable=False)
    payload = Column(JSONB, nullable=False)
    status = Column(String, nullable=False, default="pending", index=True)
    attempts = Column(Integer, nullable=False, default=0)
    last_attempt_at = Column(DateTime(timezone=True))
    next_retry_at = Column(DateTime(timezone=True), index=True)
    response_status = Column(Integer)
    response_body = Column(Text)
    error_message = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    order = relationship("Order", back_populates="webhook_deliveries")
