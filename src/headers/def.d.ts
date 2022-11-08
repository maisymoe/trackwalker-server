import { Socket } from "socket.io";

declare global {
    interface Player {
        username: string;
        id: string;
    }

    interface TrackwalkerSocket extends Socket {
        player?: Player;
    }
}
