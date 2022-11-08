import { Server } from "socket.io";
import msgPack from "socket.io-msgpack-parser";

// Init the server with custom port support
const port = parseInt(process.env.TRACKWALKER_PORT as string) || 4040;
const io = new Server(port, {
    parser: msgPack,
});

// Middleware to validate username
io.use((socket, next) => {
    if (
        !socket.handshake.auth.username ||
        (socket.handshake.auth.username &&
            socket.handshake.auth.username === "")
    )
        return next(new Error("Invalid username!"));
        next();
});

// Store active players in a map
const activePlayers = new Map<string, Player>;

// Listen for connections
io.on("connection", (socket: TrackwalkerSocket) => {
    // Assign a player to the socket
    socket.player = {
        username: socket.handshake.auth.username,
        id: socket.id,
    };

    activePlayers.set(socket.player.id, socket.player);
    console.log(`${socket.player!.username} (${socket.id}) connected!`);
    socket.broadcast.emit("join", socket.player);

    socket.on("disconnect", () => {
        activePlayers.delete(socket.player!.id);
        console.log(`${socket.player!.username} (${socket.id}) disconnected...`);
        socket.broadcast.emit("leave", socket.player);
    });

    socket.on("requestPlayers", () => socket.emit("recievePlayers", activePlayers));
});

console.log(`Server listening on port ${port}`);