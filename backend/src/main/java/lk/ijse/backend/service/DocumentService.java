package lk.ijse.backend.service;

import lk.ijse.backend.dto.DocumentDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface DocumentService {
    List<DocumentDTO> getDocumentsByOwner(String email);

    DocumentDTO uploadDocument(MultipartFile file, String email);

    void deleteDocument(Long id, String ownerEmail);

    /**
     * Generates or refreshes a unique share token for a document.
     */
    DocumentDTO shareDocument(Long id, String ownerEmail);

    /**
     * Retrieves all documents with active share tokens for a specific owner.
     */
    List<DocumentDTO> getSharedDocuments(String email);

    /**
     * Removes the share token from a document, revoking public access.
     */
    void revokeShare(Long id, String ownerEmail);

    /**
     * Publicly retrieves a document by its share token.
     */
    DocumentDTO getDocumentByShareToken(String token);
}
