import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router"
import { usePuterStore } from "~/lib/puter"

/**
 * Meta information for SEO
 */
export const meta = () => [
    { title: 'CVPilot | Auth' },
    { name: 'description', content: 'Log into your account' }
]

/**
 * Auth Component:
 * Manages user authentication (Sign In/Sign Out) via Puter.
 * Automatically redirects the user to the 'next' destination after successful login.
 */
const Auth = () => {
    const { isLoading, auth } = usePuterStore()
    const location = useLocation()
    const navigate = useNavigate()
    
    // Parse the 'next' redirect URL from query parameters
    const next = location.search.split('next=')[1] || '/'

    // Redirect authenticated users to the intended destination
    useEffect(() => {
        if (auth.isAuthenticated) {
            navigate(next)
        }
    }, [auth.isAuthenticated, next, navigate])

    return (
        <main className="bg-[url('/images/bg-auth.svg')] bg-cover min-h-screen flex items-center justify-center">
            <div className="gradient-border shadow-lg">
                <section className="flex flex-col gap-8 bg-white rounded-2xl p-10">
                    <div className="flex flex-col items-center gap-2 text-center">
                        <h1>Welcome</h1>
                        <h2>Log In to Continue Your Job Journey</h2>
                    </div>
                    
                    <div>
                        {isLoading ? (
                            <button className="auth-button animate-pulse" disabled>
                                <p>Signing you in ...</p>
                            </button>
                        ) : (
                            <>
                                {auth.isAuthenticated ? (
                                    <button className="auth-button" onClick={auth.signOut}>
                                        Log Out
                                    </button>
                                ) : (
                                    <button className="auth-button" onClick={auth.signIn}>
                                        Log in
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </section>
            </div>
        </main>
    )
}

export default Auth
