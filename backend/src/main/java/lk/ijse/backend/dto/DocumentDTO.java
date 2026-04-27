package lk.ijse.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DocumentDTO {
    private Long id;
    private String fileName;
    private String fileType;
    private String fileUrl;
    private String ownerEmail;
    private LocalDateTime uploadedAt;
    private String shareToken;
    private LocalDateTime expiryDate;
}
