import React, { useState, useEffect } from 'react';

import Stories from '../../containers/Stories';
import Loading from '../../components/Loading';

import Posts from '../../containers/Posts';

import './FeedRoute.scss';

const FeedRoute = () => {
  const [users, setUsers] = useState([]);
  const [stories, setStories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [usersFetched, setUsersFetched] = useState(0);

  const getUserPostById = (postUserId) => users.find(user => postUserId === user.id);

  useEffect(() => {
    const fetchData = async () => {
      setUsers(await fetch(`https://5e7d0266a917d70016684219.mockapi.io/api/v1/users`)
      .then((res) => res.json()));

      setStories(await fetch(`https://5e7d0266a917d70016684219.mockapi.io/api/v1/stories`)
      .then((res) => res.json()));
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (usersFetched === users.length) {
      return;
    }

    fetch(`https://5e7d0266a917d70016684219.mockapi.io/api/v1/users/${users[usersFetched].id}/posts`)
      .then((res) => res.json())
      .then(data => {
        setPosts([...posts, ...data]);
        setUsersFetched(usersFetched + 1);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users, usersFetched]);

  return (
    <div data-testid="feed-route">
      {(stories.length > 0 && users.length > 0) ? (
        <Stories
          stories={stories}
          getUserHandler={getUserPostById}
        />)
      : (<Loading />)}

      {usersFetched === 0
        ? (<Loading />)
        : (<Posts
            posts={posts}
            getUserHandler={getUserPostById}
        />)
      }
    </div>
  );
};

export default FeedRoute;
