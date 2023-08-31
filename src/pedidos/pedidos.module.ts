import { Module } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { PedidosGateway } from './pedidos.gateway';
import { PedidoController } from './pedido.controller';

@Module({
  providers: [PedidosGateway, PedidosService],
  controllers: [PedidoController],
})
export class PedidosModule {}
