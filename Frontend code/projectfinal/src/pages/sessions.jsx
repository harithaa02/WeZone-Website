import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Loader from "../components/Loader";
import token from "../token"; // Ensure token is imported
// import "../components/session.css";

const Session = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tokenKey = token.getUser();
    const auth_key = tokenKey?.response?.auth_token;

    if (!auth_key) {
      console.error("Authentication token missing.");
      return;
    }

    axios
      .get("http://127.0.0.1:8000/login/sessions", {
        headers: { Authorization: `Bearer ${auth_key}` }, // Fixed Authorization header
      })
      .then((response) => {
        setSessions(response.data.result.data);
      })
      .catch((error) => {
        console.error("Error fetching sessions:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const today = new Date();
  const todayMonthDay = `${today.getMonth() + 1}-${today.getDate()}`;

  const presentSessions = [];
  const upcomingSessions = [];

  sessions.forEach((session) => {
    const eventDate = new Date(session.event_date);
    const eventMonthDay = `${eventDate.getMonth() + 1}-${eventDate.getDate()}`;

    if (eventMonthDay === todayMonthDay) {
      presentSessions.push(session);
    } else {
      upcomingSessions.push(session);
    }
  });

  upcomingSessions.sort((a, b) => new Date(a.event_date) - new Date(b.event_date));

  if (loading) return <Loader />;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 style={{ textAlign: "center", marginTop: "20px", position: "sticky", top: "0", zIndex: "1" }}>
          Sessions
        </h1>
        <div style={{ textAlign: "right" }}>
          <button
            className="btn btn-danger"
            style={{
              padding: "10px 20px",
              borderRadius: "10rem",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "end",
            }}
            onClick={() => navigate("/home/addsession")}
          >
            Add Session
          </button>
        </div>
      </div>

      <div className="mb-8">
        <p className="text-xl font-semibold mb-4" style={{ fontSize: "30px" }}>
          <b>Today's Sessions</b>
        </p>
        {presentSessions.length > 0 ? (
          presentSessions.map((session, index) => (
            <SessionCard key={index} session={session} />
          ))
        ) : (
          <p className="text-gray-500">No sessions today!</p>
        )}
      </div>

      <div>
        <p className="text-xl font-semibold mb-4" style={{ fontSize: "30px" }}>
          <b>Upcoming Sessions</b>
        </p>
        {upcomingSessions.length > 0 ? (
          upcomingSessions.map((session, index) => (
            <SessionCard key={index} session={session} />
          ))
        ) : (
          <p className="text-gray-500">No upcoming sessions!</p>
        )}
      </div>
    </div>
  );
};

const SessionCard = ({ session }) => {
  const handleDownload = () => {
    if (session.file_upload_url) {
      const link = document.createElement("a");
      link.href = session.file_upload_url;
      link.download = session.file_upload_url.split("/").pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert("No file available for download.");
    }
  };

  return (
    <div className="card mb-4" style={{ backgroundColor: "lightgray" }}>
      <div className="p-4 d-flex align-items-start space-x-4">
        {session.file_upload_url && (
          <img
            src={session.file_upload_url}
            alt={`${session.name}'s profile`} // Fixed incorrect JSX string interpolation
            className="img"
            style={{ width: "8rem", height: "8rem", marginRight: "1rem" }}
          />
        )}
        <div className="flex-1">
          <p className="text" style={{ color: "blue" }}>
            Name: {session.name}
          </p>
          <div className="d-flex flex-wrap gap-4">
            <div className="d-flex align-items-center">
              <span className="text-gray-500 mr-2">Topic:</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{session.title}</span>
            </div>
            <div className="d-flex align-items-center">
              <span className="text-gray-500 mr-2">Date:</span>
              <span className="text-gray-700">{session.event_date}</span>
            </div>
          </div>
          <div className="mt-4">
            {session.file_upload_url && (
              <div className="mt-2">
                <button
                  onClick={handleDownload}
                  className="btn btn-primary"
                  style={{
                    padding: "8px 16px",
                    borderRadius: "5px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                  }}
                >
                  Download File
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Session;
