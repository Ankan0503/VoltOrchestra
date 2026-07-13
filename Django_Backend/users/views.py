import json
import uuid
import secrets
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.auth.hashers import make_password, check_password

from .db_client import db
from .jwt_utils import encode_jwt, decode_jwt

@csrf_exempt
@require_http_methods(["POST"])
def signup_view(request):
    try:
        data = json.loads(request.body)
        username = data.get("username")
        password = data.get("password")
        email = data.get("email", "")

        if not username or not password:
            return JsonResponse({"error": "Username and password are required."}, status=400)

        if db.users.find_one({"username": username}):
            return JsonResponse({"error": "Username already exists."}, status=400)

        hashed_password = make_password(password)
        mesh_id = f"vo-mesh-{uuid.uuid4().hex[:8]}"
        mesh_key = secrets.token_hex(8)

        user_doc = {
            "username": username,
            "password": hashed_password,
            "email": email,
            "mesh_id": mesh_id,
            "mesh_key": mesh_key,
            "is_security_locked": False,
            "esp_count": 0
        }

        db.users.insert_one(user_doc)

        token = encode_jwt({"username": username})

        return JsonResponse({
            "message": "User created and authenticated.",
            "token": token,
            "username": username,
            "mesh_id": mesh_id,
            "mesh_key": mesh_key,
            "is_security_locked": False,
            "esp_count": 0
        }, status=201)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def login_view(request):
    try:
        data = json.loads(request.body)
        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return JsonResponse({"error": "Username and password are required."}, status=400)

        user_doc = db.users.find_one({"username": username})
        if not user_doc:
            return JsonResponse({"error": "Invalid credentials."}, status=401)

        if not check_password(password, user_doc["password"]):
            return JsonResponse({"error": "Invalid credentials."}, status=401)

        token = encode_jwt({"username": username})

        return JsonResponse({
            "message": "Logged in successfully.",
            "token": token,
            "username": username,
            "mesh_id": user_doc.get("mesh_id", ""),
            "mesh_key": user_doc.get("mesh_key", ""),
            "is_security_locked": user_doc.get("is_security_locked", False),
            "esp_count": user_doc.get("esp_count", 0)
        })

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def logout_view(request):
    try:
        return JsonResponse({"message": "Logged out successfully."})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@require_http_methods(["GET"])
def me_view(request):
    try:
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return JsonResponse({"authenticated": False, "error": "Not authenticated"}, status=401)

        token = auth_header.split(" ")[1]
        payload = decode_jwt(token)
        if not payload or "username" not in payload:
            return JsonResponse({"authenticated": False, "error": "Not authenticated"}, status=401)

        username = payload["username"]

        user_doc = db.users.find_one({"username": username})
        if not user_doc:
            return JsonResponse({"authenticated": False, "error": "Not authenticated"}, status=401)

        return JsonResponse({
            "authenticated": True,
            "username": username,
            "mesh_id": user_doc.get("mesh_id", ""),
            "mesh_key": user_doc.get("mesh_key", ""),
            "is_security_locked": user_doc.get("is_security_locked", False),
            "esp_count": user_doc.get("esp_count", 0)
        })

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def delete_account_view(request):
    try:
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return JsonResponse({"error": "Not authenticated"}, status=401)

        token = auth_header.split(" ")[1]
        payload = decode_jwt(token)
        if not payload or "username" not in payload:
            return JsonResponse({"error": "Not authenticated"}, status=401)

        username = payload["username"]
        data = json.loads(request.body)
        password = data.get("password")

        if not password:
            return JsonResponse({"error": "Password is required to delete account."}, status=400)

        user_doc = db.users.find_one({"username": username})
        if not user_doc:
            return JsonResponse({"error": "User not found."}, status=404)

        if not check_password(password, user_doc["password"]):
            return JsonResponse({"error": "Incorrect password."}, status=401)

        db.users.delete_one({"username": username})

        return JsonResponse({"message": "Account deleted successfully."})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
