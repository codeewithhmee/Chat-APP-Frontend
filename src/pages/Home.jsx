import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import generateRoomId from "../roomid";

const Home = () => {
  const navigate = useNavigate();

  const [roomId, setRoomId] = useState("");
  const [room_id_to_join_room, setroom_id_to_join_room] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [roomname, setRoomname] = useState("");
  const [allRooms, setallRooms] = useState([]);
  const [toast, setToast] = useState("");
  const [name, setName] = useState("");
  const [showNav, setShowNav] = useState(false);
  const [roomSearch, setRoomsearch] = useState("");
  const [avatarSrc, setAvatarSrc] = useState(
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQz8lRrHtGuPtfKWQM8m6lgG58LnQJkgmy35w&s",
  );
  const [showRooms, setShowRooms] = useState(true); 

  useEffect(() => {
    if (!localStorage.getItem("user_id")) navigate("/login");
  }, []);

  useEffect(() => {
    let rooms = JSON.parse(localStorage.getItem("rooms")) || [];
    let uniqueRooms = [];
    for (let room of rooms) {
      if (!uniqueRooms.find((r) => r.roomId === room.roomId)) {
        uniqueRooms.push(room);
      }
    }
    setallRooms(uniqueRooms.reverse());
  }, []);

  useEffect(() => {
    async function requestUser() {
      const res = await fetch("https://chat-app-backend-v8ey.onrender.com/api/user/find", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: localStorage.getItem("user_id") }),
      });
      const data = await res.json();
      setName(data.name);
      setAvatarSrc(data.avatar);
      localStorage.setItem("avatar", data.avatar);
      localStorage.setItem("username", data.name);
    }
    requestUser();
  }, []);

  async function handleCreateRoom(e) {
    e.preventDefault();
    setLoading(true);
    const id = generateRoomId();
    await fetch("https://chat-app-backend-v8ey.onrender.com/api/user/create_room", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roomId: id,
        createdBy: localStorage.getItem("user_id"),
      }),
    });
    setRoomId(id);
    setLoading(false);
  }

  function deleteFun(room_id) {
    let arr = JSON.parse(localStorage.getItem("rooms")) || [];
    let deleted = arr.filter((room) => room.roomId !== room_id);
    localStorage.setItem("rooms", JSON.stringify(deleted));
    setallRooms(deleted);
  }

  function getFullTime() {
    let date = new Date();
    return `Created Time: ${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  }
  //search rooms
 function searchRoom(text) {
  const rooms = JSON.parse(localStorage.getItem("rooms")) || [];

  const filtered = rooms.filter((room) =>
    (room.roomName__ || "")
      .toLowerCase()
      .includes(text.toLowerCase())
  );

  setallRooms(filtered.reverse());
}

  async function handleJoinRoom() {
    setLoading(true);
    try {
      const res = await fetch("https://chat-app-backend-v8ey.onrender.com/api/room/find", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ room_id: room_id_to_join_room }),
      });
      const data = await res.json();
      if (data.success) {
        let rooms = JSON.parse(localStorage.getItem("rooms") || "[]");
        rooms.push({
          roomId: room_id_to_join_room,
          roomName__: roomname || "Anonymous",
          time: getFullTime(),
        });
        localStorage.setItem("rooms", JSON.stringify(rooms));
        navigate(`/chat/${room_id_to_join_room}/!`);
      } else {
        setMsg(data.message);
      }
    } catch (error) {
      setMsg("Something went wrong");
    }
    setLoading(false);
  }
  function hideNavbar() {
  setShowNav((e) => !e);
}

  return (
    <div className="home-container">
      
  <div className={`navMobile ${showNav ? "open" : "closed"}`}>
    <div className="user-info">
      <img src={avatarSrc} alt="avatar" className="avatar" />
      <span className="username" style={{ maxWidth: "60px" }}>
        {name}
      </span>
    </div>

    <button
      className="logout-btn"
      onClick={() => {
        localStorage.removeItem("user_id");
        navigate("/login");
      }}
    >
      Logout
    </button>

    <button
      className="logout-btn"
      style={{ backgroundColor: "blue" }}
      onClick={() => navigate("/update")}
    >
      Update Profile
    </button>
  </div>

      <nav className="navbar">
        <div className="logo">ChatApp 💬</div>
        <div className="nav-right">
          <div className="user-info user-info1">
            <img src={avatarSrc} alt="avatar" className="avatar" />
            <span className="username" style={{ maxWidth: "60px" }}>
              {name}
            </span>
          </div>
          <button
            className="logout-btn logout-btn1"
            onClick={() => {
              localStorage.removeItem("user_id");
              navigate("/login");
            }}
          >
            Logout
          </button>
          <button
            className="logout-btn logout-btn1"
            style={{ backgroundColor: "blue" }}
            onClick={() => navigate("/update")}
          >
            Update Profile
          </button>
            <span className="ham" onClick={hideNavbar}>≡</span>
        </div>
      </nav>

      <div className="main-content">
        <div className="card">
          <p>Create a room or join your friends instantly.</p>

          {roomId && (
            <div className="button-group">
              <div>Room ID: {roomId}</div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(roomId);
                  setToast("Copied!");
                  setTimeout(() => setToast(""), 1500);
                }}
                className="copy_btn"
              >
                Copy
              </button>
            </div>
          )}

          <div className="join-room-section">
            <button className="create-btn" onClick={handleCreateRoom}>
              Create Room
            </button>
            {loading && <div className="loading"></div>}
            {!loading && <div>{msg}</div>}
            <input
              type="text"
              placeholder="Enter Room ID"
              onChange={(e) => setroom_id_to_join_room(e.target.value)}
              value={room_id_to_join_room}
            />
            <input
              type="text"
              placeholder="Enter a room name (optional)"
              onChange={(e) => setRoomname(e.target.value)}
            />
            <button className="join-btn" onClick={handleJoinRoom}>
              Join Room
            </button>
          </div>
        </div>

        {/* 👇 TOGGLED ROOMS SECTION */}
        <div className="all_room">
             <input
                className="room-search"
                value={roomSearch}
                type="text"
                placeholder="🔍 Search Rooms..."
                onChange={(e) => {
                  setRoomsearch(e.target.value);
                  searchRoom(e.target.value);
                }}
              />
          <button
            onClick={() => setShowRooms(!showRooms)}
            className="toggle-btn"
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#1a1a2e",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "15px",
              marginBottom: "10px",
            }}
          >
            <span>🚪 My Rooms ({allRooms.length})</span>
            <div>
           
            </div>
            <span>{showRooms ? "Hide" : "Show"}</span>
          </button>
          

          {showRooms && (
            <>
              <span style={{ fontSize: "12px", color: "gray" }}>
                This info is not in server. Shows rooms joined from this device
                browser.
              </span>

              {allRooms.length === 0 && (
                <p
                  style={{
                    textAlign: "center",
                    color: "gray",
                    marginTop: "10px",
                  }}
                >
                  No rooms yet. Create or join one!
                </p>
              )}

              {allRooms.map((roominfo) => (
                <div key={roominfo.roomId} className="room_card">
                  <div className="room_info">
                    <h3 style={{ textTransform: "uppercase" }}>
                      {roominfo.roomName__}
                    </h3>
                    <p>Room ID: {roominfo.roomId}</p>
                    <span style={{ color: "black" }}>{roominfo.time}</span>
                  </div>
                  <div className="delete_copy_container">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(roominfo.roomId);
                        setToast("Copied!");
                        setTimeout(() => setToast(""), 1500);
                      }}
                      className="copy_btn"
                    >
                      Copy
                    </button>
                    <button
                      onClick={() => deleteFun(roominfo.roomId)}
                      className="copy_btn"
                      style={{ backgroundColor: "red" }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}

          {toast && <div className="toast">{toast}</div>}
        </div>
      </div>
    </div>
  );
};

export default Home;
