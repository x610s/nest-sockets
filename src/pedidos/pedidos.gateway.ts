import { WebSocketGateway } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WebSocketServer } from '@nestjs/websockets';
import {
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ClientPool } from 'src/common/interfaces/clientPool.interface';
import { BehaviorSubject } from 'rxjs';
import { PedidoDTO } from './dto/create-pedido.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  transports: ['websocket'],
  namespace: '',
})
export class PedidosGateway {

  @WebSocketServer() wss: Server;
  private $clientPool = new BehaviorSubject<ClientPool[]>([]);
  private readonly logger = new Logger(PedidosGateway.name);

  constructor() {
    this.$clientPool.subscribe((x) => {
      x.forEach((y) => {
      /*   this.logger.debug(y.id_drogueria); */
      });
    });
  }

  handleDisconnect(client: Socket, ...args: any[]) {
    try {
      const drogueriaId = client.handshake.headers.id_drogueria;
      const id_drogueria = Array.isArray(drogueriaId)
        ? drogueriaId[0]
        : drogueriaId;

      this.$clientPool.next(
        this.$clientPool.value.filter((x) => x.id_drogueria != id_drogueria),
      );
    } catch (error) {
      this.logger.error(error);
    }
  }

  handleConnection(client: Socket, ...args: any[]) {
    try {

      const drogueriaId = client.handshake.headers.id_drogueria;
      console.log(drogueriaId, `puerto ${process.env.PORT || 3000}`);
      
      const socketCliente: ClientPool = {
        id_drogueria: Array.isArray(drogueriaId) ? drogueriaId[0] : drogueriaId,
        socketId: client.id,
        client: client,
      };

      if (
        this.$clientPool.value.filter(
          (x) => x.id_drogueria == socketCliente.id_drogueria,
        )[0]
      ) {
        this.$clientPool.value
          .filter((x) => x.id_drogueria == socketCliente.id_drogueria)[0]
          .client.disconnect();

        //sacalo
        this.$clientPool.next(
          this.$clientPool.value.filter(
            (x) => x.id_drogueria != socketCliente.id_drogueria,
          ),
        );
      }
      //vuelvelo a meter
      this.$clientPool.next([...this.$clientPool.value, socketCliente]);
    } catch (error) {
      this.logger.error(error);
    }
  }

  create(id_drogueria: string, pedido: PedidoDTO[]) {
    const clienteConectado = this.$clientPool.value.filter(
      (x) => x.id_drogueria == id_drogueria,
    )[0];

    if (!clienteConectado) {
      throw new NotFoundException(
        'No hay un cliente conectado para la drogueria con id ' + id_drogueria,
      );
    }
    try {
      this.wss
        .to(clienteConectado.socketId)
        .emit('NEW_ORDER', { pedido: pedido });
    } catch (error) {
      throw new InternalServerErrorException('Error al enviar pedido');
    }
  }

  test() {
    try {
      this.wss.emit('TEST','Hola');
      return {
        hola: 'mundo'
      }  
    } catch (error) {
    
    }
  }
}
