import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { RoleType } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useUserManagement } from '../hooks/useUserManagement';
import { UserManagementPresenter } from './UserManagementPresenter';

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
    <UserManagementPresenter
      logout={logout}
      stores={stores}
      filteredUsers={filteredUsers}
      filteredStores={filteredStores}
      userForm={userForm}
      storeForm={storeForm}
      searchUserQuery={searchUserQuery}
      setSearchUserQuery={setSearchUserQuery}
      searchStoreQuery={searchStoreQuery}
      setSearchStoreQuery={setSearchStoreQuery}
      handleSaveStore={handleSaveStore}
      toggleStoreStatus={toggleStoreStatus}
      handleSaveUser={handleSaveUser}
      toggleUserStatus={toggleUserStatus}
      handleUserFormChange={handleUserFormChange}
      handleEditUser={handleEditUser}
      handleCancelUserEdit={handleCancelUserEdit}
      handleStoreFormChange={handleStoreFormChange}
      handleEditStore={handleEditStore}
      handleCancelStoreEdit={handleCancelStoreEdit}
      onNavigateToDashboard={() => navigate('/dashboard')}
    />
  );
}