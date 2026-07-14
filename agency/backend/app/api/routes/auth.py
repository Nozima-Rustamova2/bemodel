from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin
from app.core.security import create_access_token, verify_password, hash_password
from app.db.database import get_db
from app.models.model import AdminUser
from app.schemas.auth import TokenResponse, ChangePasswordRequest

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """
    Standard OAuth2 password flow login. The frontend sends
    email as 'username' and the password, form-encoded.
    """
    admin = db.query(AdminUser).filter(AdminUser.email == form_data.username).first()
    if not admin or not verify_password(form_data.password, admin.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    token = create_access_token(subject=admin.email)
    return TokenResponse(access_token=token)


@router.get("/me")
def read_me(current_admin: AdminUser = Depends(get_current_admin)):
    return {"id": current_admin.id, "email": current_admin.email}


@router.post("/change-password")
def change_password(
    payload: ChangePasswordRequest,
    current_admin: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    if not verify_password(payload.current_password, current_admin.hashed_password):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    current_admin.hashed_password = hash_password(payload.new_password)
    db.commit()
    return {"detail": "Password updated"}
