export { default } from 'next-auth/middleware'
export const config = {
  matcher: ['/farmer/:path*', '/buyer/:path*', '/transporter/:path*'],
}
