import {
  Modal,
  DyvixSelect,
  DYVIX_GLOBAL_THEME,
  DYVIX_MODAL_VALIDATION_PRESET,
  DYVIX_MODAL_TYPE,
  DYVIX_GLOBAL_ANIMATION,
  DyvixToastContainer,
  dyvixToast,
  DYVIX_MODAL_ELEMENT,
} from 'dyvix-ui';

function ModalPrev() {
  const testData5Rows = Array.from({ length: 9 }, (_, i) => ({
    type: 'text',
    name: `field_${i}`,
    placeholder: `Extended Field ${i + 1}`,
    amount: 1,
  }));
  return (
    <Modal
      title="Add Comment"
      //Id={`intel-comment-modal-${postId}`}
      className="inteligram-modal-comment"
      theme={DYVIX_GLOBAL_THEME.MIDNIGHT}
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
      onSubmit={(data) => {
        console.log('hi', data);
      }}
      onChange={(data) => {
        console.log('Typing dynamic payload...', data);
      }}
      //onClose={onClose}
    />
  );
}

export default ModalPrev;
