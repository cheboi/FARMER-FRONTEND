import { useEffect, useState } from "react";
import {
  FiLogOut,
  FiClock,
  FiAward,
  FiUser,
  FiMap,
  FiEye,
  FiCheckCircle,
  FiAlertTriangle,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import { GiPlantSeed, GiWheat, GiCow } from "react-icons/gi";

import api from "../api/axios";

export default function FarmerDashboard() {
  const [farmer, setFarmer] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchFarmerData();
  }, []);

  const fetchFarmerData = () => {
    api
      .get("/farmers/me")
      .then((res) => {
        const {
          first_name,
          last_name,
          farm_size,
          crop_type,
          livestock_type,
          status,
        } = res.data;
        setFarmer({
          firstName: first_name,
          lastName: last_name,
          farmSize: farm_size,
          cropType: crop_type,
          livestockType: livestock_type,
          status,
        });
      })
      .catch((err) => {
        console.error("Error fetching farmer data:", err);
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  if (!farmer) {
    return <div style={{ padding: 24 }}>Loading dashboard...</div>;
  }

  const getApplicationStatus = () => {
    switch (farmer.status) {
      case "pending":
        return "Pending Review";
      case "certified":
        return "Certified";
      case "approved":
        return "Approved";
      default:
        return "Not Certified";
    }
  };

  return (
    <div className="farmer-page">
      {/* HEADER */}
      <header className="farmer-header">
        <div className="logo">
          <GiPlantSeed size={22} /> Ukulima Sahi
        </div>

        <div className="header-right">
          <span>
            <FiUser /> Welcome, {farmer.firstName}
          </span>
          <button onClick={handleLogout}>
            <FiLogOut /> Logout
          </button>
        </div>
      </header>

      {/* STATS */}
      <section className="stats-grid">
        <Stat
          title="Application Status"
          value={getApplicationStatus()}
          icon={<FiClock />}
        />
        <Stat
          title="Certification Status"
          value={farmer.status === "certified" ? "Certified" : "Not Certified"}
          icon={<FiAward />}
        />
      </section>

      {/* MAIN CONTENT */}
      <section className="content-grid">
        {/* LEFT */}
        <div>
          <Card title="My Application Details">
            <p>
              <FiUser /> <b>Name:</b> {farmer.firstName} {farmer.lastName}
            </p>
            <p>
              <FiMap /> <b>Farm Size:</b> {farmer.farmSize}
            </p>
            <button
              className="primary-btn"
              onClick={() => setShowDetails(true)}
            >
              <FiEye /> View More
            </button>
          </Card>
        </div>

        {/* RIGHT */}
        <div>
          <Card title="My Certification">
            {farmer.status === "pending" && (
              <p>
                <FiClock /> Your certification is under review by the admin.
              </p>
            )}
            {farmer.status === "certified" && (
              <p className="success">
                <FiCheckCircle /> You are certified
              </p>
            )}
            {farmer.status === "revoked" && (
              <p className="error">
                <FiAlertTriangle /> Certification revoked
              </p>
            )}
          </Card>
        </div>
      </section>

      {/* DETAILS MODAL */}
      {showDetails && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Farmer Details</h3>
            <p>
              <FiUser /> <b>First Name:</b> {farmer.firstName}
            </p>
            <p>
              <FiUser /> <b>Last Name:</b> {farmer.lastName}
            </p>
            <p>
              <FiMap /> <b>Farm Size:</b> {farmer.farmSize}
            </p>
            <p>
              <GiWheat /> <b>Crop Type:</b> {farmer.cropType || "N/A"}
            </p>
            <p>
              <GiCow /> <b>Livestock Type:</b> {farmer.livestockType || "N/A"}
            </p>
            <p>
              <b>Status:</b> {farmer.status}
            </p>
            <button className="close-btn" onClick={() => setShowDetails(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ title, value, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-header">
        {icon}
        <p>{title}</p>
      </div>
      <h3>{value}</h3>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="card">
      <h4>{title}</h4>
      {children}
    </div>
  );
}
