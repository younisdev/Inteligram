import {
  Modal,
  DYVIX_GLOBAL_THEME,
  DYVIX_MODAL_VALIDATION_PRESET,
  DYVIX_MODAL_TYPE,
  DYVIX_GLOBAL_ANIMATION,
  DYVIX_MODAL_ELEMENT,
  dyvixToast,
} from 'dyvix-ui';

function CreateComment({ post, setShowAddComment, fetchComments }) {
  function addComment(comment) {
    fetch('http://127.0.0.1:8000/api/comment/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access')}`,
      },
      body: JSON.stringify({
        text: comment,
        post_id: post['post_id'],
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Api Error! Status: ${response.status}`);
        }
        dyvixToast.success('Comment successfully added');
        setShowAddComment(false);
        fetchComments(1);
      })
      .catch((error) => console.error(error));
  }

  return (
    <div className="modal-add-holder">
      <Modal
        title="Add Comment"
        className="inteligram-modal"
        theme={DYVIX_GLOBAL_THEME.OCEAN}
        animation={DYVIX_GLOBAL_ANIMATION.DRIFT}
        type={DYVIX_MODAL_TYPE.FORM}
        elements={[
          {
            type: DYVIX_MODAL_ELEMENT.TEXT,
            amount: 1,
            name: 'commentText',
            placeholder: 'Share your thoughts authentically...',
            id: 'comment-input',
            validation:
              '$R^[\\s\\S]{3,500}$|must be between 3 and 500 characters',
          },
        ]}
        onSubmit={(data) => addComment(data['commentText'])}
        onClose={() => setShowAddComment(false)}
      />
    </div>
  );
}

export default CreateComment;
