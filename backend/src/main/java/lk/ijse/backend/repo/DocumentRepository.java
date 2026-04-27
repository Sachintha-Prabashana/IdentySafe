package lk.ijse.backend.repo;

import lk.ijse.backend.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findAllByOwnerEmail(String ownerEmail);
    Optional<Document> findByShareToken(String shareToken);
    List<Document> findAllByOwnerEmailAndShareTokenIsNotNull(String ownerEmail);
}
