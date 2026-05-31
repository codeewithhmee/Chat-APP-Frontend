const roomid = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let room_id = "";
    for (let i = 0; i < 15; i++) {
        room_id += chars[Math.floor(Math.random() * chars.length)];
    }

    return room_id;
};
export default roomid;