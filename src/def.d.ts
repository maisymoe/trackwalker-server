interface Position {
    x: number;
    y: number;
    z: number;
    roomName: string;
}

interface ClientToServerEvents {
    updatePosition: (pos: Position) => void;    
}