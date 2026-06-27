package com.techlab.api.mapper;

import com.techlab.api.dto.PedidoResponse;
import com.techlab.api.model.Pedido;

import java.util.List;

public class PedidoMapper {

    private PedidoMapper() {
    }

    public static PedidoResponse toResponse(Pedido pedido) {
        List<PedidoResponse.LineaPedidoResponse> lineasResp = pedido.getLineas().stream().map(lp -> {
            double subtotal = lp.getProducto().getPrecio() * lp.getCantidadSolicitada();
            return new PedidoResponse.LineaPedidoResponse(
                    lp.getId(),
                    lp.getProducto().getId(),
                    lp.getProducto().getNombre(),
                    lp.getProducto().getPrecio(),
                    lp.getCantidadSolicitada(),
                    subtotal
            );
        }).toList();

        double total = lineasResp.stream().mapToDouble(PedidoResponse.LineaPedidoResponse::getSubtotal).sum();
        return new PedidoResponse(pedido.getId(), lineasResp, total);
    }
}
