# 🚀 Guia de Escalabilidade - Multi-Cliente

## 🏗️ **Arquitetura Multi-Tenant**

### 📊 **Estrutura de Dados Escalável**

#### **1. Esquema de Banco de Dados**

```sql
-- Tabela de Clientes/Restaurantes
CREATE TABLE tenants (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  subdomain VARCHAR(50) UNIQUE,
  custom_domain VARCHAR(255),
  plan_type ENUM('lite', 'pro', 'enterprise'),
  status ENUM('active', 'suspended', 'trial'),
  created_at TIMESTAMP,
  expires_at TIMESTAMP,
  settings JSON
);

-- Tabela de Usuários por Cliente
CREATE TABLE tenant_users (
  id UUID PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id),
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255),
  role ENUM('owner', 'admin', 'staff'),
  permissions JSON,
  created_at TIMESTAMP
);

-- Tabela de Menus por Cliente
CREATE TABLE tenant_menus (
  id UUID PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id),
  menu_data JSON,
  chef_recommendations JSON,
  theme_settings JSON,
  updated_at TIMESTAMP
);
```

#### **2. Estrutura de Arquivos por Cliente**

```
/data/
├── tenants/
│   ├── uuid-cliente-1/
│   │   ├── menu.json
│   │   ├── chef-recommendations.json
│   │   ├── theme.json
│   │   └── images/
│   ├── uuid-cliente-2/
│   │   ├── menu.json
│   │   ├── chef-recommendations.json
│   │   ├── theme.json
│   │   └── images/
│   └── templates/
│       ├── default-menu.json
│       └── default-recommendations.json
```

### 🔐 **Sistema de Autenticação Multi-Level**

#### **AuthContext Escalável**

```typescript
// contexts/MultiTenantAuthContext.tsx
interface TenantContext {
  tenant: Tenant | null;
  user: User | null;
  permissions: Permission[];
}

interface SuperAdminContext {
  isSuperAdmin: boolean;
  managedTenants: Tenant[];
}

// Hierarquia de Acesso:
// 1. Super Admin (Você) - Acesso a todos os clientes
// 2. Tenant Owner - Acesso total ao próprio restaurante
// 3. Tenant Admin - Acesso limitado ao próprio restaurante
// 4. Tenant Staff - Acesso básico ao próprio restaurante
```

### 🌐 **Roteamento Inteligente**

#### **Middleware de Tenant Detection**

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const hostname = request.nextUrl.hostname;
  const pathname = request.nextUrl.pathname;
  
  // Detectar tenant por subdomínio
  if (hostname.includes('.tropiqual.app')) {
    const subdomain = hostname.split('.')[0];
    return rewriteToTenant(subdomain, pathname);
  }
  
  // Detectar tenant por domínio customizado
  const customTenant = await detectCustomDomain(hostname);
  if (customTenant) {
    return rewriteToTenant(customTenant.id, pathname);
  }
  
  // Rota para admin principal
  if (pathname.startsWith('/super-admin')) {
    return rewriteToSuperAdmin(pathname);
  }
}
```

### 📊 **Painel Super Admin**

#### **Dashboard Principal**

```typescript
// app/super-admin/page.tsx
export default function SuperAdminDashboard() {
  return (
    <div className="super-admin-dashboard">
      <MetricsGrid>
        <MetricCard title="Clientes Ativos" value={45} />
        <MetricCard title="Receita Mensal" value="€6,750" />
        <MetricCard title="Novos Clientes" value={8} />
        <MetricCard title="Taxa de Retenção" value="94%" />
      </MetricsGrid>
      
      <ClientsTable>
        {/* Lista de todos os clientes com ações */}
      </ClientsTable>
      
      <QuickActions>
        <CreateClientButton />
        <BulkActionsButton />
        <ExportDataButton />
      </QuickActions>
    </div>
  );
}
```

### 🎨 **Sistema de Temas por Cliente**

#### **Customização Visual**

```json
// data/tenants/uuid/theme.json
{
  "branding": {
    "logo": "/images/cliente-logo.png",
    "primaryColor": "#FF6B35",
    "secondaryColor": "#F7931E",
    "fontFamily": "Montserrat",
    "restaurantName": "Restaurante Maria"
  },
  "layout": {
    "headerStyle": "minimal",
    "menuLayout": "grid",
    "chefRecommendations": true
  },
  "features": {
    "aiDescriptions": true,
    "analytics": true,
    "qrCodes": true,
    "multiLanguage": false
  }
}
```

### 💳 **Sistema de Planos e Cobrança**

#### **Gestão de Assinaturas**

```typescript
// types/billing.ts
interface Plan {
  id: string;
  name: 'lite' | 'pro' | 'enterprise';
  price: number;
  features: {
    maxMenuItems: number;
    customDomain: boolean;
    aiFeatures: boolean;
    analytics: boolean;
    support: 'email' | 'priority' | '24/7';
  };
}

interface Subscription {
  tenantId: string;
  planId: string;
  status: 'active' | 'trial' | 'expired';
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
}
```

### 🔧 **Ferramentas de Gestão**

#### **CLI para Administração**

```bash
# Criar novo cliente
npm run tenant:create --name="Restaurante Maria" --plan="pro"

# Migrar dados
npm run tenant:migrate --from="old-format" --to="new-format"

# Backup de cliente
npm run tenant:backup --id="uuid-cliente-1"

# Estatísticas
npm run stats --tenant="all" --period="month"
```

### 📈 **Monitoramento e Analytics**

#### **Métricas por Cliente**

```typescript
// utils/analytics.ts
interface TenantMetrics {
  tenantId: string;
  pageViews: number;
  qrScans: number;
  popularItems: string[];
  peakHours: number[];
  conversionRate: number;
}

// Métricas Globais para Você
interface GlobalMetrics {
  totalClients: number;
  monthlyRevenue: number;
  churnRate: number;
  avgRevenuePerClient: number;
  supportTickets: number;
}
```

### 🚀 **Processo de Onboarding**

#### **Fluxo Automatizado**

```typescript
// services/onboarding.ts
class ClientOnboarding {
  async createNewClient(data: CreateClientData) {
    // 1. Criar tenant no banco
    const tenant = await createTenant(data);
    
    // 2. Configurar estrutura de arquivos
    await setupTenantFiles(tenant.id);
    
    // 3. Aplicar template padrão
    await applyDefaultTemplate(tenant.id, data.templateId);
    
    // 4. Configurar subdomínio/domínio
    await configureDomain(tenant.subdomain);
    
    // 5. Enviar credenciais por email
    await sendWelcomeEmail(tenant.id, data.ownerEmail);
    
    // 6. Agendar follow-up
    await scheduleOnboardingCall(tenant.id);
  }
}
```

### 💾 **Backup e Disaster Recovery**

#### **Estratégia de Backup**

```bash
# Backup automático diário
0 2 * * * /usr/local/bin/backup-tenants.sh

# Backup individual
backup-tenant.sh --tenant-id="uuid" --type="full"

# Restore
restore-tenant.sh --tenant-id="uuid" --date="2025-08-07"
```

### 🔄 **Sistema de Updates**

#### **Versionamento por Cliente**

```json
{
  "systemVersion": "2.1.4",
  "tenantVersion": "2.1.2",
  "pendingUpdates": [
    {
      "version": "2.1.4",
      "features": ["nova interface", "melhor performance"],
      "scheduledFor": "2025-08-15T02:00:00Z"
    }
  ]
}
```

### 📱 **API para Integrações**

#### **REST API Multi-Tenant**

```typescript
// api/v1/[tenantId]/menu/route.ts
export async function GET(
  request: Request,
  { params }: { params: { tenantId: string } }
) {
  const tenant = await validateTenant(params.tenantId);
  const menu = await getMenuData(tenant.id);
  return Response.json(menu);
}

// Endpoints por cliente:
// GET /api/v1/{tenantId}/menu
// PUT /api/v1/{tenantId}/menu
// GET /api/v1/{tenantId}/analytics
// POST /api/v1/{tenantId}/qr-codes
```

### 💰 **Modelo de Negócio Escalável**

#### **Pricing por Cliente**
- **Setup Inicial**: €199-499 (uma vez)
- **Plano Lite**: €29/mês por restaurante
- **Plano Pro**: €79/mês por restaurante
- **Enterprise**: €149/mês por restaurante

#### **Receita Recorrente**
- 50 clientes × €79/mês = €3.950/mês
- 100 clientes × €79/mês = €7.900/mês
- 500 clientes × €79/mês = €39.500/mês

### 🎯 **Próximos Passos**

1. **Fase 1**: Implementar estrutura multi-tenant básica
2. **Fase 2**: Criar painel super admin
3. **Fase 3**: Automatizar onboarding
4. **Fase 4**: Sistema de cobrança
5. **Fase 5**: Mobile app para gestão

### 🛠️ **Stack Tecnológico Recomendado**

- **Frontend**: Next.js 14 (atual)
- **Backend**: Node.js + Express
- **Banco**: PostgreSQL + Redis (cache)
- **Storage**: AWS S3 (imagens) + CloudFront (CDN)
- **Analytics**: Mixpanel ou similar
- **Pagamentos**: Stripe para Europa
- **Monitoramento**: Sentry + New Relic
- **Deploy**: Vercel ou AWS

Esta arquitetura permite gerenciar centenas de clientes com facilidade!
