import { DyvixButton, dyvixToast } from 'dyvix-ui';
import React, { use } from 'react';
import FeedPosts from './feed';

function ProfileFeed({ user }) {
  const [userDetails, setUserDetails] = React.useState(null);
  const [currentUserDetails, setCurrentUserDetails] = React.useState(null);
  const [isFollowed, SetIsFollowed] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState(null);

  React.useEffect(() => {
    if (!user) {
      dyvixToast.error('Invalid user.');
      return;
    }

    async function fetchUserDetails() {
      try {
        const headers = {
          Authorization: `Bearer ${localStorage.getItem('access')}`,
          'Content-Type': 'application/json',
        };
        const [userRes, statsRes, currentUserRes] = await Promise.all([
          fetch(`http://127.0.0.1:8000/api/users/get/${user}/`, {
            headers: headers,
          }),
          fetch(`http://127.0.0.1:8000/api/users/stats/follow/${user}/`, {
            headers: headers,
          }),
          fetch('http://127.0.0.1:8000/api/users/get/current/', {
            headers: headers,
          }),
        ]);

        if (!userRes.ok) {
          dyvixToast.error('Invalid user.');
          console.error(`HTTP Error: ${userRes.status}`);
          return;
        }
        const userData = await userRes.json();
        const statsData = statsRes.ok ? await statsRes.json() : {};
        const currentUserData = currentUserRes.ok
          ? await currentUserRes.json()
          : {};

        setUserDetails({ ...userData, ...statsData });
        setCurrentUserDetails(currentUserData);
      } catch (error) {
        dyvixToast.error('Network error. Please try again.');
        console.error(error);
      }
    }

    fetchUserDetails();
  }, [user]);

  React.useEffect(() => {
    if (!user) return;

    async function IsFollowedByCurrentUser() {
      const response = await fetch(
        `http://127.0.0.1:8000/api/follow/status/${user}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json()
        SetIsFollowed(data.is_following);
      }
    }
    IsFollowedByCurrentUser();
  }, [userDetails, user]);


  async function ToggleFollowRequest() {
    
  }

  return (
    <div className="profile-container">
      <div className="profile-details">
        <img
          className="profile-pfp"
          src={
            userDetails?.profile_pic ||
            'http://127.0.0.1:8000/attachments/user.png'
          }
          alt={userDetails?.username || 'User profile'}
          loading="lazy"
        />
        <span className="profile-username">
          {userDetails?.username || 'Loading...'}
        </span>
        <div className="stats-details">
          <div className="stat-item">
            <span className="stat-number">
              {userDetails?.followed_count || 0}
            </span>
            <span className="stat-label">followers</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {userDetails?.following_count || 0}
            </span>
            <span className="stat-label">following</span>
          </div>
        </div>
        {currentUserDetails?.username !== userDetails?.username &&
          <DyvixButton theme="Ocean" className="follow-btn" onClick={}>
            {isFollowed ? 'Unfollow' : 'Follow'}
          </DyvixButton>
        }
      </div>

      <div className="profile-feed">
        <FeedPosts fetchUrl={`http://127.0.0.1:8000/api/post/feed/${user}/`} />
      </div>
    </div>
  );
}

export default ProfileFeed;
