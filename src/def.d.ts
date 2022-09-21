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

    interface Vec2 {
        x: number;
        y: number;
    }
    
    interface ClientToServerEvents {
        positionUpdate: (pos: Position) => void;
        animationUpdate: (anim: string, direction: Vec2) => void;
        requestPlayers: () => void;
    }
    
    interface ServerToClientEvents {
        playerJoin: (player: Player) => void;
        playerLeave: (player: Player) => void;
        playerPositionUpdate: (player: Player, pos: Position) => void;
        playerAnimationUpdate: (player: Player, anim: string, direction: Vec2) => void;
        recievePlayers: (players: Player[]) => void;
    }
}