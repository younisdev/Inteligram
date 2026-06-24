export const AuthMessage = ({ value }) => {
  const authColor = { error: 'red', success: 'green', info: 'white' };
  return (
    <div id="auth-msg">
      <span className="material-symbols-outlined auth-emoji error">error</span>
      <span className="msg error">{value.message}</span>
    </div>
  );
};
