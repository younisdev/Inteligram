import React from 'react';
import { createPortal } from 'react-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { CircleLoader } from 'react-spinners';
import gsap from 'gsap';
import { dyvixToast } from 'dyvix-ui';
import CreateComment from './CreateComment';

const Comments = ({ post, togglecomment, updateReaction, getUserReaction }) => {
  const [postState, setPosts] = React.useState(post);
  const [comments, setComments] = React.useState([]);
  const [showAddComment, setShowAddComment] = React.useState(false);
  const [hasmore, setHasmore] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const postRef = React.useRef(post);
  const commentRef = React.useRef([]);
  const backbtnRef = React.useRef(null);
  const commentContRef = React.useRef(null);
  const sockets = React.useRef([]);
  const sideRef = React.useRef();
  React.useEffect(() => {
    gsap.to(postRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.5,
    });
    if (!postState) return null;
    fetchComments(1);

    return () => {
      sockets.current.forEach((socket) => socket.close());
    };
  }, []);

  const fetchComments = async (cpage) =>
    fetch(
      `http://127.0.0.1:8000/api/post/${postState['post_id']}/GetCommentsInfo/?page=${cpage}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`,
        },
      }
    )
      .then((Response) => {
        if (Response.ok) return Response.json();
      })
      .then((data) => {
        setComments((prev) =>
          cpage === 1 ? data['results'] : [...prev, data['results']]
        );
        setHasmore(data['next'] !== null);
        setPage(cpage + 1);

        const socket = new WebSocket(
          `ws://127.0.0.1:8000/ws/inteligram/reaction/`
        );

        socket.onopen = () => {
          socket.send(
            JSON.stringify({
              action: 'subscribe_to_reactions',
              post_id: postState['post_id'],
            })
          );
        };

        socket.onmessage = async (event) => {
          const message = JSON.parse(event.data);
          const currentUserReaction = await getUserReaction(
            postState['post_id']
          );
          setPosts((prev) => ({
            ...prev,
            like_count: parseInt(message['like_count']),
            comment_count: parseInt(message['comment_count']),
            current_user_reacted: currentUserReaction,
          }));
        };

        sockets.current.push(socket);
      });

  async function dispose() {
    const tl = gsap.timeline();

    tl.to(sideRef.current, {
      scale: 0,
      opacity: 0.1,
      duration: 0.3,
      ease: 'power2.inOut',
    });
    tl.to(commentRef.current, {
      scale: 0,
      opacity: 0.1,
      duration: 0.2,
      stagger: 0.1,
      ease: 'power2.inOut',
    });
    tl.to(postRef.current, {
      scale: 0,
      opacity: 0,
      duration: 0.2,
      ease: 'power2.inOut',
    });
    tl.to(backbtnRef.current, {
      x: -100,
      duration: 0.1,
      ease: 'power2.out',
    });

    setTimeout(() => togglecomment(post), 1200);
  }

  function ToggleComment() {
    setShowAddComment((prev) => !prev);
  }

  return (
    <div id="comments-container" ref={commentContRef}>
      {showAddComment &&
        createPortal(
          <CreateComment
            post={post}
            setShowAddComment={setShowAddComment}
            fetchComments={fetchComments}
          />,
          document.querySelector('#root')
        )}
      <span
        className="material-symbols-outlined close"
        ref={backbtnRef}
        onClick={() => dispose()}
      >
        keyboard_backspace
      </span>
      <div
        className="post"
        ref={postRef}
        style={{ opacity: 0, transform: 'scale(0) translateY(-10)' }}
      >
        <div className="post-info">
          <img
            className="user-pfp"
            src={`http://127.0.0.1:8000${postState['user'].profile_pic === null ? '/attachments/user.png' : postState['user'].profile_pic}`}
            loading="lazy"
          ></img>
          <span className="post-username">{postState['user'].username}</span>
        </div>
        <div className="post-content">
          <p>{postState['text']}</p>
          {postState['attachment'] && (
            <img
              src={`http://127.0.0.1:8000${postState['attachment']}`}
              loading="lazy"
            ></img>
          )}
        </div>
        <div className="interaction-container">
          <div
            className="post-interaction"
            onClick={() => updateReaction(postState['post_id'])}
          >
            <span>{postState['like_count']}</span>
            <span
              className="material-symbols-outlined"
              style={{
                color: postState['current_user_reacted'] ? 'blue' : 'white',
              }}
            >
              thumb_up
            </span>
          </div>
          <div className="post-interaction" onClick={() => ToggleComment()}>
            <span>{postState['comment_count']}</span>
            <span className="material-symbols-outlined">comment</span>
          </div>
          <div
            className="post-interaction"
            style={{ display: 'none' }}
            aria-disabled={true}
          >
            <span>0</span>
            <span className="material-symbols-outlined">visibility</span>
          </div>
        </div>
      </div>
      <div id="comments-section">
        {comments.length === 0 && (
          <p style={{ textAlign: 'center' }} ref={sideRef}>
            No comments to show. {comments.length}
          </p>
        )}
        {comments.length !== 0 && (
          <InfiniteScroll
            dataLength={comments.length}
            hasMore={hasmore}
            next={() => fetchComments(page)}
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
              <p style={{ textAlign: 'center' }} ref={sideRef}>
                <b>Yay! You have seen it all</b>
              </p>
            }
          >
            {comments.map((comment, i) => (
              <div
                className="comment"
                key={i}
                ref={(ele) => (commentRef.current[i] = ele)}
              >
                <div className="comment-info">
                  <img
                    className="user-pfp"
                    src={`http://127.0.0.1:8000${comment['user'].profile_pic === null ? '/attachments/user.png' : postState['user'].profile_pic}`}
                    loading="lazy"
                  ></img>
                  <span className="comment-username">
                    {comment['user'].username}
                  </span>
                </div>
                <div className="comment-content">
                  <p>{comment['text']}</p>
                </div>
              </div>
            ))}
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
};

export default Comments;
