import React from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import '../components/sig.css';
import axios from 'axios';
import token from '../token';
import  giatlogo from '../assets/img/Gait.png';
function SignIn() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        const payload={
            email:data.email,
            password:data.password
        }
        try {
            // const response = await axios.post("http://192.168.0.170:8080/login", JSON.stringify(data));
            const response = await axios.post("http://127.0.0.1:8000/login", JSON.stringify(payload));            
            if (response.status === 200) {
                token.setUser({response:response.data.result,user:data})
                console.log(token.getUser());
                // handleLogin(response.data);
                console.log(response.data);
                navigate('/home/dashboard');
            } else {
                console.log("Errror");
                var errMsg=response.data?.result.error
                alert(errMsg);
            }
        } catch (error) {
            alert("Invalid email or password");
        }
    };

    const handleForgotPassword = () => {
        navigate('/forgot-password');
        token.setForget(true)
    };

    return (
      
        <form id='form' onSubmit={handleSubmit(onSubmit)}>
            <div className="logo">
        <img src={giatlogo} alt="GAIT Logo" />
      </div>
            <h1 style={{fontSize:"1.5rem"}}>Sign In</h1>
            <div >
                {/* <label>Email:</label> */}
                <input
                    className="form-control"
                    placeholder="Enter your email"
                    {...register("email", {
                        required: "Email is required    ",
                        pattern: {
                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                            message: "Enter a valid email address"
                        }
                    })}
                />
                {errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>}
            </div>

            <div>
                {/* <label>Password:</label> */}
                <input
                    className="form-control"
                    placeholder="Enter your password"
                    type="password"
                    {...register("password", {
                        required: "Password is required",
                        minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters long"
                        }
                    })}
                />
                {errors.password && <p style={{ color: "red" }}>{errors.password.message}</p>}
            </div>

            <br />
            <input type="submit" value="Sign In" />
            <div>

                <button
                    type="button"
                    className="forgot-password-link"
                    onClick={handleForgotPassword}
                    style={{ marginTop: "10px", color: "blue", background: "none", border: "none", cursor: "pointer" }}
                >
                    Forgot Password?
                </button>
            </div>

            <br />
        </form>
      
    );
}

export default SignIn;