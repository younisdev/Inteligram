from rest_framework import serializers
from .models import User, Post, Reaction, Follow, Comment
from better_profanity import profanity
from .helper import password_hashing, check_password
from django.utils import timezone
from dateutil import parser

class UserSerializer(serializers.ModelSerializer):

    username = serializers.CharField(required=False)
    password = serializers.CharField(write_only=True, help_text="Password must be at least 9 characters, with uppercase, lowercase, digits, and special chars.")

    class Meta:
        model = User
        fields = ["id", "username", "profile_pic", "email", "DOB", "gender", "password"]

class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, help_text="Password must be at least 9 characters, with uppercase, lowercase, digits, and special chars.")

    class Meta:
        model = User
        fields = ["username", "profile_pic", "email", "password", "DOB", "gender"]

    def validate_username(self, value):
        if profanity.contains_profanity(value) or (len(value) < 2 or len(value) > 30):
            raise serializers.ValidationError("Invalid username.")
        return value

    def validate_DOB(self, value):
        age =  (timezone.now().date() - value).days / 365.25

        if not (age > 13 and age < 150):
            raise serializers.ValidationError("Invalid age.")
        return value

    def validate_password(self, value):

        if not check_password(value):
            raise serializers.ValidationError("Weak password")
        return value

    def create(self, validated_data):
       return password_hashing(validated_data)

class UserDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "gender"]

    def validate_username(self, value):
        if profanity.contains_profanity(value):
            raise serializers.ValidationError("Invalid username.")
        return value


class PasswordResetSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["old_password", "new_password"]

    new_password = serializers.CharField(write_only=True)
    old_password = serializers.CharField(write_only=True)

    def validate_new_password(self, value):
        if not check_password(value):
            raise serializers.ValidationError("Weak password")

class UserPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id" ,"username", "profile_pic"]

class PostSerializer(serializers.ModelSerializer):
    attachment = serializers.ImageField()
    user = UserPostSerializer()

    class Meta:
        model = Post
        fields = "__all__"

    def validate(self, data):
        if not (data.get("attachment") or data.get("text")):
            raise serializers.ValidationError("Please provide content")
        return data

class CreatePostSerializer(serializers.ModelSerializer):
    attachment = serializers.ImageField(required=False)

    class Meta:
        model = Post
        fields = ["user", "text", "attachment"]

    def validate(self, data):
        print(data.get("attachment"), data.get("text"))
        if not data.get("attachment") and not data.get("text"):
            raise serializers.ValidationError("Please provide content")
        return data

class EditPostSerializer(serializers.ModelSerializer):

    class Meta:
        model = Post
        fields = ["text", "attachment"]

    def validate(self, data):
        if not data.get("attachment") and not data.get("text"):
            raise serializers.ValidationError("Please provide content")
        return data

    def validate_text(self, data):
        # bud check slurs or censored shit
        return data

class ReactionsSerializer(serializers.ModelSerializer):
    post_id = serializers.UUIDField(format="hex")
    class Meta:
        model = Reaction
        fields = ["sign", "user", "post_id"]

class CommentSerializer(serializers.ModelSerializer):
    post_id = serializers.UUIDField(format="hex")
    user = UserSerializer()
    
    class Meta:
        model = Comment
        fields = ["text", "user", "post_id"]

class AddCommentSerializer(serializers.ModelSerializer):
    post_id = serializers.UUIDField(format="hex")

    class Meta:
        model = Comment
        fields = ["text", "user", "post_id"]

class AddReactionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Reaction
        fields = ["post"]

class FollowSerializer(serializers.ModelSerializer):

    class Meta:
        model = Follow
        fields = "__all__"

class FollowerUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = Follow
        fields = ["follow_id", "follow_date", "follower_user"]

class FollowingUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = Follow
        fields = ["follow_id", "follow_date", "followed_user"]