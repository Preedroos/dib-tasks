import { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc, updateDoc, query, orderBy } from 'firebase/firestore';
import { createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { db, secondaryAuth } from '../lib/firebase';
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
            const q = query(collection(db, 'stores'), orderBy('name'));
            const querySnapshot = await getDocs(q);
            setStores(querySnapshot.docs.map(doc => {
                const s = doc.data();
                return {
                    id: doc.id,
                    name: s.name,
                    city: s.city,
                    isActive: s.deleted_at === null || s.deleted_at === undefined
                };
            }));
        } catch (err: any) {
            console.error('Erro ao buscar lojas:', err.message);
        }
    };

    const fetchUsers = async () => {
        try {
            const q = query(collection(db, 'users'), orderBy('name'));
            const querySnapshot = await getDocs(q);
            setUsers(querySnapshot.docs.map(doc => {
                const u = doc.data();
                return {
                    id: doc.id,
                    name: u.name,
                    email: u.email,
                    department: u.role as RoleType,
                    store_id: u.store_id || null,
                    isActive: u.deleted_at === null || u.deleted_at === undefined
                };
            }));
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
                const storeRef = doc(db, 'stores', storeForm.id);
                await updateDoc(storeRef, {
                    name: storeForm.name,
                    city: storeForm.city,
                    updated_at: new Date().toISOString()
                });
            } else {
                const newId = `loja-${crypto.randomUUID().slice(0, 8)}`;
                const storeRef = doc(db, 'stores', newId);
                await setDoc(storeRef, {
                    name: storeForm.name,
                    city: storeForm.city,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    deleted_at: null
                });
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
            const storeRef = doc(db, 'stores', id);
            await updateDoc(storeRef, {
                deleted_at: store.isActive ? new Date().toISOString() : null,
                updated_at: new Date().toISOString()
            });
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
                const userRef = doc(db, 'users', userForm.id);
                await updateDoc(userRef, {
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

                // 2. Cria o usuário no Firebase Auth usando a segunda instância
                const authResult = await createUserWithEmailAndPassword(secondaryAuth, userForm.email, temporaryPassword);

                // 3. Envia e-mail de redefinição de senha para o usuário
                await sendPasswordResetEmail(secondaryAuth, userForm.email);

                // 4. Salva os dados na coleção Firestore
                const uid = authResult.user.uid;
                const userRef = doc(db, 'users', uid);
                await setDoc(userRef, {
                    name: userForm.name,
                    email: userForm.email,
                    role: userForm.department,
                    store_id: userForm.department === 'MANAGER' ? userForm.store_id : null,
                    created_at: new Date().toISOString()
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
            const userRef = doc(db, 'users', id);
            await updateDoc(userRef, {
                deleted_at: user.isActive ? new Date().toISOString() : null,
                updated_at: new Date().toISOString()
            });
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
