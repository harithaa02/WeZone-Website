import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import token from "../../token";

function Addpolls() {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState(["", ""]);
    const navigate = useNavigate();

    const handleOptionChange = (index, value) => {
        const newOptions = [...answer];
        newOptions[index] = value;
        setAnswer(newOptions);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!question.trim() || answer.filter(option => option.trim()).length < 2) {
            alert("Please provide a valid question and at least two options.");
            return;
        }

        const tokenKey = token.getUser();
        const auth_key = tokenKey?.response?.auth_token;

        const headers = {
            Authorization: auth_key,
            'Content-Type': 'application/json',
        };

        const data = {
            question: question,
            answer: answer.filter(option => option.trim()),
        };

        axios.post('http://127.0.0.1:8000/login/poll/create', data, { headers })
            .then(res => {
                console.log(res.data);
                navigate('/home/polls');
            })
            .catch(err => {
                console.error("Error creating poll:", err);
            });
    };

    return (
        <div className="container "   style={{
            backgroundColor: "#f0f8ff",
            minHeight: "100vh",
            padding: "20px",
          }}>
            <div className="card "  style={{
          maxWidth: "600px",
          margin: "0 auto",
          padding: "20px",
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          marginTop: "50px",
        }}>
                <div className="card-body">
                    <h2 className="card-title mb-4 text-center">Add a New Poll</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="question" className="form-label">Question:</label>
                            <input
                                className="form-control"
                                type="text"
                                id="question"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                placeholder="Enter your poll question"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Options:</label>
                            {answer.map((option, index) => (
                                <div key={index} className="input-group mb-2">
                                    <input
                                        className="form-control"
                                        type="text"
                                        value={option}
                                        onChange={(e) => handleOptionChange(index, e.target.value)}
                                        placeholder={`Option ${index + 1}`}
                                    />
                                </div>
                            ))}
                            <button
                                type="button"
                                className="btn btn-outline-secondary w-100"
                                onClick={() => setAnswer([...answer, ""])}
                            >
                                
                                +
                            </button>
                        </div>

                        <button type="submit" className="btn btn-primary w-100 mt-3">
                            Submit Poll
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Addpolls;
