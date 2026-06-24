import NavBar from '../components/nav';
import FeedPosts from '../components/feed';
import Tokenctr from '../components/tokenctr';
function Home() {
  return (
    <>
      <Tokenctr>
        <NavBar />
        <FeedPosts />
      </Tokenctr>
    </>
  );
}

export default Home;
