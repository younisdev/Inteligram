from djangochannelsrestframework.generics import GenericAsyncAPIConsumer
from djangochannelsrestframework.observer.generics import ObserverModelInstanceMixin
from djangochannelsrestframework.decorators import action
from djangochannelsrestframework.observer import model_observer
from .models import Reaction, Comment
from .serializers import ReactionsSerializer

def get_shared_serializer(post_id):
    reactions = Reaction.objects.filter(post_id=post_id, sign="+")
    comments = Comment.objects.filter(post_id=post_id)

    return {
        "action": "reaction_update",
        "post_id": str(post_id),
        "like_count": reactions.count(),
        "comment_count": comments.count()
    }

class ReactionConsumers(GenericAsyncAPIConsumer):
    queryset = Reaction.objects.all()
    serializer_class = ReactionsSerializer

    @action()
    async def subscribe_to_reactions(self, post_id, **kwargs):        
        await self.reaction_tracker.subscribe(post_id=post_id)
        await self.comment_tracker.subscribe(post_id=post_id)

    @model_observer(Reaction)
    async def reaction_tracker(self, message, observer=None, **kwargs):
        await self.send_json(message)

    @reaction_tracker.groups_for_signal
    def reaction_tracker_for_signal(self, instance, **kwargs):
        yield f"post__{instance.post_id}"

    @reaction_tracker.groups_for_consumer
    def reaction_tracker_for_consumer(self, post_id, **kwargs):
        yield f"post__{post_id}"

    @model_observer(Comment)
    async def comment_tracker(self, message, observe=None, **kwargs):
        await self.send_json(message)

    @comment_tracker.groups_for_signal
    def comment_tracker_for_signal(self, instance, **kwargs):
        yield f"post__{instance.post_id}"
        
    @comment_tracker.groups_for_consumer
    def comment_tracker_for_consumer(self, post_id, **kwargs):
        yield f"post__{post_id}"

    @reaction_tracker.serializer
    def reaction_serializer(self, instance, action, **kwargs):
        return get_shared_serializer(instance.post_id)

    @comment_tracker.serializer
    def comment_serializer(self, instance, action, **kwargs):
            return get_shared_serializer(instance.post_id)

