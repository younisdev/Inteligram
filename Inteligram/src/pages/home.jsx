import NavBar from '../components/nav';
import FeedPosts from '../components/feed';
import Tokenctr from '../components/tokenctr';
import { DyvixToastContainer, DYVIX_GLOBAL_ANIMATION } from 'dyvix-ui';
function Home() {
  return (
    <>
      <Tokenctr>
        <DyvixToastContainer position='top-right' duration={5000} segments={10} animation={DYVIX_GLOBAL_ANIMATION.GLITCH}/>
        <NavBar />
        <FeedPosts />
      </Tokenctr>
    </>
  );
}

export default Home;
