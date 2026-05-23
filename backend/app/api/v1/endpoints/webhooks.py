from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.workers.retry_webhooks import retry_failed_webhooks
from app.core.security import verify_admin_key

router = APIRouter()


@router.post("/webhooks/retry", dependencies=[Depends(verify_admin_key)])
async def retry_webhooks(db: Session = Depends(get_db)):
    queued = await retry_failed_webhooks(db)
    return {"queued": queued}
