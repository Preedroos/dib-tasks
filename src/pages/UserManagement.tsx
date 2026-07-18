import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { RoleType } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { Header } from '../components/Header';
import { UserForm } from '../components/user-management/UserForm';
import { StoreForm } from '../components/user-management/StoreForm';
import { UserList } from '../components/user-management/UserList';
import { StoreList } from '../components/user-management/StoreList';
import { useUserManagement } from '../hooks/useUserManagement';

export interface Store {
  id: string;
  name: string;
  city: string;
  isActive: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  department: RoleType;
  store_id: string | null;
  isActive: boolean;
}

export function UserManagement() {
  const navigate = useNavigate();
  const { profile, loading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'USERS' | 'STORES'>('USERS');

  useEffect(() => {
    if (!loading && profile?.role !== 'ADMIN') {
      navigate('/dashboard', { replace: true });
    }
  }, [profile, loading, navigate]);

  const {
    stores,
    filteredUsers,
    filteredStores,
    userForm,
    storeForm,
    searchUserQuery,
    setSearchUserQuery,
    searchStoreQuery,
    setSearchStoreQuery,
    handleSaveStore,
    toggleStoreStatus,
    handleSaveUser,
    toggleUserStatus,
    handleUserFormChange,
    handleEditUser,
    handleCancelUserEdit,
    handleStoreFormChange,
    handleEditStore,
    handleCancelStoreEdit
  } = useUserManagement();

  if (loading || profile?.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="bg-surface-container-low min-h-screen">
      <Header
        actionIcon="dashboard"
        onActionClick={() => {
          navigate('/dashboard');
        }}
        onLogout={logout}
      />
      <main className="max-w-6xl mx-auto space-y-6 p-6">

        {/* Header e Seletor de Abas */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-outline-variant/40 pb-4">
          <div>
            <h1 className="text-headline-md font-bold text-on-surface">Painel Administrativo</h1>
            <p className="text-body-md text-on-surface-variant">Gestão de colaboradores, acessos e unidades Dog in Box</p>
          </div>

          <div className="flex bg-surface-container rounded-xl p-1 self-start md:self-auto">
            <button
              onClick={() => setActiveTab('USERS')}
              className={`px-4 py-2 text-sm font-semibold rounded-lg cursor-pointer transition-colors ${activeTab === 'USERS' ? 'bg-surface-container-lowest text-primary shadow-xs' : 'text-on-surface-variant'}`}
            >
              Colaboradores
            </button>
            <button
              onClick={() => setActiveTab('STORES')}
              className={`px-4 py-2 text-sm font-semibold rounded-lg cursor-pointer transition-colors ${activeTab === 'STORES' ? 'bg-surface-container-lowest text-primary shadow-xs' : 'text-on-surface-variant'}`}
            >
              Unidades
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">

          {/* ================= FORMULÁRIOS DE CRIAÇÃO/EDIÇÃO ================= */}
          <div className="md:col-span-1">
            {activeTab === 'USERS' ? (
              <UserForm
                values={userForm}
                activeStores={stores}
                onChange={handleUserFormChange}
                onSubmit={handleSaveUser}
                onCancel={handleCancelUserEdit}
              />
            ) : (
              <StoreForm
                values={storeForm}
                onChange={handleStoreFormChange}
                onSubmit={handleSaveStore}
                onCancel={handleCancelStoreEdit}
              />
            )}
          </div>

          {/* ================= LISTAGENS (DIREITA) ================= */}
          <div className="md:col-span-2 bg-surface-container-lowest rounded-2xl border border-outline-variant/40 overflow-hidden shadow-xs">
            {activeTab === 'USERS' ? (
              <UserList
                users={filteredUsers}
                stores={stores}
                editingId={userForm.id}
                onEdit={handleEditUser}
                onToggleStatus={toggleUserStatus}
                searchQuery={searchUserQuery}
                onSearchChange={setSearchUserQuery}
              />
            ) : (
              <StoreList
                stores={filteredStores}
                editingId={storeForm.id}
                onEdit={handleEditStore}
                onToggleStatus={toggleStoreStatus}
                searchQuery={searchStoreQuery}
                onSearchChange={setSearchStoreQuery}
              />
            )}
          </div>

        </div>
      </main>
    </div>
  );
}