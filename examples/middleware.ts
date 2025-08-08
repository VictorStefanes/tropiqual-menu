// 🏗️ Middleware Multi-Tenant - Exemplo Prático

import { NextRequest, NextResponse } from 'next/server';

interface Tenant {
  id: string;
  subdomain: string;
  customDomain?: string;
  status: 'active' | 'suspended' | 'trial';
  plan: 'lite' | 'pro' | 'enterprise';
}

// Cache de tenants em memória (em produção, usar Redis)
const tenantCache = new Map<string, Tenant>();

export async function middleware(request: NextRequest) {
  const hostname = request.nextUrl.hostname;
  const pathname = request.nextUrl.pathname;
  
  // Ignorar rotas do sistema
  if (pathname.startsWith('/_next') || 
      pathname.startsWith('/api/system') ||
      pathname.startsWith('/super-admin')) {
    return NextResponse.next();
  }
  
  let tenant: Tenant | null = null;
  
  // 1. Detectar por subdomínio (cliente1.tropiqual.app)
  if (hostname.includes('.tropiqual.app') && hostname !== 'tropiqual.app') {
    const subdomain = hostname.split('.')[0];
    tenant = await getTenantBySubdomain(subdomain);
  }
  
  // 2. Detectar por domínio customizado (restaurantemaria.com)
  else if (!hostname.includes('tropiqual.app')) {
    tenant = await getTenantByCustomDomain(hostname);
  }
  
  // 3. Rota administrativa principal
  else if (pathname.startsWith('/admin')) {
    return NextResponse.rewrite(new URL('/super-admin' + pathname.replace('/admin', ''), request.url));
  }
  
  // Se não encontrou tenant, redirecionar para página de erro
  if (!tenant) {
    return NextResponse.rewrite(new URL('/tenant-not-found', request.url));
  }
  
  // Verificar status do tenant
  if (tenant.status === 'suspended') {
    return NextResponse.rewrite(new URL('/suspended', request.url));
  }
  
  if (tenant.status === 'trial' && isTrialExpired(tenant)) {
    return NextResponse.rewrite(new URL('/trial-expired', request.url));
  }
  
  // Adicionar headers com informações do tenant
  const response = NextResponse.next();
  response.headers.set('x-tenant-id', tenant.id);
  response.headers.set('x-tenant-plan', tenant.plan);
  
  // Reescrever URL para incluir tenant ID
  const url = new URL(request.url);
  url.pathname = `/${tenant.id}${pathname}`;
  
  return NextResponse.rewrite(url);
}

async function getTenantBySubdomain(subdomain: string): Promise<Tenant | null> {
  // Verificar cache primeiro
  if (tenantCache.has(subdomain)) {
    return tenantCache.get(subdomain)!;
  }
  
  // Em produção: consultar banco de dados
  // const tenant = await db.tenants.findUnique({ where: { subdomain } });
  
  // Simulação para desenvolvimento
  const mockTenants: Record<string, Tenant> = {
    'demo': {
      id: 'tenant-demo-123',
      subdomain: 'demo',
      status: 'active',
      plan: 'pro'
    },
    'maria': {
      id: 'tenant-maria-456',
      subdomain: 'maria',
      status: 'active',
      plan: 'lite'
    }
  };
  
  const tenant = mockTenants[subdomain] || null;
  
  if (tenant) {
    tenantCache.set(subdomain, tenant);
  }
  
  return tenant;
}

async function getTenantByCustomDomain(domain: string): Promise<Tenant | null> {
  // Similar ao subdomínio, mas busca por customDomain
  return null; // Implementar conforme necessário
}

function isTrialExpired(tenant: Tenant): boolean {
  // Lógica para verificar se trial expirou
  return false;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/system (system APIs)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/system|_next/static|_next/image|favicon.ico).*)',
  ],
};
