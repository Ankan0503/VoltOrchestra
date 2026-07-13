import jwt
import datetime
import os

JWT_SECRET = os.getenv("JWT_SECRET_KEY", "volt-orchestra-secret-key-jwt-super-secret")
JWT_ALGORITHM = "HS256"

def encode_jwt(payload: dict, expiry_hours: int = 24) -> str:
    data = payload.copy()
    now = datetime.datetime.now(datetime.timezone.utc)
    data.update({
        "exp": now + datetime.timedelta(hours=expiry_hours),
        "iat": now
    })
    return jwt.encode(data, JWT_SECRET, algorithm=JWT_ALGORITHM)

def decode_jwt(token: str) -> dict | None:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return None
