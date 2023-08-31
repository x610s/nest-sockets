import {
  Body,
  Controller,
  Get,
  HttpCode,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import { PedidosGateway } from './pedidos.gateway';
import { PedidoDTO, PedidoRequest } from './dto/create-pedido.dto';

@Controller('pedido')
export class PedidoController {
  constructor(private readonly PedidosGateway: PedidosGateway) {}
  private readonly logger = new Logger(PedidoController.name);



  @Get('test')
  public Test(
  ) {
    return this.PedidosGateway.test();
  }

  @Post(':id_drogueria')
  @HttpCode(200)
  public EmitirPedido(
    @Param('id_drogueria') id_drogueria: string,
    @Body() products: PedidoRequest,
  ) {
  
    const pedido: PedidoDTO[] = JSON.parse(products.products);
    return this.PedidosGateway.create(id_drogueria, pedido);
  }
}
