package com.techlab.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Representación de un pedido en las respuestas de la API")
public class PedidoResponse {

    @Schema(description = "Identificador único del pedido", example = "1")
    private Long id;

    @Schema(description = "Líneas de producto que componen el pedido")
    private List<LineaPedidoResponse> lineas;

    @Schema(description = "Total del pedido (suma de subtotales)", example = "3600")
    private double total;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Línea de producto dentro de un pedido con subtotal calculado")
    public static class LineaPedidoResponse {

        @Schema(description = "Identificador único de la línea de pedido", example = "1")
        private Long id;

        @Schema(description = "ID del producto asociado", example = "1")
        private Long productoId;

        @Schema(description = "Nombre del producto", example = "Coca-Cola")
        private String productoNombre;

        @Schema(description = "Precio unitario al momento del pedido", example = "1000")
        private double precioUnitario;

        @Schema(description = "Cantidad solicitada del producto", example = "2")
        private int cantidad;

        @Schema(description = "Subtotal de la línea (precioUnitario * cantidad)", example = "2000")
        private double subtotal;
    }
}
