import { StrictMode } from 'react'
import { AuthProvider } from "@asgardeo/auth-react";
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const config = {
    signInRedirectURL: "http://localhost:5173",
    signOutRedirectURL: "http://localhost:5173",
    clientID: "Mp2Cr7tW3Nvoj6PcQYz65jOivfsa",
    baseUrl: "https://api.asgardeo.io/t/sporg",
    scope: ["openid", "profile"]
};

createRoot(document.getElementById('root')!).render(
    <AuthProvider config={config}>
        <StrictMode>
            <App />
        </StrictMode>
    </AuthProvider>,
)
