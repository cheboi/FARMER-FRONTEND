import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    farmSize: "",
    farmerCategory: "crop",
    cropType: "",
    livestockType: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const buildPayload = () => {
    const { username, password, firstName, lastName, farmSize, farmerCategory, cropType, livestockType } = form;
    return {
      username,
      password,
      firstName,
      lastName,
      farmSize,
      cropType: farmerCategory === "crop" || farmerCategory === "both" ? cropType : null,
      livestockType: farmerCategory === "livestock" || farmerCategory === "both" ? livestockType : null,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/farmers", buildPayload());
      setSuccess("Registration successful. Awaiting certification.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Farmer Registration</h2>

        {success && <p style={{ color: "green" }}>{success}</p>}
        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input name="firstName" placeholder="First Name" required onChange={handleChange} />
          <input name="lastName" placeholder="Last Name" required onChange={handleChange} />
          <input name="username" placeholder="Username" required onChange={handleChange} />
          <input name="password" type="password" placeholder="Password" required onChange={handleChange} />
          <input name="farmSize" placeholder="Farm Size (e.g. 5 acres)" required onChange={handleChange} />
          <select name="farmerCategory" onChange={handleChange}>
            <option value="crop">Crop Farmer</option>
            <option value="livestock">Livestock Farmer</option>
            <option value="both">Crop & Livestock</option>
          </select>
          {(form.farmerCategory === "crop" || form.farmerCategory === "both") && (
            <input name="cropType" placeholder="Crop Type (e.g. maize, rice)" required onChange={handleChange} />
          )}
          {(form.farmerCategory === "livestock" || form.farmerCategory === "both") && (
            <input name="livestockType" placeholder="Livestock Type (e.g. cattle, poultry)" required onChange={handleChange} />
          )}
          <button>Create Account</button>
        </form>

        <div className="auth-footer">
          Already registered? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}
