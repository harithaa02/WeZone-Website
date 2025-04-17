import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";

function Birthdays() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/login/users/birthday")
      .then((response) => {
        const data = response.data.result?.data || [];
        setList(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const today = new Date();
  const todayMonthDay = `${today.getMonth() + 1}-${today.getDate()}`;

  const presentEvent = [];
  const upcomingEvent = [];

  list.forEach((person) => {
    const dob = new Date(person.date_of_birth);
    const dobMonthDay = `${dob.getMonth() + 1}-${dob.getDate()}`;
    if (dobMonthDay === todayMonthDay) {
      presentEvent.push(person);
    } else {
      upcomingEvent.push(person);
    }
  });

  upcomingEvent.sort((a, b) => {
    const dobA = new Date(a.date_of_birth);
    const dobB = new Date(b.date_of_birth);
    return dobA - dobB;
  });

  if (loading) return <Loader />;
  if (error) return <div>Error loading data: {error}</div>;

  const BirthdayCard = ({ user, isToday }) => (
    <div className="col-12 mb-4">
      <div
        className="card"
        style={{
          width: "100%",
          borderRadius: "20px",
          backgroundColor: "#a2b7be",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="card-body d-flex">
          <img
            src={user.photo_image_url}
            alt={`${user.full_name}'s avatar`}
            className="rounded me-4"
            style={{ width: "128px", height: "128px", objectFit: "cover" }}
          />
          <div className="d-flex flex-column">
            <h5 className="card-title h4 mb-2">
              {user.full_name} {isToday && "'s Birthday"}
            </h5>
            <p className="card-text"style={{color:"black"}}>{user.email}</p>
            <p className="card-text">Birthday: {user.date_of_birth}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container " style={{ backgroundColor: "#2E4053",opacity:"0.9"}}>
      <div className="mb-4">
        <h1 style={{ fontWeight: "bold", textAlign: "center", color: "#fff" }}>
          Birthdays
        </h1>
        <p
          className="display-4 mb-2"
          style={{
            position: "sticky",
            marginTop: "20px",
            backgroundColor: "#34495E",
            color: "#fff",
            padding: "10px",
            
          }}
        >
          Today's Birthdays
        </p>
        {presentEvent.length > 0 ? (
          <div className="row">
            {presentEvent.map((user) => (
              <BirthdayCard key={user.uuid} user={user} isToday />
            ))}
          </div>
        ) : (
          <p style={{color:"white"}}>No birthdays today!</p>
        )}
      </div>
      <div className="mb-4 mt-5">
        <p
          className="display-4 mb-2"
          style={{
            backgroundColor: "#5D6D7E",
            color: "#fff",
            padding: "10px",
           
          }}
        >
          Birthdays
        </p>
        {upcomingEvent.length > 0 ? (
          <div className="row">
            {upcomingEvent.map((user) => (
              <BirthdayCard key={user.uuid} user={user} />
            ))}
          </div>
        ) : (
          <p className="text-muted">No upcoming birthdays!</p>
        )}
      </div>
    </div>
  );
}

export default Birthdays;
