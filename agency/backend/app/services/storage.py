import os
import uuid

from app.core.config import settings


class StorageBackend:
    def save(self, contents: bytes, ext: str, prefix: str = "") -> str:
        raise NotImplementedError

    def delete(self, key: str) -> None:
        raise NotImplementedError

    def get_url(self, key: str) -> str:
        raise NotImplementedError


class LocalStorage(StorageBackend):
    """Disk-backed storage for local dev. Files live under settings.UPLOAD_DIR
    and are served by the /static mount in main.py."""

    def save(self, contents: bytes, ext: str, prefix: str = "") -> str:
        os.makedirs(os.path.join(settings.UPLOAD_DIR, prefix), exist_ok=True)
        key = f"{prefix}{uuid.uuid4().hex}{ext}"
        with open(os.path.join(settings.UPLOAD_DIR, key), "wb") as f:
            f.write(contents)
        return key

    def delete(self, key: str) -> None:
        path = os.path.join(settings.UPLOAD_DIR, key)
        if os.path.exists(path):
            os.remove(path)

    def get_url(self, key: str) -> str:
        return f"/static/uploads/{key}"


class R2Storage(StorageBackend):
    """Cloudflare R2 (S3-compatible) storage, served through R2_PUBLIC_BASE_URL
    (a public bucket dev URL or a custom domain fronted by Cloudflare's CDN)."""

    CONTENT_TYPES = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".webp": "image/webp",
        ".mp4": "video/mp4",
        ".mov": "video/quicktime",
        ".webm": "video/webm",
    }

    def __init__(self):
        import boto3

        self.bucket = settings.R2_BUCKET
        self.public_base_url = settings.R2_PUBLIC_BASE_URL.rstrip("/")
        self.client = boto3.client(
            "s3",
            endpoint_url=f"https://{settings.R2_ACCOUNT_ID}.r2.cloudflarestorage.com",
            aws_access_key_id=settings.R2_ACCESS_KEY_ID,
            aws_secret_access_key=settings.R2_SECRET_ACCESS_KEY,
            region_name="auto",
        )

    def save(self, contents: bytes, ext: str, prefix: str = "") -> str:
        key = f"{prefix}{uuid.uuid4().hex}{ext}"
        self.client.put_object(
            Bucket=self.bucket,
            Key=key,
            Body=contents,
            ContentType=self.CONTENT_TYPES.get(ext, "application/octet-stream"),
        )
        return key

    def delete(self, key: str) -> None:
        self.client.delete_object(Bucket=self.bucket, Key=key)

    def get_url(self, key: str) -> str:
        return f"{self.public_base_url}/{key}"


def _build_storage() -> StorageBackend:
    if settings.STORAGE_BACKEND == "r2":
        return R2Storage()
    return LocalStorage()


storage = _build_storage()
