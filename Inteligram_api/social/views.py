from rest_framework import viewsets, permissions, status
from rest_framework.generics import get_object_or_404

from rest_framework.pagination import PageNumberPagination
from rest_framework.mixins import (
    CreateModelMixin,
    DestroyModelMixin,
    RetrieveModelMixin,
    ListModelMixin,
)
from .models import User, Post, Reaction, Follow, Comment
from .serializers import (
    UserSerializer,
    MinimalUserInfoSerializer,
    PostSerializer,
    ReactionsSerializer,
    PasswordResetSerializer,
    UserDetailsSerializer,
    CreatePostSerializer,
    EditPostSerializer,
    AddReactionSerializer,
    UserRegisterSerializer,
    FollowSerializer,
    FollowerUserSerializer,
    FollowingUserSerializer,
    CommentSerializer,
    AddCommentSerializer
)
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .permissions import IsOwner
from rest_framework.views import APIView
from .helper import SOCIALMEDIAALGO

# Create your views here.

class UserViewSet(viewsets.GenericViewSet, DestroyModelMixin):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=["post"], serializer_class=UserRegisterSerializer)
    def Register(self, request):

        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()
        return Response(
            {"details": "User Registeration was successfull"}, status=status.HTTP_200_OK
        )

    @action(detail=True, methods=["put"], serializer_class=PasswordResetSerializer)
    def ForgetPassword(self, request, pk=None):
        user = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        old_password = serializer.validated_data["old_password"]
        new_password = serializer.validated_data["new_password"]

        if not user.check_password(old_password):
            return Response(
                {"error": "Old password is incorrect."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(new_password)
        user.save()

        return Response(
            {"details": "Password reset was successful"}, status=status.HTTP_200_OK
        )

    @action(detail=False, methods=["get"], serializer_class=MinimalUserInfoSerializer, url_path=r'get/(?P<username>[\w.@+-]+)', pagination_class=None)
    def get_user_details(self, request, username=None):
        user = get_object_or_404(User, username=username)
        serializer = self.get_serializer(user)
        
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=["get"], serializer_class=MinimalUserInfoSerializer, url_path=r'get/current', pagination_class=None, permission_classes=[permissions.IsAuthenticated])
    def current_user_details(self, request):
        serializer = self.get_serializer(request.user)
        
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["patch"], serializer_class=UserDetailsSerializer)
    def UpdateUserDetails(self, request, pk=None):
        user = self.get_object()

        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user.username = serializer.validated_data["username"]
        user.age = serializer.validated_data["age"]
        user.gender = serializer.validated_data["gender"]
        user.save()

        return Response(
            {"details": "User details have been saved successfully"},
            status=status.HTTP_200_OK,
        )

    @action(detail=True, methods=["get"], serializer_class=FollowerUserSerializer)
    def followers(self, request, pk=None):
        user = self.get_object()
        # the users who follow this person
        paginator = self.paginator
        followers_list = Follow.objects.filter(followed_user=user)
        page = paginator.paginate_queryset(followers_list, request)

        if page is not None:
            serializer = FollowerUserSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = FollowerUserSerializer(followers_list, many=True).data

        return Response(serializer, status=status.HTTP_200_OK)

    @action(detail=True, methods=["get"], serializer_class=FollowingUserSerializer)
    def following(self, request, pk=None):
        user = self.get_object()
        # the users who this person follows
        followings_list = Follow.objects.filter(follower_user=user)
        paginator = self.paginator
        page = paginator.paginate_queryset(followings_list, request)

        if page is not None:
            serializer = FollowingUserSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)

        serializer = FollowingUserSerializer(followings_list, many=True).data

        return Response(serializer, status=status.HTTP_200_OK)

    @action(
        detail=False,
        methods=["get"],
        serializer_class=FollowSerializer,
        url_path=r"stats/follow/(?P<username>[\w.@+-]+)",
    )
    def follow_stats(self, request, username=None):

        following_count = Follow.objects.filter(follower_user__username=username).count()
        followed_count = Follow.objects.filter(followed_user__username=username).count()

        return Response(
            {"following_count": following_count, "followed_count": followed_count},
            status=status.HTTP_200_OK,
        )


class PostViewSet(viewsets.GenericViewSet, DestroyModelMixin):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(
        detail=False,
        methods=["post"],
        serializer_class=CreatePostSerializer,
        parser_classes=[MultiPartParser, FormParser],
    )
    def CreatePost(self, request):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        text = serializer.validated_data.get("text")
        image = serializer.validated_data.get("attachment")

        post = Post(user=user, text=text, attachment=image)
        post.save()

        return Response(
            {"detail": "Post created successfully!"}, status=status.HTTP_200_OK
        )

    @action(
        detail=True,
        methods=["put"],
        serializer_class=EditPostSerializer,
        parser_classes=[MultiPartParser, FormParser],
    )
    def EditPost(self, request, pk=None):
        post = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        text = serializer.validated_data.get("text")
        attachment = serializer.validated_data.get("attachment")

        if text is not None:
            post.text = text
        if attachment is not None:
            post.attachment = attachment

        post.save()

        return Response(
            {"details": "Post was edited successfully!"}, status=status.HTTP_200_OK
        )

    @action(detail=True, methods=["get"])
    def GetPostStats(self, request, pk=None):
        stats = {"likes": 0, "dislikes": 0, "comments": 0}
        post = self.get_object()

        reactions = Reaction.objects.filter(post=post)
        comments = Comment.objects.filter(post=post)
        
        stats["likes"] = reactions.filter(sign="+").count()
        stats["dislikes"] = reactions.filter(sign="-").count()
        stats["comments"] = comments.count()

        return Response(stats, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], serializer_class=PostSerializer, pagination_class = PageNumberPagination, url_path="feed")
    def normal_post(self, request):
        user = request.user
        posts = SOCIALMEDIAALGO.feed_algorithim(self, user)
        
        paginator = self.paginator
        page = paginator.paginate_queryset(posts, request)

        if page is not None:
            serializer = PostSerializer(page, many=True)

            return self.get_paginated_response(serializer.data)

        serializer = PostSerializer(posts, many=True)

        return Response(serializer.data, status= status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'], serializer_class=PostSerializer, pagination_class = PageNumberPagination, url_path=r"feed/(?P<username>[\w.@+-]+)")
    def user_posts(self, request, username=None):
        posts = Post.objects.filter(user__username=username).order_by('-posted_at')

        paginator = self.paginator

        page = paginator.paginate_queryset(posts, request)

        if page is not None:
            serializer = PostSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = PostSerializer(page, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=["get"], serializer_class=ReactionsSerializer)
    def get_user_reaction(self, request, pk=None):
        user = request.user
        post = self.get_object()

        try:
            current_reaction = Reaction.objects.get(user=user, post=post, sign="+")

            return Response({"reacted": True}, status=status.HTTP_200_OK)
        except Reaction.DoesNotExist:
            return Response({"reacted": False}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["get"], serializer_class=CommentSerializer, pagination_class = PageNumberPagination)
    def GetCommentsInfo(self, request, pk=None):
        post = self.get_object()
        comments = Comment.objects.filter(post=post)
        paginated_comments = self.paginate_queryset(comments)
        
        if paginated_comments is not None:
            serializer = CommentSerializer(paginated_comments, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = CommentSerializer(comments, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

class ReactionViewSet(viewsets.GenericViewSet, DestroyModelMixin):
    queryset = Reaction.objects.all()
    serializer_class = ReactionsSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    @action(detail=False, methods={"post"}, serializer_class=AddReactionSerializer)
    def ChangeReaction(self, request):
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        post = serializer.validated_data["post"]

        try:
            reaction = Reaction.objects.get(user=user, post=post)
        except Reaction.DoesNotExist:
            reaction = Reaction(user=user, post=post, sign="+")
            reaction.save()

            return Response(
                {"detail": "Reaction added successfully"}, status=status.HTTP_200_OK
            )

        reaction.sign = "+" if reaction.sign == "-" else "-"

        reaction.save()

        return Response(
            {"detail": "Reaction edited successfully"}, status=status.HTTP_200_OK
        )
    
class CommentViewSet(viewsets.GenericViewSet, DestroyModelMixin, CreateModelMixin):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AddCommentSerializer
    queryset = Comment.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class FollowViewSet(viewsets.GenericViewSet, DestroyModelMixin):
    permission_classes= [permissions.IsAuthenticated]
    serializer_class = FollowSerializer
    queryset = Follow.objects.all()

    @action(detail=False, methods={"get"}, url_path=r"status/(?P<username>[^/.]+)", pagination_class=None)
    def get_user_follow_status(self, request, username=None):
        user = request.user
        is_following = Follow.objects.filter(follower_user=user, followed_user__username=username).exists()

        return Response({'is_following': is_following}, status=status.HTTP_200_OK)

    @action(detail=False, methods={"post"}, url_path=r"toggle/(?P<username>[^/.]+)", pagination_class=None, serializer_class=None)
    def toggle_follow(self, request, username=None):
        source_user = request.user
        target_user = None
        if source_user.username == username:
            return Response({"details": "You can't follow yourself."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            target_user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        follow_object = Follow.objects.filter(follower_user=source_user, followed_user=target_user)
        was_following = follow_object.exists()

        if was_following:
            follow_object.delete()
        else:
            Follow.objects.create(follower_user=source_user, followed_user=target_user)

        action_prefix = "UNF" if was_following else "F"
        is_following_now = not was_following

        return Response({"details": f"{action_prefix}ollowed {username}.", "is_following": is_following_now})
    
class TokenCheck(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response({"data": "success"}, status=status.HTTP_200_OK)
