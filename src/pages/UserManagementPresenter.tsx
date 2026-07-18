import { useState } from 'react';
import type { Store, User } from './UserManagement';
import { Header } from '../components/Header';
import { UserForm } from '../components/user-management/UserForm';
import { StoreForm } from '../components/user-management/StoreForm';
import { UserList } from '../components/user-management/UserList';
import { StoreList } from '../components/user-management/StoreList';
import type { UserFormState } from '../components/user-management/UserForm';
import type { StoreFormState } from '../components/user-management/StoreForm';

interface UserManagementPresenterProps {
  logout: () => Promise<void>;
  stores: Store[];
  filteredUsers: User[];
  filteredStores: Store[];
  userForm: UserFormState;
  storeForm: StoreFormState;
  searchUserQuery: string;
  setSearchUserQuery: (query: string) => void;
  searchStoreQuery: string;
  setSearchStoreQuery: (query: string) => void;
  handleSaveStore: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  toggleStoreStatus: (id: string) => Promise<void>;
  handleSaveUser: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  toggleUserStatus: (id: string) => Promise<void>;
  handleUserFormChange: (field: keyof UserFormState, value: any) => void;
  handleEditUser: (user: User) => void;
  handleCancelUserEdit: () => void;
  handleStoreFormChange: (field: keyof StoreFormState, value: string) => void;
  handleEditStore: (store: Store) => void;
  handleCancelStoreEdit: () => void;
  onNavigateToDashboard: () => void;
}

export function UserManagementPresenter({
  logout,
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
  handleCancelStoreEdit,
  onNavigateToDashboard
}: UserManagementPresenterProps) {
  const [activeTab, setActiveTab] = useState<'USERS' | 'STORES'>('USERS');

  return (
    <div className="bg-surface-container-low min-h-screen">
      <Header
        actionIcon="dashboard"
        showActionButton={true}
        onActionClick={onNavigateToDashboard}
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
