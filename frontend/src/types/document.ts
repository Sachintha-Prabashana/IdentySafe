export interface Document {
    id: number;
    fileName: string;
    fileType: string;
    fileUrl: string;
    ownerEmail: string;
    uploadedAt: string;
    shareToken?: string;
    expiryDate?: string;
}
