function App() {
  const login = () => window.location.href = 'http://localhost:5000/auth/google';
  
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <button onClick={login}>Login with Google</button>
    </div>
  );
}

export default App;