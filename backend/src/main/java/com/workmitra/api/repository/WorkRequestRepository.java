package com.workmitra.api.repository;

import com.workmitra.api.entity.WorkRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkRequestRepository extends JpaRepository<WorkRequest, Long> {
    List<WorkRequest> findByCustomerIdOrderByIdDesc(Long customerId);
    List<WorkRequest> findByWorkerIdOrderByIdDesc(Long workerId);
}
