import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Updateprofile = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("Professor");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("Royal Mint");
  const [avatar, setAvatar] = useState("https://static.vecteezy.com/system/resources/thumbnails/002/098/203/small/silver-tabby-cat-sitting-on-green-background-free-photo.jpg");

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

 
  useEffect(() => {
    if (!localStorage.getItem("user_id")) {
      navigate("/login");
    }
  }, []);

  const handleUpdate = async () => {
    try {
      setLoading(true);

      const res = await fetch("https://chat-app-backend-v8ey.onrender.com/api/user/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: localStorage.getItem("user_id"),
          name,
          email,
          password,
          avatar,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMsg("Profile updated successfully..");
        setTimeout(() => {
          setMsg("");
          navigate("/home");
        }, 1500);
      } else {
        setMsg(data.message || "Update failed");
        setTimeout(() => setMsg(""), 3000);
      }

    } catch (err) {
      console.log(err);
      setMsg("Server error");
      setTimeout(() => setMsg(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="update-container">

      {msg && <div className="popup_msg">{msg}</div>}

      <h2 style={{ textAlign: "center", color: "white", padding: "10px" }}>
        Update Profile
      </h2>

      <div className="up_form">

        <input
          type="text"
          className="update_box"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          className="update_box"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="text"
          className="update_box"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="text"
          className="update_box"
          placeholder="Avatar URL"
          value={avatar}
          onChange={(e) => setAvatar(e.target.value)}
        />
      </div>

      <div className="buttons_div">

        <button
          className="update_box_button"
          onClick={handleUpdate}
          disabled={loading}
        >
          {loading ? "Updating..." : "Save Changes"}
        </button>

        <button
          className="update_box_button"
          onClick={() => navigate("/home")}
          disabled={loading}
        >
          Go Home 🏠
        </button>

      </div>
    </div>
  );
};

export default Updateprofile;