from django.urls import path
from .views import signup_view, login_view, logout_view, me_view, delete_account_view

urlpatterns = [
    path('signup/', signup_view, name='signup'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('me/', me_view, name='me'),
    path('delete/', delete_account_view, name='delete_account'),
]
