// 🎛️ Context Multi-Tenant - Gerenciamento Global

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  customDomain?: string;
  plan: 'lite' | 'pro' | 'enterprise';
  status: 'active' | 'suspended' | 'trial';
  settings: TenantSettings;
  branding: TenantBranding;
}

interface TenantSettings {
  aiFeatures: boolean;
  analytics: boolean;
  customDomain: boolean;
  maxMenuItems: number;
  multiLanguage: boolean;
}

interface TenantBranding {
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  restaurantName: string;
}

interface User {
  id: string;
  email: string;
  role: 'super_admin' | 'tenant_owner' | 'tenant_admin' | 'tenant_staff';
  tenantId?: string;
  permissions: string[];
}

interface MultiTenantContextType {
  // Estado atual
  currentTenant: Tenant | null;
  currentUser: User | null;
  isLoading: boolean;
  
  // Super Admin
  isSuperAdmin: boolean;
  allTenants: Tenant[];
  
  // Métodos
  switchTenant: (tenantId: string) => Promise<void>;
  updateTenantSettings: (settings: Partial<TenantSettings>) => Promise<void>;
  updateTenantBranding: (branding: Partial<TenantBranding>) => Promise<void>;
  
  // Auth
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  
  // Permissions
  hasPermission: (permission: string) => boolean;
  canAccessTenant: (tenantId: string) => boolean;
}

const MultiTenantContext = createContext<MultiTenantContextType | undefined>(undefined);

export function MultiTenantProvider({ children }: { children: React.ReactNode }) {
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allTenants, setAllTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Detectar tenant atual baseado na URL
  useEffect(() => {
    const detectCurrentTenant = async () => {
      setIsLoading(true);
      
      try {
        // Obter tenant ID do header ou URL
        const tenantId = getTenantIdFromHeaders();
        
        if (tenantId) {
          const tenant = await fetchTenantData(tenantId);
          setCurrentTenant(tenant);
        }
        
        // Verificar usuário logado
        const user = await getCurrentUser();
        setCurrentUser(user);
        
        // Se for super admin, carregar todos os tenants
        if (user?.role === 'super_admin') {
          const tenants = await fetchAllTenants();
          setAllTenants(tenants);
        }
        
      } catch (error) {
        console.error('Erro ao detectar tenant:', error);
      } finally {
        setIsLoading(false);
      }
    };

    detectCurrentTenant();
  }, []);

  const switchTenant = async (tenantId: string): Promise<void> => {
    if (!isSuperAdmin) {
      throw new Error('Apenas super admins podem trocar de tenant');
    }
    
    const tenant = await fetchTenantData(tenantId);
    setCurrentTenant(tenant);
    
    // Redirecionar para o tenant
    window.location.href = `https://${tenant.subdomain}.tropiqual.app`;
  };

  const updateTenantSettings = async (settings: Partial<TenantSettings>): Promise<void> => {
    if (!currentTenant || !hasPermission('tenant.settings.write')) {
      throw new Error('Sem permissão para atualizar configurações');
    }

    const updatedTenant = {
      ...currentTenant,
      settings: { ...currentTenant.settings, ...settings }
    };

    await saveTenantData(updatedTenant);
    setCurrentTenant(updatedTenant);
  };

  const updateTenantBranding = async (branding: Partial<TenantBranding>): Promise<void> => {
    if (!currentTenant || !hasPermission('tenant.branding.write')) {
      throw new Error('Sem permissão para atualizar marca');
    }

    const updatedTenant = {
      ...currentTenant,
      branding: { ...currentTenant.branding, ...branding }
    };

    await saveTenantData(updatedTenant);
    setCurrentTenant(updatedTenant);
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, tenantId: currentTenant?.id })
      });

      if (response.ok) {
        const user = await response.json();
        setCurrentUser(user);
        
        // Salvar token
        localStorage.setItem('authToken', user.token);
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('authToken');
    
    // Redirecionar para login
    if (currentTenant) {
      window.location.href = `https://${currentTenant.subdomain}.tropiqual.app/login`;
    } else {
      window.location.href = '/login';
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!currentUser) return false;
    
    // Super admin tem todas as permissões
    if (currentUser.role === 'super_admin') return true;
    
    // Verificar permissões específicas
    return currentUser.permissions.includes(permission);
  };

  const canAccessTenant = (tenantId: string): boolean => {
    if (!currentUser) return false;
    
    // Super admin pode acessar qualquer tenant
    if (currentUser.role === 'super_admin') return true;
    
    // Usuários só podem acessar seu próprio tenant
    return currentUser.tenantId === tenantId;
  };

  const isSuperAdmin = currentUser?.role === 'super_admin';

  const value: MultiTenantContextType = {
    currentTenant,
    currentUser,
    isLoading,
    isSuperAdmin,
    allTenants,
    switchTenant,
    updateTenantSettings,
    updateTenantBranding,
    login,
    logout,
    hasPermission,
    canAccessTenant
  };

  return (
    <MultiTenantContext.Provider value={value}>
      {children}
    </MultiTenantContext.Provider>
  );
}

export function useMultiTenant() {
  const context = useContext(MultiTenantContext);
  if (context === undefined) {
    throw new Error('useMultiTenant deve ser usado dentro de MultiTenantProvider');
  }
  return context;
}

// Funções auxiliares
function getTenantIdFromHeaders(): string | null {
  // Obter do header x-tenant-id definido no middleware
  return document.querySelector('meta[name="tenant-id"]')?.getAttribute('content') || null;
}

async function fetchTenantData(tenantId: string): Promise<Tenant> {
  const response = await fetch(`/api/tenants/${tenantId}`);
  if (!response.ok) {
    throw new Error('Erro ao buscar dados do tenant');
  }
  return response.json();
}

async function saveTenantData(tenant: Tenant): Promise<void> {
  const response = await fetch(`/api/tenants/${tenant.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tenant)
  });
  
  if (!response.ok) {
    throw new Error('Erro ao salvar dados do tenant');
  }
}

async function getCurrentUser(): Promise<User | null> {
  const token = localStorage.getItem('authToken');
  if (!token) return null;

  try {
    const response = await fetch('/api/auth/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (response.ok) {
      return response.json();
    }
  } catch (error) {
    console.error('Erro ao verificar usuário:', error);
  }
  
  return null;
}

async function fetchAllTenants(): Promise<Tenant[]> {
  const response = await fetch('/api/admin/tenants');
  if (!response.ok) {
    throw new Error('Erro ao buscar tenants');
  }
  return response.json();
}
