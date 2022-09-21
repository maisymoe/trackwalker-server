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

const players = new Array<Player>();

// Listen for connections
io.on("connection", (socket: TrackwalkerSocket) => {
    socket.player = {
        username: socket.handshake.auth.username,   
        id: socket.id,
    };

    players.push(socket.player);

    // TODO: Duplicate connections bug

    console.log(`${socket.player.username} (${socket.id}) connected`);
    socket.broadcast.emit("playerJoin", socket.player);

    socket.on("disconnect", () => { 
        socket.broadcast.emit("playerLeave", socket.player!);
        players.splice(players.indexOf(socket.player!));
        console.log(`${socket.player!.username} (${socket.id}) disconnected`);
    });

    socket.on("positionUpdate", (pos: Position) => socket.broadcast.emit("playerPositionUpdate", socket.player!, pos));
    socket.on("animationUpdate", (anim: string, direction: Vec2) => socket.broadcast.emit("playerAnimationUpdate", socket.player!, anim, direction));

    socket.on("requestPlayers", () => {
        socket.emit("recievePlayers", players);
    });
});

console.log(`Listening on ${port}`);