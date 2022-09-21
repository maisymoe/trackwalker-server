import { Socket } from "socket.io";

declare global {
    interface Position {
        x: number;
        y: number;
        z: number;
        roomName: string;
    }
    
    interface Player {
        username: string;
        id: string;
    }
    
    interface TrackwalkerSocket extends Socket {
        player?: Player;
    }
    
    interface ClientToServerEvents {
        positionUpdate: (pos: Position) => void;
        requestPlayers: () => void;
    }
    
    interface ServerToClientEvents {
        playerJoin: (player: Player) => void;
        playerLeave: (player: Player) => void;
        playerUpdate: (player: Player, pos: Position) => void;
        recievePlayers: (players: Player[]) => void;
    }
}