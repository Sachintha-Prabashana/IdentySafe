package lk.ijse.backend.controller;

import lk.ijse.backend.dto.DocumentDTO;
import lk.ijse.backend.service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;

    @GetMapping
    public List<DocumentDTO> getDocuments(@AuthenticationPrincipal Jwt jwt) {
        String email = jwt.getClaimAsString("email");
        if (email == null) {
            email = jwt.getSubject();
        }
        
        return documentService.getDocumentsByOwner(email);
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public DocumentDTO uploadDocument(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam("file") MultipartFile file) {

        String email = jwt.getClaimAsString("email");
        if (email == null) email = jwt.getSubject();

        return documentService.uploadDocument(file, email);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteDocument(@AuthenticationPrincipal Jwt jwt, @PathVariable Long id) {
        String email = jwt.getClaimAsString("email");
        if (email == null) email = jwt.getSubject();

        documentService.deleteDocument(id, email);
    }

    @PostMapping("/{id}/share")
    public DocumentDTO shareDocument(@AuthenticationPrincipal Jwt jwt, @PathVariable Long id) {
        String email = jwt.getClaimAsString("email");
        if (email == null) email = jwt.getSubject();

        return documentService.shareDocument(id, email);
    }

    @GetMapping("/shared")
    public List<DocumentDTO> getSharedDocuments(@AuthenticationPrincipal Jwt jwt) {
        String email = jwt.getClaimAsString("email");
        if (email == null) email = jwt.getSubject();

        return documentService.getSharedDocuments(email);
    }

    @DeleteMapping("/{id}/share")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void revokeShare(@AuthenticationPrincipal Jwt jwt, @PathVariable Long id) {
        String email = jwt.getClaimAsString("email");
        if (email == null) email = jwt.getSubject();

        documentService.revokeShare(id, email);
    }

    @GetMapping("/public/share/{token}")
    public DocumentDTO getPublicDocument(@PathVariable String token) {
        return documentService.getDocumentByShareToken(token);
    }
}
