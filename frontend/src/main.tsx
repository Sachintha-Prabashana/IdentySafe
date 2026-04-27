import { StrictMode } from 'react'
import { AuthProvider } from "@asgardeo/auth-react";
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css'
import App from './App.tsx'

const config = {
    signInRedirectURL: "http://localhost:3000",
    signOutRedirectURL: "http://localhost:3000",
    clientID: "Mp2Cr7tW3Nvoj6PcQYz65jOivfsa",
    baseUrl: "https://api.asgardeo.io/t/sporg",
    scope: ["openid", "profile", "email"],
    storage: "localStorage"
};

// Create a client
const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
    <AuthProvider config={config as any}>
        <QueryClientProvider client={queryClient}>
            <StrictMode>
                <App />
            </StrictMode>
        </QueryClientProvider>
    </AuthProvider>,
)
