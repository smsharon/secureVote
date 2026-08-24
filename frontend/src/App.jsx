import apiClient from "./api/axios";

function App() {
  console.log("API Base URL:", apiClient.defaults.baseURL);

  return (
    <div className="container mt-5">
      <h1>SecureVote</h1>
      <p>Frontend API configuration is ready.</p>
    </div>
  );
}

export default App;