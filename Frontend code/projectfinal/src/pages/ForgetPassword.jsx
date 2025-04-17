import React, { useState, useRef } from 'react';
import { Box, Modal, TextField } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router';

const ForgetPassword = () => {
  const [errors, setErrors] = useState({});
  const [obj, setObj] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();
  


  const validateInputs = () => {
    let validationErrors = {};

    if (!obj.email?.trim()) {
      validationErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(obj.email)) {
      validationErrors.email = 'Please enter a valid email address.';
    }

    if (otpSent) {
      if (!obj.password?.trim()) {
        validationErrors.password = 'Password is required.';
      } else if (obj.password.length < 8) {
        validationErrors.password = 'Password must be at least 8 characters long.';
      }

      if (!obj.confirmPassword?.trim()) {
        validationErrors.confirmPassword = 'Confirm password is required.';
      } else if (obj.confirmPassword !== obj.password) {
        validationErrors.confirmPassword = 'Passwords do not match.';
      }
    }

    return validationErrors;
  };

  const handleObj = (e) => {
    const { name, value } = e.target;
    setObj({...obj,[name]: value});
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    const validationErrors = validateInputs();
    
    if (validationErrors.email) {
      setErrors({ email: validationErrors.email });
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/login/forgot-password', { 
        email: obj.email 
      });
      if (response.status === 200) {
        setOtpSent(true);
        setIsOpen(true);
        alert('OTP sent successfully');
      }
    } catch (error) {
      alert('Error sending OTP: ' + (error.response?.data?.message || 'Please try again'));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateInputs();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/login/reset-password', {
        email: obj.email,
        otp: obj.otp,
        new_password: obj.password,
        confirm_password:obj.confirmPassword
      });
      
      if (response.status === 200) {
        alert('Password reset successful');
        navigate('/');
      }
    } catch (error) {
      alert('Error resetting password: ' + (error.response?.data?.message || 'Please try again'));
    }
  };

  return (
    <div className="container">
      <h2>Forget Password</h2>
      <form onSubmit={handleSendOtp}>
        <div className="form-group">
          <label>Email Address:</label>
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="Enter Email..."
            onChange={handleObj}
            value={obj.email || ''}
          />
          {errors.email && <p className="text-danger">{errors.email}</p>}
        </div>

        <button type="submit" className="mt-4">
          Send OTP
        </button>
      </form>

      <Modal open={isOpen} onClose={() => setIsOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <h4 className="text-center mb-4">Reset Password</h4>
          <div className="form-group mb-3">
            <label className="mb-2">Email Address:</label>
            <TextField
              fullWidth
              name="email"
              type="email"
              value={obj.email || ''}
              disabled
            />
          </div>
          <div className="form-group mb-3">
            <label className="mb-2">Enter OTP:</label>
            <TextField
              fullWidth
              type="otp"
              name="otp"
              placeholder="Enter otp..."
              onChange={handleObj}
              value={obj.otp || ''}
              error={!!errors.otp}
              helperText={errors.otp}
            />
            {errors.otp && (
              <p className="text-danger text-center mt-1">{errors.otp}</p>
            )}
          </div>

          <div className="form-group mb-3">
            <label className="mb-2">New Password:</label>
            <TextField
              fullWidth
              type="password"
              name="password"
              placeholder="Enter Password..."
              onChange={handleObj}
              value={obj.password || ''}
              error={!!errors.password}
              helperText={errors.password}
            />
          </div>

          <div className="form-group mb-3">
            <label className="mb-2">Confirm Password:</label>
            <TextField
              fullWidth
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password..."
              onChange={handleObj}
              value={obj.confirmPassword || ''}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
            />
          </div>

          <button onClick={handleSubmit} className="w-full mt-2">
            Reset Password
          </button>
        </Box>
      </Modal>
    </div>
  );
};

export default ForgetPassword;