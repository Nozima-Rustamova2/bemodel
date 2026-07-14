import os

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin
from app.db.database import get_db
from app.models.model import Model, Video, AdminUser
from app.schemas.video import VideoOut, ReorderVideos
from app.services.storage import storage
from app.services.video_processing import extract_poster

router = APIRouter(prefix="/api/admin/models/{model_id}/videos", tags=["admin-videos"])

ALLOWED_EXTENSIONS = {".mp4", ".mov", ".webm"}
MAX_FILE_SIZE_MB = 100


def _video_to_out(v: Video) -> VideoOut:
    return VideoOut(
        id=v.id,
        caption=v.caption,
        url=storage.get_url(v.object_key),
        poster_url=storage.get_url(v.poster_key) if v.poster_key else None,
        is_published=v.is_published,
        sort_order=v.sort_order,
    )


@router.post("", response_model=list[VideoOut])
def upload_videos(
    model_id: int,
    files: list[UploadFile] = File(...),
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
):
    """Upload one or more video clips for a given model."""
    model = db.query(Model).filter(Model.id == model_id).first()
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")

    max_order = max([v.sort_order for v in model.videos], default=-1)
    created = []
    for i, upload in enumerate(files):
        ext = os.path.splitext(upload.filename or "")[1].lower()
        if ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file type '{ext}'. Allowed: {', '.join(ALLOWED_EXTENSIONS)}",
            )

        contents = upload.file.read()
        size_mb = len(contents) / (1024 * 1024)
        if size_mb > MAX_FILE_SIZE_MB:
            raise HTTPException(
                status_code=400, detail=f"File too large ({size_mb:.1f}MB). Max is {MAX_FILE_SIZE_MB}MB."
            )

        object_key = storage.save(contents, ext, prefix="videos/")

        poster_key = None
        poster_bytes = extract_poster(contents, ext)
        if poster_bytes:
            poster_key = storage.save(poster_bytes, ".jpg", prefix="videos/posters/")

        video = Video(
            model_id=model.id,
            object_key=object_key,
            poster_key=poster_key,
            sort_order=max_order + 1 + i,
        )
        db.add(video)
        model.videos.append(video)
        created.append(video)

    db.commit()
    for v in created:
        db.refresh(v)

    return [_video_to_out(v) for v in created]


@router.delete("/{video_id}")
def delete_video(
    model_id: int,
    video_id: int,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
):
    video = db.query(Video).filter(Video.id == video_id, Video.model_id == model_id).first()
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")

    storage.delete(video.object_key)
    if video.poster_key:
        storage.delete(video.poster_key)

    db.delete(video)
    db.commit()
    return {"detail": "Video deleted"}


@router.post("/reorder")
def reorder_videos(
    model_id: int,
    payload: ReorderVideos,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
):
    videos = {v.id: v for v in db.query(Video).filter(Video.model_id == model_id).all()}
    for index, video_id in enumerate(payload.video_ids_in_order):
        if video_id in videos:
            videos[video_id].sort_order = index
    db.commit()
    return {"detail": "Order updated"}
