import AccessDenied from 'assets/svg/AccessDenied.svg';

const UnauthorizedAccess = () => {
  return (
    <div
      style={{
        height: '90vh',
        margin: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <h1 style={{ margin: '0 0 2rem 0' }}>Unauthorized Access</h1>
      <div>
        <img src={AccessDenied} alt='Login' height={300}></img>
      </div>
      <h5 style={{ margin: '2rem 0', textAlign: 'center' }}>
        You are attempting to access or change data outside of your scope.
      </h5>
    </div>
  );
};

export default UnauthorizedAccess;
