import { useState } from 'react';
import type { RoleType } from '../types';
import type { Store, User } from './UserManagement';
import { Header } from '../components/Header';
import { DataList } from '../components/common/DataList';
import { FormCard } from '../components/common/FormCard';

export interface UserFormState {
  id: string;
  name: string;
  email: string;
  department: RoleType;
  store_id: string;
}

export interface StoreFormState {
  id: string;
  name: string;
  city: string;
}

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
              <FormCard
                title={userForm.id ? 'Editar Colaborador' : 'Novo Colaborador'}
                onSubmit={handleSaveUser}
                actions={
                  <>
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-primary text-on-primary font-semibold text-sm rounded-xl hover:bg-primary-hover transition-all cursor-pointer"
                    >
                      {userForm.id ? 'Atualizar' : 'Cadastrar'}
                    </button>
                    {userForm.id && (
                      <button
                        type="button"
                        onClick={handleCancelUserEdit}
                        className="px-3 py-2 border border-outline text-on-surface font-semibold text-sm rounded-xl hover:bg-surface-container transition-all cursor-pointer"
                      >
                        Cancelar
                      </button>
                    )}
                  </>
                }
              >
                <UserFormFields
                  values={userForm}
                  activeStores={stores}
                  onChange={handleUserFormChange}
                />
              </FormCard>
            ) : (
              <FormCard
                title={storeForm.id ? 'Editar Unidade' : 'Nova Unidade'}
                onSubmit={handleSaveStore}
                actions={
                  <>
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-primary text-on-primary font-semibold text-sm rounded-xl hover:bg-primary-hover transition-all cursor-pointer"
                    >
                      {storeForm.id ? 'Atualizar' : 'Cadastrar'}
                    </button>
                    {storeForm.id && (
                      <button
                        type="button"
                        onClick={handleCancelStoreEdit}
                        className="px-3 py-2 border border-outline text-on-surface font-semibold text-sm rounded-xl hover:bg-surface-container transition-all cursor-pointer"
                      >
                        Cancelar
                      </button>
                    )}
                  </>
                }
              >
                <StoreFormFields
                  values={storeForm}
                  onChange={handleStoreFormChange}
                />
              </FormCard>
            )}
          </div>

          {/* ================= LISTAGENS (DIREITA) ================= */}
          <div className="md:col-span-2 bg-surface-container-lowest rounded-2xl border border-outline-variant/40 overflow-hidden shadow-xs">
            {activeTab === 'USERS' ? (
              <DataList<User>
              title="Colaboradores"
              items={filteredUsers}
              searchQuery={searchUserQuery}
              onSearchChange={setSearchUserQuery}
              searchPlaceholder="Buscar por nome ou e-mail..."
              emptyMessage="Nenhum colaborador encontrado."
              renderItem={(user) => {
                const linkedStore = stores.find(s => s.id === user.store_id);
                const isEditing = user.id === userForm.id;
                return (
                  <div
                    key={user.id}
                    className={`p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between transition-all duration-200 ${isEditing
                      ? 'border-2 border-primary bg-primary/5 rounded-xl m-2 shadow-xs'
                      : 'border-b border-outline-variant/30 hover:bg-surface-container-high/10 last:border-0'
                      } ${!user.isActive && !isEditing ? 'opacity-50 bg-surface-container-low/40' : ''}`}
                  >
                    {/* Bloco de Informações (Esquerda) */}
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-on-surface">{user.name}</h3>
                        {!user.isActive && (
                          <span className="text-[10px] bg-outline-variant text-on-surface-variant px-1.5 py-0.5 rounded-sm font-bold">
                            INATIVO
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-on-surface-variant break-all">{user.email}</p>
                      <p className="text-[11px] text-primary font-medium mt-1">
                        {user.department === 'MANAGER'
                          ? (linkedStore ? linkedStore.name : 'Sem loja vinculada')
                          : 'Acesso Global (Franqueadora)'}
                      </p>
                    </div>

                    {/* Bloco de Ações (Direita/Baixo) */}
                    <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto border-t border-outline-variant/20 pt-3 sm:border-0 sm:pt-0">
                      <span
                        className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full ${user.department === 'ADMIN'
                          ? 'bg-error-container text-on-error-container'
                          : user.department === 'MARKETING'
                            ? 'bg-primary-container text-on-primary-container'
                            : 'bg-secondary-container text-on-secondary-container'
                          }`}
                      >
                        {user.department}
                      </span>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="material-symbols-outlined text-on-surface-variant hover:text-primary text-[20px] cursor-pointer"
                        >
                          edit
                        </button>
                        <button
                          onClick={() => toggleUserStatus(user.id)}
                          className={`material-symbols-outlined text-[20px] cursor-pointer ${user.isActive
                            ? 'text-error hover:text-error-hover'
                            : 'text-success hover:text-success-hover'
                            }`}
                        >
                          {user.isActive ? 'toggle_on' : 'toggle_off'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }}
            />
            ) : (
              <DataList<Store>
                title="Unidades"
                items={filteredStores}
                searchQuery={searchStoreQuery}
                onSearchChange={setSearchStoreQuery}
                searchPlaceholder="Buscar por nome ou cidade..."
                emptyMessage="Nenhuma loja encontrada."
                renderItem={(store) => {
                  const isEditing = store.id === storeForm.id;
                  return (
                    <div
                      key={store.id}
                      className={`p-4 flex items-center justify-between transition-all duration-200 ${isEditing
                        ? 'border-2 border-primary bg-primary/5 rounded-xl m-2 shadow-xs'
                        : 'border-b border-outline-variant/30 hover:bg-surface-container-high/10 last:border-0'
                        } ${!store.isActive && !isEditing ? 'opacity-50 bg-surface-container-low/40' : ''}`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-on-surface">{store.name}</h3>
                          {!store.isActive && (
                            <span className="text-[10px] bg-outline-variant text-on-surface-variant px-1.5 py-0.5 rounded-sm font-bold">
                              INATIVA
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-on-surface-variant">{store.city}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleEditStore(store)}
                          className="material-symbols-outlined text-on-surface-variant hover:text-primary text-[20px] cursor-pointer"
                        >
                          edit
                        </button>
                        <button
                          onClick={() => toggleStoreStatus(store.id)}
                          className={`material-symbols-outlined text-[20px] cursor-pointer ${store.isActive
                            ? 'text-error hover:text-error-hover'
                            : 'text-success hover:text-success-hover'
                            }`}
                        >
                          {store.isActive ? 'toggle_on' : 'toggle_off'}
                        </button>
                      </div>
                    </div>
                  );
                }}
              />
            )}
          </div>

        </div>
      </main>
    </div>
  );
}

function UserFormFields({
  values,
  activeStores,
  onChange
}: {
  values: UserFormState;
  activeStores: Store[];
  onChange: (field: keyof UserFormState, value: any) => void;
}) {
  return (
    <>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-on-surface-variant">Nome Completo</label>
        <input
          type="text"
          value={values.name}
          onChange={(e) => onChange('name', e.target.value)}
          placeholder="Ex: Jaqueline Jandre"
          required
          className="px-3 py-2 rounded-xl bg-surface-container border border-outline/20 text-sm focus:outline-primary w-full"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-on-surface-variant">E-mail</label>
        <input
          type="email"
          value={values.email}
          onChange={(e) => onChange('email', e.target.value)}
          placeholder="user@email.com.br"
          required
          className="px-3 py-2 rounded-xl bg-surface-container border border-outline/20 text-sm focus:outline-primary w-full"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-on-surface-variant">Setor (Acesso)</label>
        <select
          value={values.department}
          onChange={(e) => onChange('department', e.target.value as RoleType)}
          className="px-3 py-2 rounded-xl bg-surface-container border border-outline/20 text-sm focus:outline-primary w-full"
        >
          <option value="MANAGER">Gerente</option>
          <option value="MARKETING">Marketing</option>
        </select>
      </div>

      {values.department === 'MANAGER' && (
        <div className="flex flex-col gap-1 animate-[fadeIn_0.2s_ease-out]">
          <label className="text-xs font-semibold text-on-surface-variant">Vincular à Loja Ativa</label>
          <select
            value={values.store_id || ''}
            onChange={(e) => onChange('store_id', e.target.value)}
            className="px-3 py-2 rounded-xl bg-surface-container border border-outline/20 text-sm focus:outline-primary w-full"
          >
            <option value="">Selecione uma loja...</option>
            {activeStores.filter(s => s.isActive).map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      )}
    </>
  );
}

function StoreFormFields({
  values,
  onChange
}: {
  values: StoreFormState;
  onChange: (field: keyof StoreFormState, value: string) => void;
}) {
  return (
    <>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-on-surface-variant">Nome da Unidade</label>
        <input
          type="text"
          value={values.name}
          onChange={(e) => onChange('name', e.target.value)}
          placeholder="Ex: Ceará"
          required
          className="px-3 py-2 rounded-xl bg-surface-container border border-outline/20 text-sm focus:outline-primary w-full"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-on-surface-variant">Cidade</label>
        <input
          type="text"
          value={values.city}
          onChange={(e) => onChange('city', e.target.value)}
          placeholder="Ex: Campo Grande"
          required
          className="px-3 py-2 rounded-xl bg-surface-container border border-outline/20 text-sm focus:outline-primary w-full"
        />
      </div>
    </>
  );
}
