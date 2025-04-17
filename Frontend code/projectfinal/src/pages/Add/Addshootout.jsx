import { useState } from "react";
import axios from "axios";
import token from "../../token";
import Loader from "../../components/Loader";
import { useNavigate } from "react-router";

function Addshootout() {
  const [name, setName] = useState("");
  const [reason, setReason] = useState("");
  const [category, setCategory] = useState("");
  const[date,setdate]=useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const nav = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true);

    const user = token.getUser();
    const auth_key = user?.response?.auth_token;
    const headers = {
      Authorization: auth_key,
      "Content-Type": "application/json",
    };

    const payload = {
      name: name,
      reason: reason,
      category: category,
      event_date: date,
    };

    axios
      .post("http://127.0.0.1:8000/login/shootouts", payload, { headers })
      .then((res) => {
        setLoading(false);
        console.log(res.data);
        nav("/home/shootout");
      })
      .catch((err) => {
        setLoading(false);
        setError("Error occurred. Please try again.");
        console.error(err);
      });
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4">
        <h1 className="text-center text-primary mb-4">Add Shootouts</h1>
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="form-group">
            <label htmlFor="name" className="font-weight-bold">Full Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              className="form-control"
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter full name"
              required
            />
          </div>

          <div className="form-group mt-3">
            <label htmlFor="reason" className="font-weight-bold">Reason:</label>
            <input
              type="text"
              id="reason"
              value={reason}
              className="form-control"
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason"
              required
            />
          </div>

          <div className="form-group mt-3">
            <label htmlFor="category" className="font-weight-bold">Category:</label>
            <select
              id="category"
              value={category}
              className="form-control"
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              <option value="work">Work</option>
              <option value="sports">Sports</option>
              <option value="sessions">Sessions</option>
              
            </select>
          </div>

          <div className="form-group mt-3">
            <label htmlFor="date" className="font-weight-bold">Date:</label>
            <input
              type="date"
              id="date"
              value={date}
              className="form-control"
              onChange={(e) => setdate(e.target.value)}
              required  
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary btn-block mt-4"
          >
            Submit
          </button>

          {error && (
            <div className="alert alert-danger mt-3" role="alert">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default Addshootout;