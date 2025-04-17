import axios from "axios";
import { useState } from "react";
import token from "../../token";
import { useNavigate } from "react-router";

function Addadmin() {
    const [obj, setObj] = useState({
        name: "",
        email: "",
        date: "",
        designation: "",
        hobbies: "",
        password: "",
        img: null
    });
    const nav = useNavigate();

    const handleObj = (e) => {
        const { name, value } = e.target;
        setObj({ ...obj, [name]: value });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files[0] && !["jpg", "png", "jpeg"].includes(files[0].type.split("/")[1])) {
            alert("Please select an image file (jpg, png, jpeg).");
        }
        setObj({ ...obj, [name]: files[0] });
    };

    const handleSubmit = () => {
        const tokenKey = token.getUser();
        const auth_key = tokenKey?.response?.auth_token;
        const headers = {
            Authorization: auth_key,
            'Content-Type': 'multipart/form-data'
        };

        const formData = new FormData();
        formData.append('full_name', obj.name);
        formData.append('email', obj.email);
        formData.append('password', obj.password);
        formData.append('designation', obj.designation);
        formData.append('hobbies', obj.hobbies);
        formData.append('date_of_birth', obj.date);
        formData.append('photo_image_url', obj.img);

        axios
            .post('http://127.0.0.1:8000/login/create', formData, { headers: headers })
            .then(res => {
                setObj({
                    name: "",
                    email: "",
                    date: "",
                    designation: "",
                    hobbies: "",
                    password: "",
                    img: null
                });
            })
            .catch(err => console.log(err));
        nav('/home/admin');
    };

    return (
        <div className="container " style={{   backgroundColor: "#f0f8ff",
            minHeight: "100vh",
            padding: "20px"}}>
            <h1 className="text-center ">Add Admin</h1>
            <div className="card p-4">
                <div className="mb">
                    <label className="form-label">Full Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={obj.name}
                        className="form-control"
                        placeholder="Enter your full name.."
                        onChange={handleObj}
                    />
                </div>

                <div className="mb">
                    <label className="form-label">Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={obj.email}
                        className="form-control"
                        placeholder="Enter your email.."
                        onChange={handleObj}
                    />
                </div>

                <div className="mb">
                    <label className="form-label">Date of Birth:</label>
                    <input
                        type="date"
                        name="date"
                        value={obj.date}
                        className="form-control"
                        onChange={handleObj}
                    />
                </div>

                <div className="mb">
                    <label className="form-label">Designation:</label>
                    <input
                        type="text"
                        name="designation"
                        value={obj.designation}
                        className="form-control"
                        placeholder="Enter your designation.."
                        onChange={handleObj}
                    />
                </div>

                <div className="mb">
                    <label className="form-label">Hobbies:</label>
                    <input
                        type="text"
                        name="hobbies"
                        value={obj.hobbies}
                        className="form-control"
                        placeholder="Enter your hobbies.."
                        onChange={handleObj}
                    />
                </div>

                <div className="mb">
                    <label className="form-label">Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={obj.password}
                        className="form-control"
                        placeholder="Enter your password.."
                        onChange={handleObj}
                    />
                </div>

                <div className="mb">
                    <label className="form-label">Profile Image:</label>
                    <input
                        type="file"
                        name="img"
                        className="form-control"
                        accept="image/jpeg, image/png"
                        onChange={handleFileChange}
                    />
                </div>

                <button onClick={handleSubmit} className="btn btn-primary w-100">
                    Add Admin
                </button>
            </div>
        </div>
    );
}

export default Addadmin;
