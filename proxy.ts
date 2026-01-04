import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

/**
 * Proxy function for protecting dashboard routes in Next.js 16
 * This handles access control at the framework level
 */
export async function proxy(request: NextRequest) {
    // Validate environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

    if (!supabaseUrl || !supabaseKey) {
        console.error('Missing Supabase environment variables. Please check your .env.local file.')
        // Allow request to proceed but log the error
        // In production, you might want to return an error page instead
        return NextResponse.next({
            request: {
                headers: request.headers,
            },
        })
    }

    // Create Supabase client for proxy
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const cookieStore = await cookies()
    const supabase = createServerClient(
        supabaseUrl,
        supabaseKey,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        cookieStore.set(name, value, options)
                        response.cookies.set(name, value, options)
                    })
                },
            },
        }
    )

    // Check authentication for protected routes
    const { pathname } = request.nextUrl
    
    // Protect dashboard routes
    if (pathname.startsWith('/dashboard')) {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            
            if (!user) {
                const loginUrl = new URL('/login', request.url)
                loginUrl.searchParams.set('redirect', pathname)
                return NextResponse.redirect(loginUrl)
            }
        } catch (error) {
            // If there's an error checking auth, redirect to login
            console.error('Error checking authentication:', error)
            const loginUrl = new URL('/login', request.url)
            loginUrl.searchParams.set('redirect', pathname)
            return NextResponse.redirect(loginUrl)
        }
    }

    // Redirect authenticated users away from login page
    if (pathname === '/login') {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            
            if (user) {
                return NextResponse.redirect(new URL('/dashboard', request.url))
            }
        } catch (error) {
            // If there's an error, allow the login page to render
            console.error('Error checking authentication:', error)
        }
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (public folder)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}

