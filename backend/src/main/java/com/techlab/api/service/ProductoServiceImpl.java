package com.techlab.api.service;

import com.techlab.api.dto.ProductoRequest;
import com.techlab.api.dto.ProductoResponse;
import com.techlab.api.exception.ResourceNotFoundException;
import com.techlab.api.exception.StockInsuficienteException;
import com.techlab.api.mapper.ProductoMapper;
import com.techlab.api.model.Producto;
import com.techlab.api.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductoServiceImpl implements IProductoService {

    private final ProductoRepository repository;
    private final ProductoFactory productoFactory;

    @Override
    public ProductoResponse create(ProductoRequest request) {
        Producto producto = productoFactory.crear(
                request.getTipo(), request.getNombre(), request.getPrecio(), request.getCantidadEnStock());
        return ProductoMapper.toResponse(repository.save(producto));
    }

    @Override
    public List<ProductoResponse> findAll() {
        return repository.findAll().stream().map(ProductoMapper::toResponse).toList();
    }

    @Override
    public ProductoResponse findById(Long id) {
        Producto producto = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con id: " + id));
        return ProductoMapper.toResponse(producto);
    }

    @Override
    public ProductoResponse update(Long id, ProductoRequest request) {
        Producto producto = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con id: " + id));
        producto.setNombre(request.getNombre());
        producto.setPrecio(request.getPrecio());
        producto.setCantidadEnStock(request.getCantidadEnStock());
        return ProductoMapper.toResponse(repository.save(producto));
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Producto no encontrado con id: " + id);
        }
        repository.deleteById(id);
    }

    @Override
    @Transactional
    public Producto validarYReducirStock(Long productoId, int cantidad) {
        Producto producto = repository.findById(productoId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Producto no encontrado con id: " + productoId));

        if (cantidad > producto.getCantidadEnStock()) {
            throw new StockInsuficienteException(
                    "Stock insuficiente para " + producto.getNombre()
                    + ". Disponible: " + producto.getCantidadEnStock()
                    + ", Solicitado: " + cantidad);
        }

        producto.setCantidadEnStock(producto.getCantidadEnStock() - cantidad);
        return repository.save(producto);
    }
}
