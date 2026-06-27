package com.techlab.api.service;

import com.techlab.api.dto.PedidoRequest;
import com.techlab.api.dto.PedidoResponse;
import com.techlab.api.mapper.PedidoMapper;
import com.techlab.api.model.LineaPedido;
import com.techlab.api.model.Pedido;
import com.techlab.api.model.Producto;
import com.techlab.api.repository.PedidoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PedidoServiceImpl implements IPedidoService {

    private final PedidoRepository pedidoRepository;
    private final IProductoService productoService;

    @Override
    @Transactional
    public PedidoResponse create(PedidoRequest request) {
        Pedido pedido = new Pedido();

        for (PedidoRequest.LineaPedidoRequest lineaReq : request.getLineas()) {
            Producto producto = productoService.validarYReducirStock(
                    lineaReq.getProductoId(), lineaReq.getCantidad());

            LineaPedido linea = new LineaPedido();
            linea.setPedido(pedido);
            linea.setProducto(producto);
            linea.setCantidadSolicitada(lineaReq.getCantidad());
            pedido.getLineas().add(linea);
        }

        return PedidoMapper.toResponse(pedidoRepository.save(pedido));
    }

    @Override
    public List<PedidoResponse> findAll() {
        List<Pedido> pedidos = pedidoRepository.findAll();
        return pedidos.stream().map(PedidoMapper::toResponse).toList();
    }

    @Override
    public PedidoResponse findById(Long id) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new com.techlab.api.exception.ResourceNotFoundException(
                        "Pedido no encontrado con id: " + id));
        return PedidoMapper.toResponse(pedido);
    }
}
