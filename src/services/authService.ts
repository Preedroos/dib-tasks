import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail
} from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import { auth, secondaryAuth } from '../lib/firebase';

export interface AuthSessionUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  creationTime?: string;
}

export const authService = {
  async signIn(email: string, password: string): Promise<AuthSessionUser> {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      displayName: userCredential.user.displayName,
      creationTime: userCredential.user.metadata.creationTime,
    };
  },

  async signOut(): Promise<void> {
    await firebaseSignOut(auth);
  },

  onAuthStateChange(callback: (user: AuthSessionUser | null) => void): () => void {
    const unsubscribe = onAuthStateChanged(auth, (user: FirebaseUser | null) => {
      if (user) {
        callback({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          creationTime: user.metadata.creationTime,
        });
      } else {
        callback(null);
      }
    });
    return unsubscribe;
  },

  async createUser(email: string, password: string): Promise<{ uid: string }> {
    const authResult = await createUserWithEmailAndPassword(secondaryAuth, email, password);
    return {
      uid: authResult.user.uid,
    };
  },

  async sendPasswordReset(email: string): Promise<void> {
    await sendPasswordResetEmail(secondaryAuth, email);
  }
};
