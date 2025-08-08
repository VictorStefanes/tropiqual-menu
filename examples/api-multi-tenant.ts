// 🔌 API Routes Multi-Tenant - Exemplo Completo

// app/api/tenants/[tenantId]/menu/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { validateTenantAccess, getTenantData, saveTenantData } from '@/lib/tenant-utils';

export async function GET(
  request: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  try {
    // Validar acesso ao tenant
    const hasAccess = await validateTenantAccess(params.tenantId, request);
    if (!hasAccess) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    // Obter dados do menu
    const menuData = await getTenantMenuData(params.tenantId);
    
    return NextResponse.json(menuData);
  } catch (error) {
    console.error('Erro ao buscar menu:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  try {
    // Validar acesso ao tenant
    const hasAccess = await validateTenantAccess(params.tenantId, request);
    if (!hasAccess) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const menuData = await request.json();
    
    // Validar dados do menu
    const validation = validateMenuData(menuData);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.errors }, { status: 400 });
    }

    // Salvar dados
    await saveTenantMenuData(params.tenantId, menuData);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao salvar menu:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

// app/api/admin/tenants/route.ts - Super Admin APIs
export async function GET(request: NextRequest) {
  try {
    // Verificar se é super admin
    const isSuperAdmin = await validateSuperAdmin(request);
    if (!isSuperAdmin) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const tenants = await getAllTenants();
    return NextResponse.json(tenants);
  } catch (error) {
    console.error('Erro ao buscar tenants:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verificar se é super admin
    const isSuperAdmin = await validateSuperAdmin(request);
    if (!isSuperAdmin) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const tenantData = await request.json();
    
    // Validar dados do tenant
    const validation = validateTenantData(tenantData);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.errors }, { status: 400 });
    }

    // Criar novo tenant
    const newTenant = await createTenant(tenantData);
    
    return NextResponse.json(newTenant, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar tenant:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

// app/api/admin/stats/route.ts
export async function GET(request: NextRequest) {
  try {
    const isSuperAdmin = await validateSuperAdmin(request);
    if (!isSuperAdmin) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const stats = await getDashboardStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

// lib/tenant-utils.ts - Utilitários para Multi-Tenancy
import fs from 'fs/promises';
import path from 'path';
import jwt from 'jsonwebtoken';

interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  plan: 'lite' | 'pro' | 'enterprise';
  status: 'active' | 'suspended' | 'trial';
  createdAt: string;
  settings: Record<string, any>;
}

export async function validateTenantAccess(tenantId: string, request: NextRequest): Promise<boolean> {
  try {
    // Obter token do header
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return false;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    // Super admin pode acessar qualquer tenant
    if (decoded.role === 'super_admin') {
      return true;
    }
    
    // Usuários normais só podem acessar seu próprio tenant
    return decoded.tenantId === tenantId;
  } catch (error) {
    return false;
  }
}

export async function validateSuperAdmin(request: NextRequest): Promise<boolean> {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return false;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    return decoded.role === 'super_admin';
  } catch (error) {
    return false;
  }
}

export async function getTenantMenuData(tenantId: string): Promise<any> {
  const menuPath = path.join(process.cwd(), 'data', 'tenants', tenantId, 'menu.json');
  
  try {
    const menuData = await fs.readFile(menuPath, 'utf-8');
    return JSON.parse(menuData);
  } catch (error) {
    // Se não existe, retornar template padrão
    return await getDefaultMenuTemplate();
  }
}

export async function saveTenantMenuData(tenantId: string, menuData: any): Promise<void> {
  const tenantDir = path.join(process.cwd(), 'data', 'tenants', tenantId);
  const menuPath = path.join(tenantDir, 'menu.json');
  
  // Garantir que o diretório existe
  await fs.mkdir(tenantDir, { recursive: true });
  
  // Salvar dados com timestamp
  const dataWithTimestamp = {
    ...menuData,
    lastUpdated: new Date().toISOString()
  };
  
  await fs.writeFile(menuPath, JSON.stringify(dataWithTimestamp, null, 2));
}

export async function getAllTenants(): Promise<Tenant[]> {
  // Em produção, isso viria de um banco de dados
  const tenantsDir = path.join(process.cwd(), 'data', 'tenants');
  
  try {
    const tenantDirs = await fs.readdir(tenantsDir);
    const tenants: Tenant[] = [];
    
    for (const tenantId of tenantDirs) {
      const configPath = path.join(tenantsDir, tenantId, 'config.json');
      try {
        const configData = await fs.readFile(configPath, 'utf-8');
        const tenant = JSON.parse(configData);
        tenants.push(tenant);
      } catch (error) {
        console.warn(`Erro ao ler config do tenant ${tenantId}:`, error);
      }
    }
    
    return tenants;
  } catch (error) {
    console.error('Erro ao listar tenants:', error);
    return [];
  }
}

export async function createTenant(tenantData: Partial<Tenant>): Promise<Tenant> {
  const tenantId = generateTenantId();
  
  const tenant: Tenant = {
    id: tenantId,
    name: tenantData.name!,
    subdomain: tenantData.subdomain!,
    plan: tenantData.plan || 'lite',
    status: 'trial',
    createdAt: new Date().toISOString(),
    settings: tenantData.settings || {}
  };
  
  // Criar estrutura de diretórios
  const tenantDir = path.join(process.cwd(), 'data', 'tenants', tenantId);
  await fs.mkdir(tenantDir, { recursive: true });
  await fs.mkdir(path.join(tenantDir, 'images'), { recursive: true });
  
  // Salvar configuração
  const configPath = path.join(tenantDir, 'config.json');
  await fs.writeFile(configPath, JSON.stringify(tenant, null, 2));
  
  // Copiar templates padrão
  await copyDefaultTemplates(tenantId);
  
  return tenant;
}

export async function getDashboardStats(): Promise<any> {
  const tenants = await getAllTenants();
  
  const totalClients = tenants.length;
  const activeClients = tenants.filter(t => t.status === 'active').length;
  const trialClients = tenants.filter(t => t.status === 'trial').length;
  
  // Calcular receita (exemplo)
  const planPrices = { lite: 29, pro: 79, enterprise: 149 };
  const monthlyRevenue = tenants
    .filter(t => t.status === 'active')
    .reduce((sum, t) => sum + planPrices[t.plan], 0);
  
  return {
    totalClients,
    activeClients,
    trialClients,
    monthlyRevenue,
    avgRevenuePerClient: activeClients > 0 ? monthlyRevenue / activeClients : 0,
    newClientsThisMonth: getNewClientsCount(),
    churnRate: calculateChurnRate(tenants)
  };
}

function generateTenantId(): string {
  return 'tenant_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

async function getDefaultMenuTemplate(): Promise<any> {
  const templatePath = path.join(process.cwd(), 'data', 'templates', 'default-menu.json');
  const templateData = await fs.readFile(templatePath, 'utf-8');
  return JSON.parse(templateData);
}

async function copyDefaultTemplates(tenantId: string): Promise<void> {
  const templatesDir = path.join(process.cwd(), 'data', 'templates');
  const tenantDir = path.join(process.cwd(), 'data', 'tenants', tenantId);
  
  const templates = ['menu.json', 'chef-recommendations.json', 'theme.json'];
  
  for (const template of templates) {
    const sourcePath = path.join(templatesDir, `default-${template}`);
    const destPath = path.join(tenantDir, template);
    
    try {
      const templateData = await fs.readFile(sourcePath, 'utf-8');
      await fs.writeFile(destPath, templateData);
    } catch (error) {
      console.warn(`Erro ao copiar template ${template}:`, error);
    }
  }
}

function validateMenuData(menuData: any): { valid: boolean; errors?: string[] } {
  const errors: string[] = [];
  
  if (!menuData.sections || !Array.isArray(menuData.sections)) {
    errors.push('Seções do menu são obrigatórias');
  }
  
  if (!menuData.restaurantInfo?.name) {
    errors.push('Nome do restaurante é obrigatório');
  }
  
  // Validar limite de itens baseado no plano
  // ... mais validações
  
  return { valid: errors.length === 0, errors };
}

function validateTenantData(tenantData: any): { valid: boolean; errors?: string[] } {
  const errors: string[] = [];
  
  if (!tenantData.name) {
    errors.push('Nome é obrigatório');
  }
  
  if (!tenantData.subdomain) {
    errors.push('Subdomínio é obrigatório');
  }
  
  if (!/^[a-z0-9-]+$/.test(tenantData.subdomain)) {
    errors.push('Subdomínio deve conter apenas letras minúsculas, números e hífens');
  }
  
  return { valid: errors.length === 0, errors };
}

function getNewClientsCount(): number {
  // Implementar lógica para contar novos clientes do mês
  return 5; // Exemplo
}

function calculateChurnRate(tenants: Tenant[]): number {
  // Implementar cálculo de churn rate
  return 2.3; // Exemplo: 2.3%
}
