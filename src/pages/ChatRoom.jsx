import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { socket } from "../socket";

const ChatRoom = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const name_user = localStorage.getItem("username");
  const [joined, setJoined] = useState(null);
  const [leave, setleave] = useState(null);
  const [light, setLight] = useState(true);
  const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
  
  const [allMessages, setAllMessages] = useState([]);

  // login check
  useEffect(() => {
    if (!localStorage.getItem("user_id")) {
      navigate("/login");
    }
  }, []);

  // load old messages
  useEffect(() => {
    setLoading(true)
    async function getMessages() {
      try {
        const res = await fetch(
          `https://chat-app-backend-v8ey.onrender.com/api/user/messages/${id}`,
        );

        const data = await res.json();

        const formatted = data.map((msg) => ({
          user_id: msg.sender._id,
          name: msg.sender.name,
          avatar: msg.sender.avatar,
          message: msg.text,
        }));

        setAllMessages(formatted);
      } catch (err) {
        console.error(err);
      }
      setLoading(false)
    }

    getMessages();
  }, [id]);
  //socket

  useEffect(() => {
    // join room
    socket.emit("join_room", {
      name: name_user,
      roomId: id,
    });

    // handel user join
    const handleJoined = (e) => {
      console.log(e.name, "joined");
      setJoined(e.name);
      setTimeout(() => {
        setJoined(null);
      }, 2000);
    };

    // handel user left
    const handleUserLeft = (name) => {
      console.log(name, "left");
      setleave(name);
      setTimeout(() => {
        setleave(null);
      }, 2000);
    };

    // handel meaagse
    const handleMessage = (data) => {
      setAllMessages((prev) => [
        ...prev,
        {
          user_id: data.user_id,
          name: data.name,
          avatar: data.avatar,
          message: data.message || data.text,
        },
      ]);
    };

    socket.on("Joined", handleJoined);
    socket.on("user_left", handleUserLeft);
    socket.on("receive_message", handleMessage);

    return () => {
      socket.off("Joined", handleJoined);
      socket.off("user_left", handleUserLeft);
      socket.off("receive_message", handleMessage);
    };
  }, [id]);
  // save message to DB
  async function saveMessage(data) {
    try {
      await fetch("https://chat-app-backend-v8ey.onrender.com/api/user/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomId: id,
          sender: data.user_id,
          text: data.message,
        }),
      });
    } catch (error) {
      console.error(error);
    }
  }
  //toggle theme
  function toggleTheme() {
    setLight(light?false:true);
  }

  // send message
  function send() {
    if (!message.trim()) return;

    const data = {
      roomId: id,
      message,
      name: name_user,
      user_id: localStorage.getItem("user_id"),
      avatar: localStorage.getItem("avatar"),
    };

    socket.emit("send_message", data);

    setAllMessages((prev) => [...prev, data]);

    saveMessage(data);

    setMessage("");
  }
  const handleLeave = () => {
    socket.emit("leave_room");

    setTimeout(() => {
      navigate("/home");
    }, 50);
  };

  return (
    <div className="chatroom-container">
      <div className="chatroom-header">
        <div>
          <h2>💬 Chat Room</h2>
          <p>Room ID: {id}</p>
        </div>
        <button style={{ backgroundColor:"lightblue",border:"none",outline:"none",cursor:"pointer",
          borderRadius:"15px"}} onClick={toggleTheme}>{light ? "Dark" : "Light"}</button>
        <button onClick={handleLeave} className="leave-btn">
          Leave Room
        </button>
      </div>

      <div
        style={{
          backgroundColor: light ? "white" : "black",
        }}
        className="messages-container"
        
      >
         {loading && <div className="loading"></div>}
        {joined && <div className="user_joined ">{joined} Joined....</div>}
        {leave && <div className="user_left">{leave} left....</div>}

        {allMessages.map((msg, index) => {
          const isMe = msg.user_id === localStorage.getItem("user_id");

          return (
            <div
              key={index}
              className={`message-row ${isMe ? "right" : "left"}`}
            >
              {!isMe && (
                <img className="avatar" src={msg.avatar} alt="avatar" />
              )}

              <div className={`message-bubble ${isMe ? "sent" : "received"}`}>
                <span className="sender">{msg.name}</span>
                <p>{msg.message}</p>
              </div>

              {isMe && <img className="avatar" src={msg.avatar} alt="avatar" />}
            </div>
          );
        })}
      </div>

      <div className="input-container">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.code === "Enter") send();
          }}
        />

        <button onClick={send} className="send-btn">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
