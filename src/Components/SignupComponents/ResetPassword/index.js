// ResetPassword.js
import React, { useState } from 'react';
import InputIncomponent from '../../Common/Input';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './style.css';
import Header from '../../Common/Header';

function ResetPassword() {
    const [email, setEmail] = useState("");
    const [resetSent, setResetSent] = useState(false);
    const auth = getAuth();
    const navigate = useNavigate();

    const handleReset = async () => {
        try {
            const trimmedEmail = email.trim();

            if (!trimmedEmail) {
                console.error("Email is empty");
                return;
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(trimmedEmail)) {
                console.error("Invalid email format");
                return;
            }

            await sendPasswordResetEmail(auth, trimmedEmail);
            setResetSent(true);
            alert("Email Sent Check Box")
            navigate("/");
        } catch (error) {
            console.error("Error in sending Email", error);
        }
    }

    return (
        <div className='input-wrapper'>
            <Header/>
            {resetSent ? (
                <p>Reset email sent. Check your inbox</p>
            ) : (
                <div className='reset-flex'>
                    <InputIncomponent
                        value={email}
                        setState={setEmail}
                        placeholder="Enter Your Email"
                        type="email"
                        className="custom-input"
                    />
                    <button onClick={handleReset}>Reset Password</button>
                </div>
            )}
        </div>
    );
}

export default ResetPassword;
