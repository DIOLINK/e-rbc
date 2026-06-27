package com.techlab.api.mapper;

import com.techlab.api.dto.ProductoResponse;
import com.techlab.api.model.Producto;

public class ProductoMapper {

    private ProductoMapper() {
    }

    public static ProductoResponse toResponse(Producto p) {
        return new ProductoResponse(
                p.getId(),
                p.getTipo(),
                p.getNombre(),
                p.getPrecio(),
                p.getCantidadEnStock()
        );
    }
}
