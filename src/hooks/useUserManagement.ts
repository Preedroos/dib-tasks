import { useState, useEffect } from 'react';
import { storeService } from '../services/storeService';
import { userService } from '../services/userService';
import { authService } from '../services/authService';
import type { RoleType } from '../types';
import type { User, Store } from '../pages/UserManagement';

export function useUserManagement() {
    const [stores, setStores] = useState<Store[]>([]);
    const [users, setUsers] = useState<User[]>([]);

    const [userForm, setUserForm] = useState<{
        id: string;
        name: string;
        email: string;
        department: RoleType;
        store_id: string;
    }>({
        id: '',
        name: '',
        email: '',
        department: 'MANAGER',
        store_id: ''
    });

    const [storeForm, setStoreForm] = useState({ id: '', name: '', city: '' });
    const [searchUserQuery, setSearchUserQuery] = useState('');
    const [searchStoreQuery, setSearchStoreQuery] = useState('');

    const isEditingUser = !!userForm.id;
    const isEditingStore = !!storeForm.id;

    // --- CARREGAMENTO INICIAL ---
    const fetchStores = async () => {
        try {
            const fetched = await storeService.getStores();
            setStores(fetched);
        } catch (err: any) {
            console.error('Erro ao buscar lojas:', err.message);
        }
    };

    const fetchUsers = async () => {
        try {
            const fetched = await userService.getUsers();
            setUsers(fetched.map(u => ({
                id: u.id,
                name: u.name,
                email: u.email,
                department: u.role,
                store_id: u.store_id,
                isActive: u.isActive
            })));
        } catch (err: any) {
            console.error('Erro ao buscar colaboradores:', err.message);
        }
    };

    useEffect(() => {
        fetchStores();
        fetchUsers();
    }, []);

    // --- CRUDS DE LOJAS ---
    const handleSaveStore = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!storeForm.name || !storeForm.city) return alert('Preencha todos os campos da loja');

        try {
            if (isEditingStore) {
                await storeService.updateStore(storeForm.id, storeForm.name, storeForm.city);
            } else {
                await storeService.createStore(storeForm.name, storeForm.city);
            }
            setStoreForm({ id: '', name: '', city: '' });
            await fetchStores();
        } catch (err: any) {
            alert('Erro ao salvar loja: ' + err.message);
        }
    };

    const toggleStoreStatus = async (id: string) => {
        const store = stores.find(s => s.id === id);
        if (!store) return;
        try {
            await storeService.toggleStoreStatus(id, store.isActive);
            await fetchStores();
        } catch (err: any) {
            alert('Erro ao alternar status da loja: ' + err.message);
        }
    };

    // --- CRUDS DE USUÁRIOS ---
    const handleSaveUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!userForm.name || !userForm.email) return alert('Preencha os campos obrigatórios do usuário');

        // Validação de E-mail Único (case-insensitive)
        const emailExists = users.some(u => u.id !== userForm.id && u.email.toLowerCase() === userForm.email.toLowerCase());
        if (emailExists) {
            return alert('Este e-mail já está cadastrado para outro colaborador.');
        }

        try {
            if (isEditingUser) {
                await userService.updateUserProfile(userForm.id, {
                    name: userForm.name,
                    email: userForm.email,
                    role: userForm.department,
                    store_id: userForm.department === 'MANAGER' ? userForm.store_id : null
                });
            } else {
                // 1. Gera uma senha aleatória forte e temporária de 12 caracteres
                const temporaryPassword = Array.from(crypto.getRandomValues(new Uint8Array(6)))
                    .map(b => b.toString(16).padStart(2, '0'))
                    .join('');

                // 2. Cria o usuário no Firebase Auth usando o serviço (que usa secondaryAuth internamente)
                const { uid } = await authService.createUser(userForm.email, temporaryPassword);

                // 3. Envia e-mail de redefinição de senha para o usuário
                await authService.sendPasswordReset(userForm.email);

                // 4. Salva os dados na coleção Firestore
                await userService.createUserProfile(uid, {
                    name: userForm.name,
                    email: userForm.email,
                    role: userForm.department,
                    store_id: userForm.department === 'MANAGER' ? userForm.store_id : null
                });
            }
            setUserForm({ id: '', name: '', email: '', department: 'MANAGER', store_id: '' });
            await fetchUsers();
        } catch (err: any) {
            alert('Erro ao salvar colaborador: ' + err.message);
        }
    };

    const toggleUserStatus = async (id: string) => {
        const user = users.find(u => u.id === id);
        if (!user) return;
        try {
            await userService.toggleUserStatus(id, user.isActive);
            await fetchUsers();
        } catch (err: any) {
            alert('Erro ao alternar status do colaborador: ' + err.message);
        }
    };

    // --- EVENTOS DO FORMULÁRIO USER ---
    const handleUserFormChange = (field: keyof typeof userForm, value: any) => {
        setUserForm((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const handleEditUser = (user: User) => {
        setUserForm({
            id: user.id,
            name: user.name,
            email: user.email,
            department: user.department,
            store_id: user.store_id || ''
        });
    };

    const handleCancelUserEdit = () => {
        setUserForm({ id: '', name: '', email: '', department: 'MANAGER', store_id: '' });
    };

    // --- EVENTOS DO FORMULÁRIO STORE ---
    const handleStoreFormChange = (field: keyof typeof storeForm, value: string) => {
        setStoreForm((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const handleEditStore = (store: Store) => {
        setStoreForm({
            id: store.id,
            name: store.name,
            city: store.city
        });
    };

    const handleCancelStoreEdit = () => {
        setStoreForm({ id: '', name: '', city: '' });
    };

    // --- FILTRAGEM EM TEMPO REAL ---
    const filteredUsers = users.filter(user => {
        const normalizedQuery = searchUserQuery.toLowerCase();
        return (
            user.name.toLowerCase().includes(normalizedQuery) ||
            user.email.toLowerCase().includes(normalizedQuery)
        );
    });

    const filteredStores = stores.filter(store => {
        const normalizedQuery = searchStoreQuery.toLowerCase();
        return (
            store.name.toLowerCase().includes(normalizedQuery) ||
            store.city.toLowerCase().includes(normalizedQuery)
        );
    });

    return {
        users,
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
    };
}
