/** Obscure admin console base path (not linked from public nav). */
export const ADMIN_BASE_PATH = "/admin-145678" as const;
export const ADMIN_LOGIN_PATH = `${ADMIN_BASE_PATH}/login` as const;

/** Only this address may sign in to the admin console. */
export const ADMIN_ALLOWED_EMAIL = "lumacentre545@gmail.com" as const;

export function resolveAdminEmail(): string {
  return (process.env.ADMIN_EMAIL ?? ADMIN_ALLOWED_EMAIL).toLowerCase().trim();
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return email.toLowerCase().trim() === resolveAdminEmail();
}

export function isAdminPath(pathname: string): boolean {
  return pathname === ADMIN_BASE_PATH || pathname.startsWith(`${ADMIN_BASE_PATH}/`);
}

export function isAdminLoginPath(pathname: string): boolean {
  return pathname === ADMIN_LOGIN_PATH || pathname.startsWith(`${ADMIN_LOGIN_PATH}/`);
}
