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

// Make an array to store active players in
const players = new Array<Player>();

// Listen for connections
io.on("connection", (socket: TrackwalkerSocket) => {
    // Assign the socket a player object
    socket.player = {
        username: socket.handshake.auth.username,   
        id: socket.id,
    };

    // Add the player to the players array, log that they connected, and broadcast their presence
    players.push(socket.player);
    console.log(`${socket.player.username} (${socket.id}) connected`);
    socket.broadcast.emit("playerJoin", socket.player);

    // When a socket disconnects, remove them from the players array, log that they disconnected and broadcast that they left
    socket.on("disconnect", () => {
        players.splice(players.indexOf(socket.player!));
        console.log(`${socket.player!.username} (${socket.id}) disconnected`);
        socket.broadcast.emit("playerLeave", socket.player!);
    });

    // If socket asks for player list, hand it over
    socket.on("requestPlayers", () => socket.emit("recievePlayers", players));

    // Broadcast any events from the socket to other sockets
    socket.on("positionUpdate", (pos: Position) => socket.broadcast.emit("playerPositionUpdate", socket.player!, pos));
    socket.on("animationUpdate", (anim: string, direction: Vec2) => socket.broadcast.emit("playerAnimationUpdate", socket.player!, anim, direction));
});

// Log the port
console.log(`Listening on ${port}`);