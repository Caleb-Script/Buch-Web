"use client";

import Link from "next/link";
import LoginFormular from "../../components/formulare/LoginFormular";
import FaceFrownIcon from "@heroicons/react/24/outline/FaceFrownIcon";
import { useState, useEffect } from "react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
    return (
        <div role="alert">
            <p>Etwas ist schief gelaufen:</p>
            <pre>{error.message}</pre>
            <button onClick={resetErrorBoundary}>
                Versuchen Sie es erneut
            </button>
        </div>
    );
}

function HomeContent() {
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        // This will only run on the client
        const storedToken = localStorage.getItem("token");
        setToken(storedToken);
    }, []);

    if (token) {
        return (
            <main className="d-flex h-75 flex-column align-items-center justify-content-center gap-2">
                <FaceFrownIcon className="w-50 text-dark" />
                <h2 className="text-xl font-semibold">404 Not Found</h2>
                <p>Seite nicht verfügbar</p>
                <Link
                    href="/buecher"
                    className="mt-4 rounded bg-danger px-4 py-2 text-sm text-white"
                >
                    Go Back
                </Link>
            </main>
        );
    } else {
        return (
            <main className="vh-100 d-flex justify-content-center align-items-center">
                <LoginFormular />
            </main>
        );
    }
}

export default function Home() {
    return (
        <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onReset={() => {
                // Reset the state of your application if needed
            }}
        >
            <HomeContent />
        </ErrorBoundary>
    );
}
