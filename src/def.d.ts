interface Position {
    x: number;
    y: number;
    z: number;
    roomName: string;
}

interface ClientToServerEvents {
    updatePosition: (pos: Position) => void;    
}

interface ServerToClientEvents {
    playerUpdate: (playerName: string, pos: Position) => void;
}