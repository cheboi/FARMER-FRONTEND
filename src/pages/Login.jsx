import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await api.post("/auth/login", form);
      localStorage.setItem("token", data.token);
      navigate("/farmer/dashboard");
    } catch {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Farmer Login</h2>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            placeholder="Username"
            required
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            required
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button>Login</button>
          <div className="auth-footer">
            <p>
              Don’t have a farmer account? <Link to="/register">Register</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
