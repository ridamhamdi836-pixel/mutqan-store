import uuid
from sqlalchemy import Column, String, Boolean, Integer, ForeignKey, DateTime, Text, func
from sqlalchemy.dialects.postgresql import UUID, INET, JSONB
from sqlalchemy.orm import relationship
from app.db.base import Base


class Customer(Base):
    __tablename__ = "customers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    full_name = Column(String, nullable=False)
    phone_e164 = Column(String, nullable=False, index=True)
    phone_local = Column(String)
    city = Column(String)
    address = Column(Text)
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    orders = relationship("Order", back_populates="customer")


class Order(Base):
    __tablename__ = "orders"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    public_order_number = Column(String, nullable=False, unique=True, index=True)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customers.id"), nullable=False, index=True)
    status = Column(String, nullable=False, default="placed")
    payment_method = Column(String, nullable=False, default="cod")
    payment_status = Column(String, nullable=False, default="pending_cod")
    subtotal_sar = Column(Integer, nullable=False)
    discount_sar = Column(Integer, nullable=False, default=0)
    shipping_sar = Column(Integer, nullable=False, default=0)
    total_sar = Column(Integer, nullable=False)
    currency = Column(String, nullable=False, default="SAR")
    source_channel = Column(String)
    landing_page = Column(Text)
    referrer = Column(Text)
    utm_source = Column(String)
    utm_medium = Column(String)
    utm_campaign = Column(String)
    utm_content = Column(String)
    utm_term = Column(String)
    client_event_id = Column(String)
    meta_fbp = Column(String)
    meta_fbc = Column(String)
    tiktok_click_id = Column(String)
    snapchat_click_id = Column(String)
    user_agent = Column(Text)
    ip_address = Column(INET)
    geo_country = Column(String(2))
    geo_is_vpn = Column(Boolean, server_default="false")
    geo_is_proxy = Column(Boolean, server_default="false")
    geo_is_suspicious = Column(Boolean, server_default="false")
    geo_blocked = Column(Boolean, server_default="false")
    geo_block_reason = Column(String)
    confirmation_status = Column(String)
    confirmed_at = Column(DateTime(timezone=True))
    cancelled_at = Column(DateTime(timezone=True))
    delivered_at = Column(DateTime(timezone=True))
    internal_notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False, index=True)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    customer = relationship("Customer", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    upsell_events = relationship("UpsellEvent", back_populates="order", cascade="all, delete-orphan")
    status_history = relationship("OrderStatusHistory", back_populates="order", cascade="all, delete-orphan")
    webhook_deliveries = relationship("WebhookDelivery", back_populates="order", cascade="all, delete-orphan")
    analytics_events = relationship("AnalyticsEvent", back_populates="order")


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id = Column(UUID(as_uuid=True), ForeignKey("orders.id", ondelete="CASCADE"), nullable=False, index=True)
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id"), nullable=False)
    product_bundle_id = Column(UUID(as_uuid=True), ForeignKey("product_bundles.id"))
    product_slug = Column(String, nullable=False)
    name_ar = Column(String, nullable=False)
    quantity = Column(Integer, nullable=False)
    unit_price_sar = Column(Integer, nullable=False)
    total_price_sar = Column(Integer, nullable=False)
    item_type = Column(String, nullable=False, default="main")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    order = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="order_items")
    bundle = relationship("ProductBundle", back_populates="order_items")


class UpsellEvent(Base):
    __tablename__ = "upsell_events"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id = Column(UUID(as_uuid=True), ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    upsell_product_id = Column(UUID(as_uuid=True), ForeignKey("products.id"), nullable=False)
    offer_id = Column(String, nullable=False)
    offered_price_sar = Column(Integer, nullable=False)
    status = Column(String, nullable=False, default="viewed")
    viewed_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    responded_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    order = relationship("Order", back_populates="upsell_events")
    upsell_product = relationship("Product")


class OrderStatusHistory(Base):
    __tablename__ = "order_status_history"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id = Column(UUID(as_uuid=True), ForeignKey("orders.id", ondelete="CASCADE"), nullable=False, index=True)
    from_status = Column(String)
    to_status = Column(String, nullable=False)
    note = Column(Text)
    changed_by = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    order = relationship("Order", back_populates="status_history")
