from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.product import Product
from app.schemas.product import ProductsListOut, ProductOut

router = APIRouter()


@router.get("/products", response_model=ProductsListOut)
def list_products(db: Session = Depends(get_db)):
    products = db.query(Product).filter(Product.is_active == True).order_by(Product.created_at).all()
    return {"products": products}


@router.get("/products/{slug}", response_model=ProductOut)
def get_product(slug: str, db: Session = Depends(get_db)):
    from fastapi import HTTPException
    product = db.query(Product).filter(Product.slug == slug, Product.is_active == True).first()
    if not product:
        raise HTTPException(status_code=404, detail={"error": {"code": "PRODUCT_NOT_FOUND", "message_ar": "المنتج غير موجود."}})
    return product
