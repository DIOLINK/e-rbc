package com.techlab.api.service;

import com.techlab.api.dto.ProductoRequest;
import com.techlab.api.dto.ProductoResponse;
import com.techlab.api.model.Producto;

import java.util.List;

public interface IProductoService {
    ProductoResponse create(ProductoRequest request);
    List<ProductoResponse> findAll();
    ProductoResponse findById(Long id);
    ProductoResponse update(Long id, ProductoRequest request);
    void delete(Long id);
    Producto validarYReducirStock(Long productoId, int cantidad);
}
