from django.urls import path, include
from rest_framework import routers
from .views import UserViewSet, PostViewSet, ReactionViewSet, TokenCheck, CommentViewSet, FollowViewSet

router = routers.DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'post', PostViewSet, basename='post')
router.register(r'reaction', ReactionViewSet, basename='reaction')
router.register(r'comment', CommentViewSet, basename='comment')
router.register(r'follow', FollowViewSet, basename='follow')

urlpatterns = [
    path('', include(router.urls)),
    path('token/check', TokenCheck.as_view())
]