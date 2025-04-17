import axios from "axios";
import { useState } from "react";
import token from "../../token";
import { useNavigate } from "react-router";

function Addsports() {
  const [obj, setObj] = useState({});
  const [array, setArray] = useState([]);
  const [photo, setPhoto] = useState("");
  const nav = useNavigate();

  const handleObj = (e) => {
    const { name, value } = e.target;
    setObj({ ...obj, [name]: value });
  };

  const handlePhoto = (e) => {
    const { name, files } = e.target;
    setPhoto({ ...photo, [name]: files[0] });
  };

  const handleArray = () => {
    setArray([...array, obj]);
    const tokenKey = token.getUser();
    const auth_key = tokenKey?.response?.auth_token;
    const formData = new FormData();
    formData.append("team_members", obj.team_members);
    formData.append("game_name", obj.game_name);
    formData.append("location_name", obj.location_name);
    formData.append("team_photo_url", photo.team_photo_url);

    const headers = {
      Authorization: auth_key,
      "Content-Type": "multipart/form-data",
    };

    axios
      .post("http://127.0.0.1:8000/login/games", formData, { headers })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });

    setObj({});
    nav("/home/sports");
  };

  return (
    <div
      style={{
        backgroundColor: "#f0f8ff",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <h1 className="text-center">Add Sport</h1>
      <div
        className="container"
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          padding: "20px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          backgroundColor: "white",
          marginTop: "50px",
        }}
      >
        <div className="form-group mb-3">
          <label htmlFor="team_members">Team Members</label>
          <input
            type="text"
            id="team_members"
            placeholder="Team Members"
            name="team_members"
            onChange={handleObj}
            className="form-control"
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="game_name">Sport</label>
          <input
            type="text"
            id="game_name"
            placeholder="Enter Sport"
            name="game_name"
            onChange={handleObj}
            className="form-control"
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="location_name">Location Name</label>
          <input
            type="text"
            id="location_name"
            placeholder="Location "
            name="location_name"
            onChange={handleObj}
            className="form-control"
          />
        </div>
        <div className="form-group mb-4">
          <label htmlFor="team_photo_url">Team Photo</label>
          <input
            type="file"
            id="team_photo_url"
            name="team_photo_url"
            onChange={handlePhoto}
            className="form-control"
          />
        </div>
        <button className="btn btn-primary w-100" onClick={handleArray}>
          Submit
        </button>
      </div>
    </div>
  );
}

export default Addsports;
