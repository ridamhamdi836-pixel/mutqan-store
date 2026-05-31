import re
from fastapi import HTTPException, status

MIN_PHONE_DIGITS = 7
MAX_PHONE_DIGITS = 15


def _phone_digits(raw: str) -> str:
    return re.sub(r"\D", "", raw.strip().replace(" ", "").replace("-", ""))


def validate_and_normalize_saudi_phone(raw: str) -> tuple[str, str]:
    """
    Validates any phone (7–15 digits) and returns (e164, local) tuple.
    IP/geo checks enforce KSA-only ordering at checkout.
    """
    local = raw.strip().replace(" ", "").replace("-", "")
    digits = _phone_digits(raw)

    if len(digits) < MIN_PHONE_DIGITS or len(digits) > MAX_PHONE_DIGITS:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={
                "error": {
                    "code": "INVALID_PHONE",
                    "message_ar": "فضلاً أدخل رقم جوال صحيح.",
                    "message_en": "Please enter a valid phone number.",
                    "field": "phone",
                }
            },
        )

    if local.startswith("+"):
        e164 = f"+{digits}"
    elif digits.startswith("966"):
        e164 = f"+{digits}"
    elif digits.startswith("0"):
        e164 = f"+966{digits[1:]}"
    else:
        e164 = f"+966{digits}"

    return e164, local or digits
