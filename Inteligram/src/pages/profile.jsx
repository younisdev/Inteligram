import NavBar from '../components/nav';
import Tokenctr from '../components/tokenctr';
import { DyvixToastContainer, DYVIX_GLOBAL_ANIMATION } from 'dyvix-ui';
import { useParams } from 'react-router';
import ProfileFeed from '../components/ProfileFeed';

function Profiles() {
  const { username } = useParams();

  return (
    <>
      <Tokenctr>
        <DyvixToastContainer
          position="top-right"
          duration={5000}
          segments={10}
          animation={DYVIX_GLOBAL_ANIMATION.GLITCH}
        />
        <NavBar />
        <ProfileFeed user={username} />
      </Tokenctr>
    </>
  );
}

export default Profiles;
