import React from 'react';
import loggedContext from './context';
import Comments from './comments';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { CircleLoader } from 'react-spinners';
import { Post } from './post';
function FeedPosts() {
  const postRef = React.useRef([]);
  const TempRef = React.useRef([]);
  const { logState } = React.useContext(loggedContext);
  const [posts, setPosts] = React.useState([]);
  const [hasmore, setHasmore] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [commentState, setCommentState] = React.useState({
    visibility: false,
    post: null,
  });
  const sockets = React.useRef([]);

  //console.log(sockets);
  React.useEffect(() => {
    postRef.current = [];
    if (!logState) {
      return;
    }

    fetchPosts(page);

    return () => {
      sockets.current.forEach((socket) => socket.close());
    };
  }, [logState]);

  async function getUserReaction(post_id) {
    return await fetch(
      `http://127.0.0.1:8000/api/post/${post_id}/get_user_reaction/`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`,
        },
      }
    )
      .then((Response) => Response.json())
      .then((data) => data['reacted'])
      .catch((err) => false);
  }

  function togglecomment(post) {
    setCommentState({
      visibility: !commentState.visibility,
      post: post,
    });
  }

  const fetchPosts = (cpage) =>
    fetch(`http://127.0.0.1:8000/api/post/feed/?page=${cpage}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access')}`,
      },
    })
      .then((Response) => {
        if (Response.ok) {
          return Response.json();
        }
      })
      .then(async (data) => {
        const postsDetails = data['results'];

        const unifiedpost = postsDetails.map(async (post) => {
          const post_id = post['post_id'];
          const response = await fetch(
            `http://127.0.0.1:8000/api/post/${post_id}/GetPostStats/`,
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${localStorage.getItem('access')}`,
              },
            }
          );

          const posteng = await response.json();
          const currentUserReaction = await getUserReaction(post['post_id']);
          return {
            ...post,
            comment_count: parseInt(posteng.comments),
            like_count: parseInt(posteng.likes),
            current_user_reacted: currentUserReaction,
          };
        });

        const allposts = await Promise.all(unifiedpost);

        setPosts((prev) => [...prev, ...allposts]);
        allposts.map(async (post) => {
          const socket = new WebSocket(
            `ws://127.0.0.1:8000/ws/inteligram/reaction/`
          );

          socket.onopen = () => {
            socket.send(
              JSON.stringify({
                action: 'subscribe_to_reactions',
                post_id: post['post_id'],
              })
            );
          };

          socket.onmessage = async (event) => {
            const message = JSON.parse(event.data);
            console.log('recieverd', message);
            const currentUserReaction = await getUserReaction(post['post_id']);
            setPosts((prev) =>
              prev.map((p) =>
                p['post_id'] === post['post_id']
                  ? {
                      ...p,
                      like_count: parseInt(message['like_count']),
                      comment_count: parseInt(message['comment_count']),
                      current_user_reacted: currentUserReaction,
                    }
                  : p
              )
            );
          };

          sockets.current.push(socket);
        });
        setHasmore(data['next'] !== null);
        setPage(cpage + 1);
      });

  function updateReaction(post_id) {
    fetch('http://127.0.0.1:8000/api/reaction/ChangeReaction/', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access')}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        post: post_id,
      }),
    });
  }

  return (
    <>
      <div
        id="posts-container"
        style={commentState.visibility ? { display: 'none' } : {}}
      >
        <InfiniteScroll
          dataLength={posts.length}
          next={() => fetchPosts(page)}
          hasMore={hasmore}
          loader={
            <CircleLoader
              id="term-loader"
              color={'white'}
              loading={true}
              size={50}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          }
          endMessage={
            <p style={{ textAlign: 'center' }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
        >
          {posts?.map((post, i) => (
            <Post
              post={post}
              togglecomment={togglecomment}
              key={post['post_id']}
            />
          ))}
        </InfiniteScroll>
      </div>
      {commentState.visibility && (
        <Comments
          post={commentState.post}
          togglecomment={togglecomment}
          updateReaction={updateReaction}
          getUserReaction={getUserReaction}
        />
      )}
    </>
  );
}

export default FeedPosts;
