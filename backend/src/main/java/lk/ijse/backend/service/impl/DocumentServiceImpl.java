package lk.ijse.backend.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lk.ijse.backend.dto.DocumentDTO;
import lk.ijse.backend.entity.Document;
import lk.ijse.backend.repo.DocumentRepository;
import lk.ijse.backend.service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DocumentServiceImpl implements DocumentService {

    private final DocumentRepository documentRepository;
    private final ModelMapper modelMapper;
    private final Cloudinary cloudinary;

    @Override
    public List<DocumentDTO> getDocumentsByOwner(String email) {
        return documentRepository.findAllByOwnerEmail(email)
                .stream()
                .map(document -> modelMapper.map(document, DocumentDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public DocumentDTO uploadDocument(MultipartFile file, String email) {
        try {
            // 1. Upload to Cloudinary (auto detects file type like PDF, PNG, etc.)
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap("resource_type", "auto"));

            String fileUrl = (String) uploadResult.get("secure_url");

            // 2. Create Entity and set metadata
            Document document = new Document();
            document.setFileName(file.getOriginalFilename());
            document.setFileType(file.getContentType());
            document.setFileUrl(fileUrl);
            document.setOwnerEmail(email);
            document.setUploadedAt(LocalDateTime.now());
            // Token is now generated only when the user explicitly clicks "Share"
            document.setShareToken(null); 

            // 3. Save to DB
            Document savedDoc = documentRepository.save(document);
            return modelMapper.map(savedDoc, DocumentDTO.class);

        } catch (IOException e) {
            throw new RuntimeException("Could not upload file to Cloudinary: " + e.getMessage());
        }
    }

    @Override
    public void deleteDocument(Long id, String email) {
        documentRepository.findById(id).ifPresent(doc -> {
            if (doc.getOwnerEmail().equals(email)) {
                documentRepository.delete(doc);
            } else {
                throw new RuntimeException("Unauthorized to delete this document");
            }
        });
    }

    @Override
    public DocumentDTO shareDocument(Long id, String ownerEmail) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        if (!document.getOwnerEmail().equals(ownerEmail)) {
            throw new RuntimeException("Unauthorized to share this document");
        }

        // Generate a new secure token if not already shared, or refresh it
        document.setShareToken(UUID.randomUUID().toString());
        // For this demo, let's set a 7-day default expiry
        document.setExpiryDate(LocalDateTime.now().plusDays(7));

        Document updated = documentRepository.save(document);
        return modelMapper.map(updated, DocumentDTO.class);
    }

    @Override
    public List<DocumentDTO> getSharedDocuments(String email) {
        return documentRepository.findAllByOwnerEmailAndShareTokenIsNotNull(email)
                .stream()
                .map(doc -> modelMapper.map(doc, DocumentDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public void revokeShare(Long id, String ownerEmail) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        if (!document.getOwnerEmail().equals(ownerEmail)) {
            throw new RuntimeException("Unauthorized to revoke share for this document");
        }

        document.setShareToken(null);
        document.setExpiryDate(null);
        documentRepository.save(document);
    }

    @Override
    public DocumentDTO getDocumentByShareToken(String token) {
        Document document = documentRepository.findByShareToken(token)
                .orElseThrow(() -> new RuntimeException("Shared link invalid or expired"));

        if (document.getExpiryDate() != null && document.getExpiryDate().isBefore(LocalDateTime.now())) {
            // Cleanup expired token
            document.setShareToken(null);
            document.setExpiryDate(null);
            documentRepository.save(document);
            throw new RuntimeException("Shared link has expired");
        }

        return modelMapper.map(document, DocumentDTO.class);
    }
}
