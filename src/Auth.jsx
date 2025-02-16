import { useEffect, useState } from "react";
import HttpService from "./config/HttpService";
import { PROFILE, SIGNIN, SINGUP } from "./config/ApiPath";
import { useNavigate } from "react-router";

export const Auth = () => {
    const navigate = useNavigate()
    const [loader, setLoader] = useState(false)
    const [isSignUp, setIsSignUp] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        let newErrors = {};
        if (isSignUp && name.trim() === "") newErrors.name = "Name is required";
        if (email.trim() === "") newErrors.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Invalid email format";
        if (password.trim() === "") newErrors.password = "Password is required";
        else if (password.length < 6) newErrors.password = "Password must be at least 6 characters long";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        if (isSignUp) {
            await CreateAccountHandler();
        } else {
            await LoginHandler();
        }
    };

    const LoginHandler = async () => {
        setLoader(true)
        HttpService.post(SIGNIN, { email: email, password: password }).then((response) => {
            setLoader(false)
            setName("")
            setEmail("")
            setPassword("")
            navigate("/", { replace: true, state: { ...response.data.data } })
        }).catch((error) => {
            setLoader(false)
            console.log(error.response.data.message)
        })
    };

    const CreateAccountHandler = async () => {
        setLoader(true)
        HttpService.post(SINGUP, { name: name, email: email, password: password }).then((response) => {
            setLoader(false)
            setName("")
            setEmail("")
            setPassword("")
            setIsSignUp(false)
        }).catch((error) => {
            setLoader(false)
            console.log(error.response.data.message)
        })
    };

    useEffect(() => {
        HttpService.get(PROFILE).then((response) => {
            navigate("/", { replace: true, state: { ...response.data.data } })
        }).catch(() => {

        })
    }, [])

    return (
        <div style={{ display: "flex", height: "97.7vh", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            {!isSignUp ? (
                <div style={{ gap: 10, display: "flex", width: "20%", flexDirection: "column", justifyContent: "center" }}>
                    <h3>Login</h3>
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    {errors.email && <span style={{ color: "black" }}>{errors.email}</span>}
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    {errors.password && <span style={{ color: "black" }}>{errors.password}</span>}
                    <button onClick={handleSubmit}>Login</button>
                    <button onClick={() => {
                        setName("")
                        setEmail("")
                        setPassword("")
                        setIsSignUp(true)
                    }}>Create new account</button>
                </div>
            ) : (
                <div style={{ gap: 10, display: "flex", width: "20%", flexDirection: "column", justifyContent: "center" }}>
                    <h3>Register your account</h3>
                    <input type="text" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} />
                    {errors.name && <span style={{ color: "black" }}>{errors.name}</span>}
                    <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    {errors.email && <span style={{ color: "black" }}>{errors.email}</span>}
                    <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    {errors.password && <span style={{ color: "black" }}>{errors.password}</span>}
                    <button onClick={handleSubmit}>Register now</button>
                    <button onClick={() => {
                        setName("")
                        setEmail("")
                        setPassword("")
                        setIsSignUp(false)
                    }}>I already have an account</button>
                </div>
            )}
        </div>
    );
};
