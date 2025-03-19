import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";

const API_BASE_URL = "http://127.0.0.1:8000";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 p-4">
        <nav className="bg-blue-600 text-white p-4 flex justify-between">
          <Link to="/" className="font-bold">Home</Link>
          <div>
            <Link to="/login" className="mr-4">Login</Link>
            <Link to="/register">Register</Link>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/upload" element={<UploadMedia />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
};

const Home = () => {
  const [media, setMedia] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/media`).then(response => {
      setMedia(response.data);
    }).catch(error => console.error(error));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Media Gallery</h1>
      <div className="grid grid-cols-3 gap-4 mt-4">
        {media.map(item => (
          <div key={item.id} className="bg-white p-4 shadow rounded">
            <img src={item.url} alt={item.title} className="w-full h-48 object-cover" />
            <h2 className="text-lg font-semibold mt-2">{item.title}</h2>
            <p className="text-sm text-gray-600">{item.caption}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/register`, { username, password, role });
      toast.success("Registration successful");
    } catch (error) {
      toast.error("Registration failed");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow rounded">
      <h2 className="text-xl font-bold">Register</h2>
      <form onSubmit={handleSubmit}>
        <input className="w-full p-2 border rounded mt-2" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input className="w-full p-2 border rounded mt-2" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="w-full bg-blue-600 text-white p-2 mt-4 rounded">Register</button>
      </form>
    </div>
  );
};

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, { username, password });
      localStorage.setItem("token", response.data.access_token);
      toast.success("Login successful");
      window.location.href = "/upload";
    } catch (error) {
      toast.error("Login failed");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow rounded">
      <h2 className="text-xl font-bold">Login</h2>
      <form onSubmit={handleSubmit}>
        <input className="w-full p-2 border rounded mt-2" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input className="w-full p-2 border rounded mt-2" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="w-full bg-blue-600 text-white p-2 mt-4 rounded">Login</button>
      </form>
    </div>
  );
};

const UploadMedia = () => {
  const [file, setFile] = useState(null);
  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_BASE_URL}/upload`, formData, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("File uploaded");
    } catch (error) {
      toast.error("Upload failed");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow rounded">
      <h2 className="text-xl font-bold">Upload Media</h2>
      <input type="file" className="w-full p-2 border rounded mt-2" onChange={(e) => setFile(e.target.files[0])} />
      <button className="w-full bg-blue-600 text-white p-2 mt-4 rounded" onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default App;
