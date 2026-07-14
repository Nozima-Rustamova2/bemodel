from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin
from app.db.database import get_db
from app.models.model import ScoutingSubmission, AdminUser
from app.schemas.scouting import ScoutingSubmissionOut, ScoutingStatusUpdate
from app.services.serializers import scouting_to_out
from app.services.storage import storage

router = APIRouter(prefix="/api/admin/scouting", tags=["admin-scouting"])

VALID_STATUSES = {"new", "reviewed", "archived"}


@router.get("", response_model=list[ScoutingSubmissionOut])
def list_submissions(
    status: str | None = None,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
):
    query = db.query(ScoutingSubmission)
    if status:
        query = query.filter(ScoutingSubmission.status == status)
    submissions = query.order_by(ScoutingSubmission.created_at.desc()).all()
    return [scouting_to_out(s) for s in submissions]


@router.get("/{submission_id}", response_model=ScoutingSubmissionOut)
def get_submission(
    submission_id: int,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
):
    submission = db.query(ScoutingSubmission).filter(ScoutingSubmission.id == submission_id).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    return scouting_to_out(submission)


@router.put("/{submission_id}/status", response_model=ScoutingSubmissionOut)
def update_status(
    submission_id: int,
    payload: ScoutingStatusUpdate,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
):
    if payload.status not in VALID_STATUSES:
        raise HTTPException(
            status_code=400, detail=f"Invalid status. Must be one of {sorted(VALID_STATUSES)}"
        )
    submission = db.query(ScoutingSubmission).filter(ScoutingSubmission.id == submission_id).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    submission.status = payload.status
    db.commit()
    db.refresh(submission)
    return scouting_to_out(submission)


@router.delete("/{submission_id}")
def delete_submission(
    submission_id: int,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
):
    submission = db.query(ScoutingSubmission).filter(ScoutingSubmission.id == submission_id).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    for key in submission.submitted_photo_keys or []:
        storage.delete(key)
    db.delete(submission)
    db.commit()
    return {"detail": "Submission deleted"}
