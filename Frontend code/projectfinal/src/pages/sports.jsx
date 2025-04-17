import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { useNavigate } from "react-router";

function Sports() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/login/games")
      .then((res) => {
        setGames(res.data?.result?.data);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <Loader />;

  return (
    <div
      style={{
        backgroundColor: "#2E4053",
        opacity: "0.9",
        minHeight: "100vh",
        padding: "20px",
        color: "white",
      }}
    >
      <div>
        <h1 style={{ textAlign: "center", marginTop: "10px" }}>
          Sports
        </h1>
        <div style={{ textAlign: "right", marginBottom: "20px" }}>
          <button
            className="btn btn-danger"
            style={{
              padding: "10px 20px",
              borderRadius: "10rem",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => navigate("/home/addsports")}
          >
            Add Sport
          </button>
        </div>

        {games.length > 0 ? (
          games.map((game) => (
            <div className="row mb-3" key={game.id}>
              <div
                className="card"
                style={{
                  backgroundColor: "#a2b7be",
                  borderRadius: "8px",
                  overflow: "hidden",
                  padding: "15px",
                }}
              >
                <div className="card-body d-flex">
                  <img
                    src={game.team_photo_url}
                    alt={`Team${game.id}`}
                    style={{
                      width: "8rem",
                      height: "8rem",
                      marginRight: "1rem",
                      borderRadius: "8px",
                    }}
                  />
                  <div className="d-flex flex-column">
                    <h5 className="card-title">
                      Name of the Game: {game.game_name}
                    </h5>
                    <p className="card-text">
                      Game at the Location: {game.location_name}
                    </p>
                    <h6>Team Members</h6>
                    {game?.team_members?.map((detail, idx) => (
                      <span key={idx} className="card-text">
                        {detail}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No games available.</p>
        )}
      </div>
    </div>
  );
}

export default Sports;
