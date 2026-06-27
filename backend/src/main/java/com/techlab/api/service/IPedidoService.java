package com.techlab.api.service;

import com.techlab.api.dto.PedidoRequest;
import com.techlab.api.dto.PedidoResponse;

import java.util.List;

public interface IPedidoService {
    PedidoResponse create(PedidoRequest request);
    List<PedidoResponse> findAll();
    PedidoResponse findById(Long id);
}
