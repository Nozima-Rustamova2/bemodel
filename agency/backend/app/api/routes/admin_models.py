from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin
from app.core.utils import slugify
from app.db.database import get_db
from app.models.model import Model, AdminUser
from app.schemas.model import ModelCreate, ModelUpdate, ModelOut
from app.services.serializers import model_to_out

router = APIRouter(prefix="/api/admin/models", tags=["admin-models"])


def _unique_slug(db: Session, name: str, exclude_id: int | None = None) -> str:
    base = slugify(name)
    slug = base
    i = 1
    while True:
        query = db.query(Model).filter(Model.slug == slug)
        if exclude_id:
            query = query.filter(Model.id != exclude_id)
        if not query.first():
            return slug
        i += 1
        slug = f"{base}-{i}"


@router.get("", response_model=list[ModelOut])
def list_all_models(
    db: Session = Depends(get_db), current_admin: AdminUser = Depends(get_current_admin)
):
    """List every model, published or not, for the admin dashboard."""
    models = db.query(Model).order_by(Model.sort_order, Model.name).all()
    return [model_to_out(m) for m in models]


@router.get("/{model_id}", response_model=ModelOut)
def get_model(
    model_id: int,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
):
    m = db.query(Model).filter(Model.id == model_id).first()
    if not m:
        raise HTTPException(status_code=404, detail="Model not found")
    return model_to_out(m)


@router.post("", response_model=ModelOut)
def create_model(
    payload: ModelCreate,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
):
    slug = _unique_slug(db, payload.name)
    model = Model(slug=slug, **payload.model_dump())
    db.add(model)
    db.commit()
    db.refresh(model)
    return model_to_out(model)


@router.put("/{model_id}", response_model=ModelOut)
def update_model(
    model_id: int,
    payload: ModelUpdate,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
):
    model = db.query(Model).filter(Model.id == model_id).first()
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")

    data = payload.model_dump(exclude_unset=True)
    if "name" in data and data["name"] != model.name:
        model.slug = _unique_slug(db, data["name"], exclude_id=model.id)

    for field, value in data.items():
        setattr(model, field, value)

    db.commit()
    db.refresh(model)
    return model_to_out(model)


@router.delete("/{model_id}")
def delete_model(
    model_id: int,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
):
    model = db.query(Model).filter(Model.id == model_id).first()
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")
    db.delete(model)
    db.commit()
    return {"detail": "Model deleted"}
