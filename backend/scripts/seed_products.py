"""
Seed products and bundles into the database.
Run: python -m scripts.seed_products
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from app.db.session import SessionLocal
from app.models.product import Product, ProductBundle

PRODUCTS = [
    {
        "slug": "powerful-cordless-vacuum",
        "name_ar": "المكنسة اللاسلكية القوية",
        "name_en": "Powerful Cordless Vacuum",
        "short_description_ar": "تنظيف سريع وفعّال يمنح منزلك وسيارتك مظهرًا أنظف خلال دقائق.",
        "positioning": "Premium cordless cleaning solution for modern GCC homes and cars.",
        "category_slug": "cleaning-care",
        "bundles": [
            {"label_ar": "قطعة واحدة - للمنزل", "quantity": 1, "price_sar": 229, "compare_at_price_sar": None, "is_default": False, "sort_order": 1},
            {"label_ar": "قطعتين - للمنزل والسيارة | الأكثر اختيارًا", "quantity": 2, "price_sar": 399, "compare_at_price_sar": 458, "savings_label_ar": "وفر 59 ريال", "is_default": True, "sort_order": 2},
        ],
    },
    {
        "slug": "smart-stackable-cabinet",
        "name_ar": "الخزانة التراكمية الذكية",
        "name_en": "Smart Stackable Cabinet",
        "short_description_ar": "نظام تخزين فاخر يمنحك مساحة إضافية وترتيبًا أنيقًا خلال دقائق.",
        "positioning": "Modern stackable storage system designed to maximize space and organization elegantly.",
        "category_slug": "home-organization",
        "bundles": [
            {"label_ar": "قطعة واحدة - لمساحة واحدة", "quantity": 1, "price_sar": 349, "is_default": False, "sort_order": 1},
            {"label_ar": "قطعتين - لترتيب أوضح ومساحة أكبر | وفر 99 ريال", "quantity": 2, "price_sar": 599, "compare_at_price_sar": 698, "savings_label_ar": "وفر 99 ريال", "is_default": True, "sort_order": 2},
        ],
    },
    {
        "slug": "pull-out-cabinet-drawer",
        "name_ar": "درج الخزانة المنزلق",
        "name_en": "Pull-out Cabinet Drawer",
        "short_description_ar": "حل ذكي لتنظيم الخزائن المزدحمة والوصول لأغراضك بسهولة.",
        "positioning": "Premium pull-out cabinet organization system for smarter storage and easier daily access.",
        "category_slug": "home-organization",
        "bundles": [
            {"label_ar": "قطعتين - بداية الترتيب", "quantity": 2, "price_sar": 349, "is_default": False, "sort_order": 1},
            {"label_ar": "4 قطع - الأكثر اختيارًا للمطبخ", "quantity": 4, "price_sar": 599, "compare_at_price_sar": 698, "savings_label_ar": "وفر 99 ريال", "is_default": True, "sort_order": 2},
            {"label_ar": "6 قطع - أفضل قيمة للبيت", "quantity": 6, "price_sar": 799, "compare_at_price_sar": 1047, "savings_label_ar": "وفر 248 ريال", "is_default": False, "sort_order": 3},
        ],
    },
    {
        "slug": "magic-under-sink-organizer",
        "name_ar": "منظّم المغسلة السحري",
        "name_en": "Magic Under-Sink Organizer",
        "short_description_ar": "تصميم عملي يساعدك على استغلال مساحة المغسلة بشكل أكثر ترتيبًا وراحة.",
        "positioning": "Premium under-sink organization solution that transforms hidden messy spaces into clean organized storage.",
        "category_slug": "home-organization",
        "bundles": [
            {"label_ar": "قطعة واحدة - لمساحة واحدة", "quantity": 1, "price_sar": 229, "is_default": False, "sort_order": 1},
            {"label_ar": "قطعتين - للمطبخ والحمام | الأكثر اختيارًا", "quantity": 2, "price_sar": 379, "compare_at_price_sar": 458, "savings_label_ar": "وفر 79 ريال", "is_default": True, "sort_order": 2},
            {"label_ar": "3 قطع - أفضل قيمة", "quantity": 3, "price_sar": 499, "compare_at_price_sar": 687, "savings_label_ar": "وفر 188 ريال", "is_default": False, "sort_order": 3},
        ],
    },
    {
        "slug": "pure-faucet-filter",
        "name_ar": "فلتر الصنبور النقي",
        "name_en": "Pure Faucet Filter",
        "short_description_ar": "مياه أنقى وتجربة استخدام يومية أكثر راحة وأناقة للمطبخ العصري.",
        "positioning": "Modern faucet filtration system designed for cleaner everyday kitchen water experience.",
        "category_slug": "modern-kitchen",
        "bundles": [
            {"label_ar": "قطعة واحدة - للمطبخ", "quantity": 1, "price_sar": 199, "is_default": False, "sort_order": 1},
            {"label_ar": "قطعتين - أفضل قيمة | وفر أكثر", "quantity": 2, "price_sar": 249, "compare_at_price_sar": 398, "savings_label_ar": "وفر 149 ريال", "is_default": True, "sort_order": 2},
            {"label_ar": "3 قطع - للبيت بالكامل", "quantity": 3, "price_sar": 379, "compare_at_price_sar": 597, "savings_label_ar": "وفر 218 ريال", "is_default": False, "sort_order": 3},
        ],
    },
    {
        "slug": "smart-table-warmer",
        "name_ar": "سخّان المائدة الذكي",
        "name_en": "Smart Table Warmer",
        "short_description_ar": "حل عملي فاخر يحافظ على حرارة الطعام طوال الجلسة بكل أناقة.",
        "positioning": "Premium smart food warming solution for modern GCC dining and family gatherings.",
        "category_slug": "dining-hosting",
        "bundles": [
            {"label_ar": "قطعة واحدة - للجلسات اليومية", "quantity": 1, "price_sar": 249, "is_default": False, "sort_order": 1},
            {"label_ar": "قطعتين - مثالي للعائلة والضيوف | الأكثر اختيارًا", "quantity": 2, "price_sar": 449, "compare_at_price_sar": 498, "savings_label_ar": "وفر 49 ريال", "is_default": True, "sort_order": 2},
        ],
    },
    {
        "slug": "thermal-lunch-box",
        "name_ar": "حافظة الغداء الحرارية",
        "name_en": "Thermal Lunch Box",
        "short_description_ar": "تجربة عملية تمنحك وجبات دافئة وجاهزة أينما كنت بسهولة وراحة.",
        "positioning": "Smart thermal lunch solution for warm meals anywhere during work, travel, or daily routines.",
        "category_slug": "dining-hosting",
        "bundles": [
            {"label_ar": "قطعة واحدة - للاستخدام اليومي", "quantity": 1, "price_sar": 229, "is_default": False, "sort_order": 1},
            {"label_ar": "قطعتين - أفضل قيمة للعائلة | وفر 129 ريال", "quantity": 2, "price_sar": 329, "compare_at_price_sar": 458, "savings_label_ar": "وفر 129 ريال", "is_default": True, "sort_order": 2},
        ],
    },
]


def seed():
    db = SessionLocal()
    try:
        for product_data in PRODUCTS:
            existing = db.query(Product).filter(Product.slug == product_data["slug"]).first()
            if existing:
                print(f"Skipping {product_data['slug']} (already exists)")
                continue

            product = Product(
                slug=product_data["slug"],
                name_ar=product_data["name_ar"],
                name_en=product_data.get("name_en"),
                short_description_ar=product_data["short_description_ar"],
                positioning=product_data.get("positioning"),
                category_slug=product_data["category_slug"],
            )
            db.add(product)
            db.flush()

            for bundle_data in product_data.get("bundles", []):
                bundle = ProductBundle(
                    product_id=product.id,
                    label_ar=bundle_data["label_ar"],
                    quantity=bundle_data["quantity"],
                    price_sar=bundle_data["price_sar"],
                    compare_at_price_sar=bundle_data.get("compare_at_price_sar"),
                    savings_label_ar=bundle_data.get("savings_label_ar"),
                    is_default=bundle_data.get("is_default", False),
                    sort_order=bundle_data.get("sort_order", 0),
                )
                db.add(bundle)

            print(f"Seeded: {product_data['name_ar']}")

        db.commit()
        print("Seeding complete.")
    except Exception as e:
        db.rollback()
        print(f"Error: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
