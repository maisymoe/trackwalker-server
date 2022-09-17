// Imports
import { Server } from "socket.io";

// Init the server
const io = new Server<ClientToServerEvents, ServerToClientEvents>(4040, {});

// Validate usernames
io.use((socket, next) => {
    if (!socket.handshake.auth.username) return next(new Error("Invalid username"));
    next();
})

// Listen for connections
io.on("connection", (socket) => {
    socket.on("updatePosition", (pos: Position) => {
        socket.broadcast.emit("playerUpdate", socket.handshake.auth.username, pos);
    });
});