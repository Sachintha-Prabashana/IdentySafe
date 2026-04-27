import api from './api';
import type { Document } from '../types/document';

/**
 * Service package to handle all document-related API interactions.
 * This encapsulates API logic and keeps components clean.
 */
class DocumentService {
    private readonly baseUrl = '/documents';

    /**
     * Fetches all documents owned by the authenticated user.
     */
    async getDocuments(): Promise<Document[]> {
        const response = await api.get<Document[]>(this.baseUrl);
        return response.data;
    }

    /**
     * Uploads a new document to the secure vault.
     */
    async uploadDocument(file: File): Promise<Document> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post<Document>(`${this.baseUrl}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }

    /**
     * Permanently deletes a document from the vault.
     */
    async deleteDocument(id: number): Promise<void> {
        await api.delete(`${this.baseUrl}/${id}`);
    }

    /**
     * Generates a shareable token for a document.
     */
    async shareDocument(id: number): Promise<Document> {
        const response = await api.post<Document>(`${this.baseUrl}/${id}/share`);
        return response.data;
    }

    /**
     * Fetches all documents that have active share links.
     */
    async getSharedDocuments(): Promise<Document[]> {
        const response = await api.get<Document[]>(`${this.baseUrl}/shared`);
        return response.data;
    }

    /**
     * Revokes a share link, making the document private again.
     */
    async revokeShare(id: number): Promise<void> {
        await api.delete(`${this.baseUrl}/${id}/share`);
    }

    /**
     * Publicly fetches a document using its share token.
     */
    async getPublicDocument(token: string): Promise<Document> {
        const response = await api.get<Document>(`${this.baseUrl}/public/share/${token}`);
        return response.data;
    }

    /**
     * Downloads a file from the vault by fetching it as a blob.
     * This ensures the file is downloaded regardless of browser viewing capabilities.
     */
    async downloadFile(url: string, fileName: string): Promise<void> {
        const response = await api.get(url, {
            responseType: 'blob',
        });
        
        const blob = new Blob([response.data], { type: response.headers['content-type'] as string });
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
    }
}

export const documentService = new DocumentService();
