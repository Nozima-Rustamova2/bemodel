import html

import httpx

from app.core.config import settings

API_BASE = "https://api.telegram.org"


def _escape(text: str) -> str:
    return html.escape(text)


def _format_message(fields: dict, admin_url: str) -> str:
    title = "New contact message" if fields.get("source") == "contact" else "New model application"
    lines = [f"<b>{title}</b>", f"<b>Name:</b> {_escape(fields['name'])}"]
    lines.append(f"<b>Email:</b> {_escape(fields['email'])}")
    for label, key in (
        ("Phone", "phone"),
        ("City", "city"),
        ("DOB", "birthdate"),
        ("Height", "height"),
        ("Instagram", "instagram"),
        ("Message", "message"),
    ):
        if fields.get(key):
            lines.append(f"<b>{label}:</b> {_escape(fields[key])}")
    lines.append(f'\n<a href="{admin_url}">View in admin panel →</a>')
    return "\n".join(lines)


def notify_new_scouting_submission(fields: dict, photo_urls: list[str], admin_url: str) -> None:
    """Best-effort Telegram notification for a new scouting/"Become a Model"
    submission. Silently no-ops if Telegram isn't configured, and never raises
    — a failed/slow Telegram call must never affect the actual submission.
    `fields` is a plain dict (not the ORM row) so this has no dependency on the
    request's DB session still being open when the background task runs."""
    if not settings.TELEGRAM_BOT_TOKEN or not settings.TELEGRAM_CHAT_ID:
        return

    text = _format_message(fields, admin_url)
    base_url = f"{API_BASE}/bot{settings.TELEGRAM_BOT_TOKEN}"

    try:
        with httpx.Client(timeout=10) as client:
            if not photo_urls:
                client.post(
                    f"{base_url}/sendMessage",
                    json={
                        "chat_id": settings.TELEGRAM_CHAT_ID,
                        "text": text,
                        "parse_mode": "HTML",
                    },
                )
            elif len(photo_urls) == 1:
                client.post(
                    f"{base_url}/sendPhoto",
                    json={
                        "chat_id": settings.TELEGRAM_CHAT_ID,
                        "photo": photo_urls[0],
                        "caption": text,
                        "parse_mode": "HTML",
                    },
                )
            else:
                media = [
                    {
                        "type": "photo",
                        "media": url,
                        **({"caption": text, "parse_mode": "HTML"} if i == 0 else {}),
                    }
                    for i, url in enumerate(photo_urls[:10])
                ]
                client.post(
                    f"{base_url}/sendMediaGroup",
                    json={"chat_id": settings.TELEGRAM_CHAT_ID, "media": media},
                )
    except httpx.HTTPError as e:
        print(f"Telegram notification failed: {e}")
