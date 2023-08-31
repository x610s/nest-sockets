import { Socket } from "socket.io";

export interface ClientPool {
  socketId: string;
  id_drogueria: string;
  client: Socket;
}
