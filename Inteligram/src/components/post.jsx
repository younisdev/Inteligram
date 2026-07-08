import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import React from 'react';

export function Post({ post, togglecomment }) {
  const postRef = React.useRef();
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

  useGSAP(() => {
    if (!postRef.current) return;

    gsap.fromTo(
      postRef.current,
      { scale: 0, y: 30, opacity: 0 },
      { scale: 1, y: 0, opacity: 1, duration: 0.5, ease: 'power2.inOut' }
    );
  }, []);
  return (
    <div ref={postRef}>
      <div className="post">
        <div className="post-info">
          <img
            className="user-pfp"
            src={`http://127.0.0.1:8000${post['user'].profile_pic === null ? '/attachments/user.png' : post['user'].profile_pic}`}
            loading="lazy"
          ></img>
          <span className="post-username">{post['user'].username}</span>
        </div>
        <div className="post-content">
          <p>{post['text']}</p>
          {post['attachment'] && (
            <img
              src={`http://127.0.0.1:8000${post['attachment']}`}
              loading="lazy"
            ></img>
          )}
        </div>
        <div className="interaction-container">
          <div
            className="post-interaction"
            onClick={() => updateReaction(post['post_id'])}
          >
            <span>{post['like_count']}</span>
            <span
              className="material-symbols-outlined"
              style={{ color: post['current_user_reacted'] ? 'blue' : 'white' }}
            >
              thumb_up
            </span>
          </div>
          <div className="post-interaction" onClick={() => togglecomment(post)}>
            <span>{post['comment_count']}</span>
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
    </div>
  );
}
