import {
  Modal,
  DYVIX_GLOBAL_THEME,
  DYVIX_GLOBAL_ANIMATION,
  DYVIX_MODAL_TYPE,
  DYVIX_MODAL_ELEMENT,
  dyvixToast,
} from 'dyvix-ui';

function CreatePost({ setAddPost }) {
  function addPost(text, attachment) {
    const formData = new FormData();
    formData.append('text', text);
    if (attachment) {
      formData.append('attachment', attachment);
    }

    fetch('http://127.0.0.1:8000/api/post/CreatePost/', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access')}`,
      },
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Api Error! Status: ${response.status}`);
        }
        dyvixToast.success('Post successfully transmitted');
        setAddPost(false);
      })
      .catch((error) => console.error(error));
  }

  return (
    <div className="modal-add-holder">
      <Modal
        title="Transmit Post"
        className="inteligram-modal"
        theme={DYVIX_GLOBAL_THEME.OCEAN}
        animation={DYVIX_GLOBAL_ANIMATION.DRIFT}
        type={DYVIX_MODAL_TYPE.FORM}
        elements={[
          {
            type: DYVIX_MODAL_ELEMENT.TEXT,
            amount: 1,
            name: 'postText',
            placeholder: 'Write your post here...',
            id: 'post-input',
            validation:
              '$R^[\\s\\S]{3,500}$|must be between 3 and 500 characters',
          },
          {
            type: DYVIX_MODAL_ELEMENT.FILE,
            amount: 1,
            name: 'postMedia',
            placeholder: 'Attach post media',
          },
        ]}
        onSubmit={(data) => addPost(data['postText'], data['postMedia'])}
        onClose={() => setAddPost(false)}
      />
    </div>
  );
}

export default CreatePost;
