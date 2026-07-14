import os
import subprocess
import tempfile


def extract_poster(video_bytes: bytes, video_ext: str) -> bytes | None:
    """Grab the first frame of a video as a JPEG poster via ffmpeg.
    Returns None (no poster) if ffmpeg isn't available or extraction fails —
    callers can still let the admin add a poster manually later."""
    in_path = out_path = None
    try:
        with tempfile.NamedTemporaryFile(suffix=video_ext, delete=False) as in_file:
            in_file.write(video_bytes)
            in_path = in_file.name
        out_path = in_path + ".poster.jpg"
        subprocess.run(
            ["ffmpeg", "-y", "-i", in_path, "-frames:v", "1", "-q:v", "2", out_path],
            capture_output=True,
            timeout=30,
            check=True,
        )
        with open(out_path, "rb") as f:
            return f.read()
    except Exception:
        return None
    finally:
        for p in (in_path, out_path):
            if p and os.path.exists(p):
                os.remove(p)
