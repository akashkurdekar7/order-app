import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        shopName: "",
        personName: "",
        aadhaar: "",
        location: "",
        phone: "",
        password: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleRegister = async () => {
        try {
            const res = await API.post("https://order-backend-c5em.onrender.com/api/auth/register", form);
            console.log(res.data);
            alert("Registered successfully");
            navigate("/");
        } catch (error) {
            console.log(error.response.data);
            alert(error.response.data.message);
        }
    };

    return (
        <div>
            <h2>Register</h2>

            <input name="shopName" placeholder="Shop Name" onChange={handleChange} />
            <input name="personName" placeholder="Person Name" onChange={handleChange} />
            <input name="aadhaar" placeholder="Aadhaar Number" onChange={handleChange} />
            <input name="location" placeholder="Location" onChange={handleChange} />
            <input name="phone" placeholder="Phone" onChange={handleChange} />
            <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
            />

            <button onClick={handleRegister}>Register</button>
        </div>
    );
}

export default Register;