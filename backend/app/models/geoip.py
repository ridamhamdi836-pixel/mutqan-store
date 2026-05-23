import uuid
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Text, func
from sqlalchemy.dialects.postgresql import UUID, INET, JSONB
from sqlalchemy.orm import relationship
from app.db.base import Base


class IpVerification(Base):
    __tablename__ = "ip_verifications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    ip_address = Column(INET, nullable=False, index=True)
    country_iso = Column(String(2))
    city = Column(String)
    is_anonymous = Column(Boolean, server_default="false")
    is_anonymous_vpn = Column(Boolean, server_default="false")
    is_hosting_provider = Column(Boolean, server_default="false")
    is_public_proxy = Column(Boolean, server_default="false")
    is_residential_proxy = Column(Boolean, server_default="false")
    is_tor_exit_node = Column(Boolean, server_default="false")
    is_suspicious = Column(Boolean, server_default="false")
    allowed = Column(Boolean, nullable=False)
    block_reason = Column(String)
    phone = Column(String)
    whitelisted = Column(Boolean, server_default="false")
    order_id = Column(UUID(as_uuid=True), ForeignKey("orders.id", ondelete="SET NULL"))
    raw_response = Column(JSONB)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False, index=True)

    order = relationship("Order")
