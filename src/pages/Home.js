import { useEffect, useState } from 'react';
import { Comment, Loader } from '../components';
import { Link } from 'react-router-dom';
import { getPosts } from '../api';
import styles from '../styles/home.module.css';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await getPosts();

      if (response.success) {
        setPosts(response.data.posts);
      }

      setLoading(false);
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={styles.postsList}>
      {posts.map((post) => (
        <div className={styles.postWrapper} key={`post-${post._id}`}>
          <div className={styles.postHeader}>
            <div className={styles.postAvatar}>
              <img
                src="https://www.svgrepo.com/show/382106/male-avatar-boy-face-man-user-9.svg"
                alt="user-pic"
              />
              <div>
                <Link
                  to={{
                    pathname: `/user/${post.user._id}`,
                    state: {
                      user: post.user,
                    },
                  }}
                  className={styles.postAuthor}
                >
                  {post.user.name}
                </Link>
                <span className={styles.postTime}>a minute ago</span>
              </div>
            </div>
            <div className={styles.postContent}>{post.content}</div>

            <div className={styles.postActions}>
              <div className={styles.postLike}>
                <img
                  src="https://img.icons8.com/?size=512&id=24816&format=png"
                  alt="likes-icon"
                />
                <span>5</span>
              </div>

              <div className={styles.postCommentsIcon}>
                <img
                  src="https://img.icons8.com/?size=512&id=143&format=png"
                  alt="comments-icon"
                />
                <span>{post.comments.length}</span>
              </div>
            </div>
            <div className={styles.postCommentBox}>
              <input placeholder="Start typing a comment" />
            </div>

            <div className={styles.postCommentsList}>
              {post.comments.map((comment) => (
                <Comment comment={comment} />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;
