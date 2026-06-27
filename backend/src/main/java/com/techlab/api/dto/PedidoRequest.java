package com.techlab.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Datos para crear un nuevo pedido")
public class PedidoRequest {

    @NotEmpty
    @Valid
    @Schema(description = "Lista de productos solicitados en el pedido (mínimo 1 elemento)")
    private List<LineaPedidoRequest> lineas;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Línea de producto dentro de un pedido")
    public static class LineaPedidoRequest {

        @NotNull
        @Schema(description = "ID del producto a pedir", example = "1")
        private Long productoId;

        @Min(1)
        @Schema(description = "Cantidad solicitada del producto (mínimo 1)", example = "2", minimum = "1")
        private int cantidad;
    }
}
