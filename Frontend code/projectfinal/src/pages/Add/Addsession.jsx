import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";
import Loader from "../../components/Loader";
import token from "../../token";

function Addsessions() {
  const [obj, setObj] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const navigate = useNavigate();

  const handleObj = (e) => {
    const { name, value } = e.target;
    setObj({ ...obj, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setObj({ ...obj, file });
      setFileName(file.name);
      setErrors((prevErrors) => ({ ...prevErrors, file: null }));
    } else {
      setObj({ ...obj, file: null });
      setFileName("");
    }
  };

  const validateInputs = () => {
    let validationErrors = {};
    if (!obj.name || obj.name.trim() === "") {
      validationErrors.name = "Presenter name is required.";
    }
    if (!obj.date) {
      validationErrors.date = "Date is required.";
    }
    if (!obj.title || obj.title.trim() === "") {
      validationErrors.topic = "Topic is required.";
    }
    if (!obj.file) {
      validationErrors.file = "File is required.";
    }
    return validationErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validateInputs();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    const tokenKey = token.getUser();
    const auth_key = tokenKey?.response?.auth_token;

    const formData = new FormData();
    formData.append('name', obj.name);
    formData.append('title', obj.title);
    formData.append('file_upload_url', obj.file);
    formData.append('event_date', obj.date);

    try {
      const headers = {
        Authorization: auth_key,
        "Content-Type": "multipart/form-data",
      };
      const response = await axios.post(
        "http://127.0.0.1:8000/login/sessions",
        formData,
        { headers }
      );
      console.log(response.data);
      navigate("/home/sessions");
    } catch (error) {
      setErrors({ api: "Failed to submit session. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <>
      <h1 style={{ textAlign: "center", marginTop: "20px", position: "sticky", zIndex: "1" }}>Add Session</h1>
      <div className="container">
        <label htmlFor="">Presenter Name:</label>
        <input
          type="text"
          name="name"
          className="form-control"
          placeholder="Enter name"
          onChange={handleObj}
          value={obj.name}
        />
        {errors.name && <p className="text-danger">{errors.name}</p>}

        <label htmlFor="">Date:</label>
        <input
          type="date"
          name="date"
          className="form-control"
          onChange={handleObj}
          value={obj.date}
        />
        {errors.date && <p className="text-danger">{errors.date}</p>}

        <label htmlFor="">Topic:</label>
        <input
          type="text"
          name="title" 
          className="form-control"
          placeholder="Enter Topic"
          onChange={handleObj}
          value={obj.title}
        />
        {errors.topic && <p className="text-danger">{errors.topic}</p>}

        <label htmlFor="">Upload File:</label>
        <input
          type="file"
          name="file"
          className="form-control"
          onChange={handleFileChange}
       
        />
        {errors.file && <p className="text-danger">{errors.file}</p>}

        {fileName && (
          <div>
            <p>Selected file: {fileName}</p>
          </div>
        )}

        {errors.api && <p className="text-danger">{errors.api}</p>}

        <button className="btn btn-primary w-100" onClick={handleSubmit}>
          Add Session
        </button>
      </div>
    </>
  );
}

export default Addsessions;