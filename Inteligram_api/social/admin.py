from django.contrib import admin
from . models import User, Post, Follow, Comment, Reaction, Tag, PostInteraction
# Register your models here.

admin.site.register(User),
admin.site.register(Post),
admin.site.register(Follow),
admin.site.register(Comment),
admin.site.register(Reaction),
admin.site.register(Tag),
admin.site.register(PostInteraction)