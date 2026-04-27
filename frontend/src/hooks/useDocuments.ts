import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentService } from '../service/documentService';
import { toast } from 'react-hot-toast';

export const useDocuments = (enabled: boolean = true) => {
    return useQuery({
        queryKey: ['documents'],
        queryFn: () => documentService.getDocuments(),
        staleTime: 1000 * 60,
        enabled,
    });
};

export const useUploadDocument = (onSuccessCallback?: () => void) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (file: File) => documentService.uploadDocument(file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['documents'] });
            toast.success('Document secured in vault successfully!');
            onSuccessCallback?.();
        },
        onError: (error: any) => {
            console.error('Upload failed:', error);
            toast.error('Failed to upload document.');
        },
    });
};

export const useDeleteDocument = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => documentService.deleteDocument(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['documents'] });
            toast.success('Document removed from vault.');
        },
        onError: (error: any) => {
            console.error('Deletion failed:', error);
            toast.error('Failed to delete document.');
        },
    });
};

export const useShareDocument = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => documentService.shareDocument(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['documents'] });
            queryClient.invalidateQueries({ queryKey: ['shared-documents'] });
            toast.success('Share link generated!');
        },
        onError: (error: any) => {
            console.error('Sharing failed:', error);
            toast.error('Failed to generate share link.');
        },
    });
};

export const useSharedDocuments = (enabled: boolean = true) => {
    return useQuery({
        queryKey: ['shared-documents'],
        queryFn: () => documentService.getSharedDocuments(),
        staleTime: 1000 * 60,
        enabled,
    });
};

export const useRevokeShare = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => documentService.revokeShare(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['documents'] });
            queryClient.invalidateQueries({ queryKey: ['shared-documents'] });
            toast.success('Share link revoked.');
        },
        onError: (error: any) => {
            console.error('Revoke failed:', error);
            toast.error('Failed to revoke share link.');
        },
    });
};

export const usePublicDocument = (token: string | undefined) => {
    return useQuery({
        queryKey: ['public-document', token],
        queryFn: () => documentService.getPublicDocument(token!),
        enabled: !!token,
        retry: false,
    });
};
