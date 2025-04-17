import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import token from "../token";

function Admin() {
  const navigate = useNavigate();
  const [birthday, setBirthday] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [shootout, setShootout] = useState([]);
  const [games, setGames] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTable, setActiveTable] = useState("birthday");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://127.0.0.1:8000/login/dashboard");
        if (res.data) {
          if (Array.isArray(res.data.sessions)) {
            setSessions(res.data.sessions);
          } else {
            setError("Sessions data is missing or invalid");
          }

          if (Array.isArray(res.data.birthday_users)) {
            setBirthday(res.data.birthday_users);
          } else {
            setError("Birthday users data is missing or invalid");
          }

          if (Array.isArray(res.data?.shootouts?.data)) {
            setShootout(res.data?.shootouts?.data);
          } else {
            setError("Shootout data is missing or invalid");
          }

          if (Array.isArray(res.data.games)) {
            setGames(res.data.games);
          } else {
            setError("Games data is missing or invalid");
          }
        } else {
          setError("Invalid response structure");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteBirthday = async (id) => {
    const tokenKey = token.getUser();
    const auth_key = tokenKey?.response?.auth_token;
    if (!auth_key) {
      setError("Authorization token is missing.");
      return;
    }
    const headers = {
      Authorization: auth_key,
    };
    try {
      await axios
        .delete(`http://192.168.0.170:8008/login/delete/${id}`, { headers })
        .then((res) => console.log(res))
        .catch((err) => console.log("Error", err));
      setBirthday(birthday.filter((user) => user.id !== id));
    } catch (err) {
      console.error("Error deleting birthday user:", err);
      setError("Failed to delete user. Please try again later.");
    }
  };

  const deletesession = async (id) => {
    try {
      const response = await axios.delete(`http://103.60.212.74:8080/login/delete/${id}`);
      if (response.status === 200) {
        setSessions(sessions.filter((session) => session.id !== id));
      } else {
        setError("Failed to delete session. Please try again later.");
      }
    } catch (err) {
      console.error("Error deleting session:", err);
      setError("Failed to delete session. Please try again later.");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1
        style={{
          textAlign: "center",
          marginTop: "20px",
          position: "sticky",
          top: "0",
          zIndex: "1",
          backgroundColor: "white",
        }}
      >
        Admin Dashboard
      </h1>
      <div style={{ textAlign: "right", margin: "20px" }}>
        <button
          className="btn btn-danger"
          style={{
            padding: "10px 20px",
            borderRadius: "10rem",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => navigate("/home/Addadmin")}
        >
          Add Admin
        </button>
      </div>
      <div style={{ textAlign: "left", margin: "20px", alignItems: "center", justifyContent: "center" }}>
  <nav className="navbar navbar-expand-lg navbar-light bg-light">
    <div className="container-fluid">
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTable === "birthday" ? "active" : ""}`}
              onClick={() => setActiveTable("birthday")}
            >
              Birthday
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTable === "sessions" ? "active" : ""}`}
              onClick={() => setActiveTable("sessions")}
            >
              Sessions
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTable === "shootouts" ? "active" : ""}`}
              onClick={() => setActiveTable("shootouts")}
            >
              Shootouts
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {activeTable === "birthday" && (
        <>
          <h1>Employees Data</h1>
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Email</th>
                <th>Date of Birth</th>
                <th>Photo</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {birthday.length > 0 ? (
                birthday.map((item, index) => (
                  <tr key={index}>
                    <td>{item.full_name}</td>
                    <td>{item.email}</td>
                    <td>{item.date_of_birth}</td>
                    <td>
                      <img
                        src={item.photo_image_url}
                        alt="Profile"
                        style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                      />
                    </td>
                    <td>
                      <button className="btn btn-warning" onClick={() => handleDeleteBirthday(item.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No users available</td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}

      {activeTable === "sessions" && (
        <>
          <h1>Sessions</h1>
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Feature ID</th>
                <th>Feature Name</th>
                <th>Name</th>
                <th>Title</th>
                <th>Event Date</th>
                <th>File Upload URL</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sessions.length > 0 ? (
                sessions.map((item, index) => (
                  <tr key={index}>
                    <td>{item.feature_id}</td>
                    <td>{item.feature_name}</td>
                    <td>{item.name}</td>
                    <td>{item.title}</td>
                    <td>{item.event_date}</td>
                    <td>{item.file_upload_url}</td>
                    <td>
                      <button className="btn btn-warning" onClick={() => deletesession(item.feature_id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">No sessions available</td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}

      {activeTable === "shootouts" && (
        <>
          <h1>Shootouts</h1>
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Feature Name</th>
                <th>Reason</th>
                <th>Category</th>
                <th>CreatedAt</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {shootout.length > 0 ? (
                shootout.map((item, index) => (
                  <tr key={index}>
                    <td>{item.feature_name}</td>
                    <td>{item.reason}</td>
                    <td>{item.category}</td>
                    <td>{item.created_at}</td>
                    <td>
                      <button className="btn btn-warning">Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No shootouts available</td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default Admin;
