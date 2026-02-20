const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4040/api/v1';

// Log API URL in development for debugging
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log('API Base URL:', API_BASE);
}

interface TokenData {
    accessToken: string;
    refreshToken: string;
}

function getTokens(): TokenData | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem('auth_tokens');
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
}

function setTokens(tokens: TokenData) {
    if (typeof window === 'undefined') return;
    localStorage.setItem('auth_tokens', JSON.stringify(tokens));
}

function clearTokens() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('auth_tokens');
}

let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

async function refreshAccessToken(): Promise<string | null> {
    const tokens = getTokens();
    if (!tokens?.refreshToken) return null;

    try {
        const res = await fetch(`${API_BASE}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken: tokens.refreshToken }),
        });
        if (!res.ok) { clearTokens(); return null; }
        const data = await res.json();
        setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
        return data.accessToken;
    } catch {
        clearTokens();
        return null;
    }
}

export async function apiRequest<T = any>(
    path: string,
    options: RequestInit = {},
    publicRequest: boolean = false,
): Promise<T> {
    const tokens = !publicRequest ? getTokens() : null;
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string> || {}),
    };

    if (tokens?.accessToken && !publicRequest) {
        headers['Authorization'] = `Bearer ${tokens.accessToken}`;
    }

    // Don't set Content-Type for FormData
    if (options.body instanceof FormData) {
        delete headers['Content-Type'];
    }

    let res = await fetch(`${API_BASE}${path}`, { ...options, headers });

    // Auto-refresh on 401 (only for authenticated requests)
    if (res.status === 401 && tokens?.refreshToken && !publicRequest) {
        if (!isRefreshing) {
            isRefreshing = true;
            const newToken = await refreshAccessToken();
            isRefreshing = false;

            if (newToken) {
                refreshQueue.forEach((cb) => cb(newToken));
                refreshQueue = [];
                headers['Authorization'] = `Bearer ${newToken}`;
                res = await fetch(`${API_BASE}${path}`, { ...options, headers });
            } else {
                refreshQueue = [];
                throw new Error('Session expired');
            }
        } else {
            // Wait for the refresh to complete
            const newToken = await new Promise<string>((resolve) => {
                refreshQueue.push(resolve);
            });
            headers['Authorization'] = `Bearer ${newToken}`;
            res = await fetch(`${API_BASE}${path}`, { ...options, headers });
        }
    }

    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const errorMessage = body.message || body.error || `API error ${res.status}`;
        
        // Add more context to the error message
        const error = new Error(errorMessage);
        (error as any).status = res.status;
        (error as any).path = path;
        (error as any).body = body;
        
        // Log detailed error in development
        if (process.env.NODE_ENV === 'development') {
            console.error('API Error:', {
                status: res.status,
                path,
                message: errorMessage,
                body
            });
        }
        
        throw error;
    }

    // Handle 204 No Content
    if (res.status === 204) return undefined as any;

    return res.json();
}

export async function publicApiRequest<T = any>(
    path: string,
    options: RequestInit = {},
): Promise<T> {
    return apiRequest<T>(path, options, true);
}

export { getTokens, setTokens, clearTokens, API_BASE };
