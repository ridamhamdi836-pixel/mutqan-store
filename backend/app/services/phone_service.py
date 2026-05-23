import re
from fastapi import HTTPException, status


SAUDI_MOBILE_REGEX = re.compile(r"^(\+?966|0)?5\d{8}$")


def validate_and_normalize_saudi_phone(raw: str) -> tuple[str, str]:
    """
    Validates a Saudi mobile number and returns (e164, local) tuple.
    Raises HTTPException with Arabic error message on invalid input.
    """
    phone = raw.strip().replace(" ", "").replace("-", "")

    if not SAUDI_MOBILE_REGEX.match(phone):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={
                "error": {
                    "code": "INVALID_SAUDI_PHONE",
                    "message_ar": "فضلاً أدخل رقم جوال سعودي صحيح يبدأ بـ 05.",
                    "message_en": "Please enter a valid Saudi mobile number starting with 05.",
                    "field": "phone",
                }
            },
        )

    # Normalize to digits-only of the local part starting with 5
    digits = re.sub(r"\D", "", phone)
    if digits.startswith("966"):
        local_digits = digits[3:]  # remove country code
    elif digits.startswith("0"):
        local_digits = digits[1:]
    else:
        local_digits = digits

    if not local_digits.startswith("5") or len(local_digits) != 9:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={
                "error": {
                    "code": "INVALID_SAUDI_PHONE",
                    "message_ar": "فضلاً أدخل رقم جوال سعودي صحيح يبدأ بـ 05.",
                    "message_en": "Please enter a valid Saudi mobile number starting with 05.",
                    "field": "phone",
                }
            },
        )

    e164 = f"+966{local_digits}"
    local = f"0{local_digits}"
    return e164, local
