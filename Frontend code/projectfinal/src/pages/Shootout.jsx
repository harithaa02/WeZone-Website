import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Loader from "../components/Loader"; 



function Shootout() {
  const [shootout, setShootout] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/login/shootouts')
      .then((res) => {
        setShootout(res.data?.result?.data); 
        console.log(res.data?.result?.data);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch shootouts. Please try again later.");
      })
      .finally(() => setLoading(false)); 
  }, []);


  if (loading) return <Loader />
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div>
      <h1 style={{textAlign:"center",marginTop:"10px"}}>Shootout</h1>
      
   
      <div style={{ textAlign: "right", marginBottom: "20px" }}>
        <button
          className="btn btn-danger"
          style={{
            padding: "10px 20px",
            borderRadius: "10rem",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => navigate("/home/addshootout")} 
        >
          Add Shootout
        </button>
      </div>

      {shootout.length > 0 ? (
        shootout.map((feature, idx) => (
          <div className="row mb-3" key={idx}>
            <div className="card" style={{ backgroundColor:"lightgray", width: "100%" }}>
              <div className="card-body d-flex flex-column">
                <p className="card-title" style={{color:"blue"}}> Name: {feature.name}</p> 
                <p className="card-text">Reason: {feature.category}</p>
                <p className="card-text">Category: {feature.reason}</p>
                <p className="card-text">Date: {feature.event_date}</p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No features available</p>
      )}
    </div>
  );
}

export default Shootout;