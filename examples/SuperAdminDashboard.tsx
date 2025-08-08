// 🎛️ Super Admin Dashboard - Painel de Controle

'use client';

import React, { useState, useEffect } from 'react';
import { useMultiTenant } from './MultiTenantContext';

interface DashboardStats {
  totalClients: number;
  activeClients: number;
  monthlyRevenue: number;
  newClientsThisMonth: number;
  avgRevenuePerClient: number;
  churnRate: number;
}

interface Client {
  id: string;
  name: string;
  subdomain: string;
  plan: 'lite' | 'pro' | 'enterprise';
  status: 'active' | 'trial' | 'suspended';
  createdAt: string;
  lastLogin: string;
  monthlyRevenue: number;
}

export default function SuperAdminDashboard() {
  const { isSuperAdmin, allTenants, switchTenant } = useMultiTenant();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isSuperAdmin) {
      loadDashboardData();
    }
  }, [isSuperAdmin]);

  const loadDashboardData = async () => {
    try {
      const [statsResponse, clientsResponse] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/clients')
      ]);

      const statsData = await statsResponse.json();
      const clientsData = await clientsResponse.json();

      setStats(statsData);
      setClients(clientsData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(client => {
    const matchesPlan = selectedPlan === 'all' || client.plan === selectedPlan;
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.subdomain.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesPlan && matchesSearch;
  });

  const handleCreateClient = () => {
    // Abrir modal de criação de cliente
    console.log('Criar novo cliente');
  };

  const handleClientAction = async (clientId: string, action: string) => {
    try {
      await fetch(`/api/admin/clients/${clientId}/${action}`, {
        method: 'POST'
      });
      
      // Recarregar dados
      await loadDashboardData();
    } catch (error) {
      console.error(`Erro ao ${action} cliente:`, error);
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acesso Negado</h1>
          <p className="text-gray-600">Você não tem permissão para acessar esta área.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
              <p className="text-gray-600">Gestão completa da plataforma Tropiqual</p>
            </div>
            <button
              onClick={handleCreateClient}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium"
            >
              + Novo Cliente
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Clientes Totais"
              value={stats.totalClients}
              subtitle={`${stats.activeClients} ativos`}
              color="blue"
            />
            <StatCard
              title="Receita Mensal"
              value={`€${stats.monthlyRevenue.toLocaleString()}`}
              subtitle={`€${stats.avgRevenuePerClient}/cliente`}
              color="green"
            />
            <StatCard
              title="Novos Clientes"
              value={stats.newClientsThisMonth}
              subtitle="Este mês"
              color="purple"
            />
            <StatCard
              title="Taxa de Retenção"
              value={`${(100 - stats.churnRate).toFixed(1)}%`}
              subtitle={`${stats.churnRate.toFixed(1)}% churn`}
              color="orange"
            />
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Buscar clientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">Todos os Planos</option>
              <option value="lite">Lite</option>
              <option value="pro">Pro</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>
        </div>

        {/* Clients Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Clientes ({filteredClients.length})
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plano
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Receita
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Último Login
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{client.name}</div>
                        <div className="text-sm text-gray-500">{client.subdomain}.tropiqual.app</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        client.plan === 'enterprise' ? 'bg-purple-100 text-purple-800' :
                        client.plan === 'pro' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {client.plan.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        client.status === 'active' ? 'bg-green-100 text-green-800' :
                        client.status === 'trial' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {client.status === 'active' ? 'Ativo' :
                         client.status === 'trial' ? 'Trial' : 'Suspenso'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      €{client.monthlyRevenue}/mês
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(client.lastLogin).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => switchTenant(client.id)}
                        className="text-orange-600 hover:text-orange-900 mr-3"
                      >
                        Acessar
                      </button>
                      <button
                        onClick={() => handleClientAction(client.id, 'suspend')}
                        className="text-red-600 hover:text-red-900 mr-3"
                      >
                        Suspender
                      </button>
                      <button
                        onClick={() => handleClientAction(client.id, 'edit')}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

// Componente de Card de Estatísticas
interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

function StatCard({ title, value, subtitle, color }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500'
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`${colorClasses[color]} rounded-md p-3 mr-4`}>
          <div className="w-6 h-6 text-white">📊</div>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}
