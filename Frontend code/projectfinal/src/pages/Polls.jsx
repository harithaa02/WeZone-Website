import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import token from "../token";

function Polls() {
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [votedPolls, setVotedPolls] = useState({}); 
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get("http://127.0.0.1:8000/login/polls")
            .then((res) => {
                console.log("API Response:", res.data);
                if (res.data && res.data.polls) {
                    setPolls(res.data.polls);
                } else {
                    setPolls([]);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching polls:", err);
                setError("Failed to fetch polls.");
                setLoading(false);
            });
    }, []);

    const handleVote = (pollId) => {
        const selectedOptionId = selectedOptions[pollId];
        if (!selectedOptionId) {
            alert("Please select an option to vote.");
            return;
        }

        setLoading(true);

        const tokenKey = token.getUser();
        const auth_key = tokenKey?.response?.auth_token;
        const headers = {
            Authorization: auth_key,
            'Content-Type': 'application/json',
        };

        const requestData = {
            answer_id: selectedOptionId,
        };

        axios
            .post(
                "http://127.0.0.1:8000/login/vote",
                requestData,
                { headers }
            )
            .then((res) => {
                console.log("Vote submitted successfully:", res.data);
                alert("Your vote has been recorded!");
                setVotedPolls({
                    ...votedPolls,
                    [pollId]: true, 
                });
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error submitting vote:", err);
                alert("Failed to submit your vote. Please try again.");
                setLoading(false);
            });
    };

    const handleOptionChange = (event) => {
        const { name, value } = event.target;
        const pollId = name.split('-')[1];
        setSelectedOptions({
            ...selectedOptions,
            [pollId]: value,
        });
    };

    if (loading) {
        return <p>Loading polls...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div style={{ backgroundColor: "#2E4053", opacity: "0.9", minHeight: "100vh", padding: "20px", color: "white" }}>
            <h1 style={{ textAlign: "center", marginTop: "20px"  }}>Polls</h1>
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
                    onClick={() => navigate("/home/addpolls")}
                >
                    Add Poll
                </button>
            </div>
            <br />
            {polls.length > 0 ? (
                polls.map((poll) => (
                    <div className="row mb-3" key={poll.poll_id}>
                        <div className="card" style={{ width: "100%" ,backgroundColor:"#a2b7be"}}>
                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title">Question: {poll.question}</h5>
                                {poll.options && poll.options.length > 0 && (
                                    <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
                                        {poll.options.map((option) => (
                                            <li key={option.answer_id}>
                                                <input
                                                    type="radio"
                                                    id={`poll-${poll.poll_id}-option-${option.answer_id}`}
                                                    name={`poll-${poll.poll_id}`}
                                                    value={option.answer_id}
                                                    onChange={handleOptionChange}
                                                    disabled={votedPolls[poll.poll_id]} 
                                                />
                                                <label htmlFor={`poll-${poll.poll_id}-option-${option.answer_id}`}>
                                                    {option.answer}
                                                </label>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                <button
                                    className="btn btn-outline-primary"
                                    onClick={() => handleVote(poll.poll_id)}
                                    disabled={votedPolls[poll.poll_id]} 
                                >
                                    {votedPolls[poll.poll_id] ? "Already Voted" : "Submit Vote"}
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p>No polls available.</p>
            )}
        </div>
    );
}

export default Polls;
