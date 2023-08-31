export class PedidoRequest {
    products: string;
}
export class PedidoDTO {
    id:                number;
    id_drogueria:      number;
    codigo:            string;
    nombre:            string;
    descripcion:       string;
    precio_divisa:     string;
    precio_bss:        string;
    existencia:        number;
    fecha_vencimiento: Date | null;
    imagen:            string;
    status:            number;
    created_at:        Date;
    updated_at:        Date;
    quantity:          number;
    prevQuantity:      number;
}
