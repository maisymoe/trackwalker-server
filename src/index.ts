// Imports
import { Server } from "socket.io";

// Variables
const port = parseInt(process.env.TRACKWALKER_PORT as string) || 4040;

// Init the server
const io = new Server<ClientToServerEvents, ServerToClientEvents>(port, {});

// Validate usernames
io.use((socket, next) => {
    if (!socket.handshake.auth.username) return next(new Error("Invalid username"));
    next();
})

// Listen for connections
io.on("connection", (socket: TrackwalkerSocket) => {
    socket.player = {
        username: socket.handshake.auth.username,   
        id: socket.id,
    };

    socket.broadcast.emit("playerJoin", socket.player);
    socket.on("disconnect", () => socket.broadcast.emit("playerLeave", socket.player!));
    socket.on("positionUpdate", (pos: Position) => socket.broadcast.emit("playerUpdate", socket.player!, pos));
});

console.log(`Listening on ${port}`);