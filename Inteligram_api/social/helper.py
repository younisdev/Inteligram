from .models import User, Post, PostInteraction
from password_lib.utils import PasswordUtil
from django.utils import timezone
from datetime import timedelta
import random

FEEDSCORE = {"follow": 5, "reaction": 5, "comment": 15, "view": 10}

def password_hashing(data, instance=None):

    if instance is None:
        user = User(**data)
    else:
        user = instance
        for attr, value in data.items:
            setattr(user, attr, value)

    password = data.pop("password", None)

    if password:
        user.set_password(password)

    user.save()

    return user

def check_password(password):
    password_util = PasswordUtil()
    password_util.configure_strength(
            min_length=9,
            requires_special_chars=True,
            requires_digits=True,
            requires_uppercase=True,
            requires_lowercase=True
    )

    return password_util.is_secure(password)


class SOCIALMEDIAALGO():
    def six_month_range(self):
        return timezone.now() - timedelta(days=182)

    '''
    algo rules:
    80% new / 20% random old 5-10 year max span

    todo add caching
    '''

    def feed_algorithim(self, user):
        """
            Compiles a set of the recent interacted post by the user and matches them with new post.

            Parameters:
                - user: The user.
        
            Return:
                A list of posts matching the user past interactions (80% new / 20% random old posts).
        """
        personalize_offset = 20
        user_interactions = PostInteraction.objects.filter(user=user).values('post').distinct()[:40].count()

        if user_interactions < personalize_offset:
            return list(Post.objects.all().exclude(user=user.id))

        posts = Post.objects.all().exclude(user=user.id).prefetch_related("tags")

        new_posts = posts.filter(date__gte=self.six_month_range())
        user_feed = self.get_user_feed(user)
        new_posts = self.slice_list(self.score_posts(new_posts, user_feed), 0.8)

        old_posts = self.slice_list(list(posts.filter(date__lt=self.six_month_range())), 0.2)

        finalized_posts = new_posts + old_posts
        random.shuffle(finalized_posts)

        return finalized_posts

    def score_posts(self, posts, feed_ref):
        """
            Compiles a set of posts and past interacted user tags each with a score and gets new post.

            Parameters:
                - posts: A list of posts to score.
                - feed_ref: Holds scored tags.

            Return:
                A list of posts matching the user past interactions based on thee feed_ref.
        """
        post_score = {}

        for tag in feed_ref:
            for post in posts:
                post_tags = [tag.name for tag in post.tags.all()]

                if tag in post_tags:
                    tag_score = feed_ref.get(tag)
                    post_score[post] = post_score.get(post , 0) + tag_score

        sorted_posts = sorted(post_score.items(), key=lambda item: item[1], reverse=True)

        return [post for post, _ in sorted_posts]

    def get_user_feed(self, user):
        """
            Retrieve all user tags (topics) interactions based on tags

            Parameters:
                - user: The user.

            Returns:
                A dict containing tags as a key and the relative score as a value.
        """
        user_interactions = PostInteraction.objects.filter(user=user, interacted_at__gte=self.six_month_range()).select_related("post").prefetch_related("post__tags")
        post_score = {}

        for interaction in user_interactions:
            score = FEEDSCORE.get(interaction.Interaction)

            if score is not None:
                tags = interaction.post.tags.all()

                for tag in tags:
                    post_score[tag.name] = post_score.get(tag.name, 0) + score

        return post_score

    def slice_list(self, unsliced_list, percentage):
        """
            Slices a list using a certain percentage

            Parameters:
                - unsliced_list: The unsliced original list.
                - percentage: The percentage you want to slice the list into.

            Returns:
                A list containing the sliced value.
        """

        if unsliced_list is None:
            return []

        if len(unsliced_list) < 10:
            return unsliced_list

        unsliced_list = list(unsliced_list)
        percentage_index = int(len(unsliced_list) * percentage)

        return unsliced_list[:percentage_index]