from django.db import models
from django.contrib.auth.models import AbstractUser
from uuid import uuid4
from django.utils import timezone
# Create your models here.

GENDER_CHOICE = [("male", "Male"), ("female", "Female")]
SIGN_CHOICE = [("+", "positive"), ("-", "negative")]
INTERACTION_TYPE = [("like", "Like"), ("comment", "Comment"), ("view", "view")]

class User(AbstractUser):
    gender = models.CharField(default="male", choices=GENDER_CHOICE)
    DOB = models.DateField(null=True)
    profile_pic = models.ImageField(upload_to="", null=True)

class Tag(models.Model):
    name = models.CharField(max_length=200, unique=True)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.name

class Post(models.Model):
    post_id = models.UUIDField(primary_key=True, default=uuid4)
    date = models.DateTimeField(default=timezone.now)
    text = models.TextField(max_length=1000, null=True)
    attachment = models.ImageField(null=True, upload_to="")
    user = models.ForeignKey(User, null=False, on_delete=models.CASCADE)
    tags = models.ManyToManyField(Tag, blank=True)
    posted_at = models.DateTimeField(default=timezone.now)
    
    def __str__(self):
        return str(self.post_id)

class Reaction(models.Model):
    reaction_id = models.UUIDField(primary_key=True, default=uuid4)
    sign = models.CharField(max_length=1, choices=SIGN_CHOICE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="reactions")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reactions")
    reacted_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.user} {self.sign}ed {self.post}"

class Comment(models.Model):
    comment_id = models.UUIDField(primary_key=True, default=uuid4)
    text = models.TextField(max_length=1000, null=True)
    attachment = models.ImageField(null=True, upload_to="")
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="comments")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments")
    commented_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.user} commented on {self.post}"

class Follow(models.Model):
    follow_id = models.UUIDField(primary_key=True, default=uuid4)
    followed_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="followers")
    follower_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="following")
    follow_date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.follower_user} followed {self.followed_user}"

class PostInteraction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    Interaction = models.CharField(choices=INTERACTION_TYPE)
    interacted_at = models.DateTimeField(default=timezone.now)
