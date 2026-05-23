import uuid
from sqlalchemy import Column, String, Boolean, Integer, ForeignKey, DateTime, func, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.base import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    slug = Column(String, nullable=False, unique=True)
    sku = Column(String, nullable=True)
    name_ar = Column(String, nullable=False)
    name_en = Column(String)
    short_description_ar = Column(Text, nullable=False)
    positioning = Column(Text)
    category_slug = Column(String, nullable=False)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    bundles = relationship("ProductBundle", back_populates="product", lazy="selectin")
    order_items = relationship("OrderItem", back_populates="product")


class ProductBundle(Base):
    __tablename__ = "product_bundles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id"), nullable=False)
    label_ar = Column(String, nullable=False)
    quantity = Column(Integer, nullable=False)
    price_sar = Column(Integer, nullable=False)
    compare_at_price_sar = Column(Integer)
    savings_label_ar = Column(String)
    is_default = Column(Boolean, nullable=False, default=False)
    sort_order = Column(Integer, nullable=False, default=0)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    product = relationship("Product", back_populates="bundles")
    order_items = relationship("OrderItem", back_populates="bundle")
