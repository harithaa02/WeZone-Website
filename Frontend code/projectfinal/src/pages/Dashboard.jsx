import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import "../components/dashboard.css";
function Dashboard() {
  const [list, setList] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [presentShootouts, setPresentShootouts] = useState([]);
  const [presentArticles, setPresentArticles] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [birthdayRes, sessionsRes, shootoutsRes, articlesRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/login/users/birthday"),
          axios.get("http://127.0.0.1:8000/login/sessions"),
          axios.get("http://127.0.0.1:8000/login/shootouts"),
          axios.get("http://127.0.0.1:8000/login/articles"),
        ]);
        setList(birthdayRes.data?.result?.data || []);
        setSessions(sessionsRes.data?.result?.data || []);
        setPresentShootouts(shootoutsRes.data?.result?.data || []);
        setPresentArticles(articlesRes.data?.result?.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const today = new Date().toDateString();
  const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime()); 
  };
  const isToday = (dateString) => {
    if (!isValidDate(dateString)) {
      console.warn("Invalid date:", dateString);
      return false; 
    }
    const date = new Date(dateString);
    return date.toDateString() === today;
  };
  const presentBirthDays = list.filter(person => isToday(person.date_of_birth));
  const presentSessions = sessions.filter(session => isToday(session.event_date));
  const todayArticles = presentArticles.filter(article => {
    if (!isValidDate(article.created_at)) {
      console.warn("Invalid article date:", article.created_at);
      return false; 
    }
    return isToday(article.created_at);
  });
  const todayShootouts = presentShootouts.filter(shootout => isToday(shootout.event_date));
  console.log('Today Articles:', todayArticles); 
  if (loading) return <Loader />;
  const Card = ({ title, details, imgSrc }) => (
    <div className="row mb-3">
      <div className="card" style={{ width: "100%", borderRadius: "20px", backgroundColor: "#a2b7be", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
        <div className="card-body d-flex">
          {imgSrc && <img src={imgSrc} alt={title} style={{ width: "8rem", height: "8rem", marginRight: "1rem" }} />}
          <div className="d-flex flex-column">
            <h5 className="card-title">{title}</h5>
            <ul>
              {details.map((detail, idx) => (
                <li key={idx} className="card-text">{detail}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <div className="container" style={{ backgroundColor: "#2E4053", opacity: "0.9", minHeight: "100vh", padding: "20px", color: "white" }}>
      <h1 style={{ textAlign: "center", color: "white" }}>Dashboard</h1>
      <h3 style={{ color: "white" }}>Today's Shootouts</h3>
      {todayShootouts.length > 0 ? todayShootouts.map((shootout, idx) => (
        <Card 
          key={idx} 
          title={`Shootout by ${shootout.name}`} 
          details={[
            `Category: ${shootout.category}`,
            `Reason: ${shootout.reason}`,
            `Date: ${shootout.event_date}`
          ]}
        />
      )) : <p>No shootouts today</p>}
      <h3 style={{ color: "white" }}>Today's Birthdays</h3>
      {presentBirthDays.length > 0 ? presentBirthDays.map(user => (
        <Card 
          key={user.uuid} 
          title={`${user.full_name}'s Birthday`} 
          details={[
            user.email,
            `Birthday: ${user.date_of_birth}`
          ]}
          imgSrc={user.photo_image_url} 
        />
      )) : <p>No birthdays today</p>}
      <h3 style={{ color: "white" }}>Today's Sessions</h3>
      {presentSessions.length > 0 ? presentSessions.map((session, idx) => (
        <Card 
          key={idx} 
          title={`Session by ${session.name}`} 
          details={[
            `Topic: ${session.title}`,
            `Date: ${session.event_date}`
          ]}
          imgSrc={session.file_upload_url} 
        />
      )) : <p>No sessions today</p>}
      <h3 style={{ color: "white" }}>Today's Articles</h3>
      {todayArticles.length > 0 ? todayArticles.map((article, idx) => (
        <Card 
          key={idx} 
          title={`Article by ${article.name}`} 
          details={[
            `Title: ${article.title}`,
            `Content: ${article.article_content}`,
            `Published on: ${article.created_at}` 
          ]}
        />
      )) : <p>No articles today</p>}
    </div>
  );
}
export default Dashboard;
