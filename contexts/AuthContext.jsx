"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

// Create the authentication context
const AuthContext = createContext({});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component that wraps your app and makes auth object available to any child component that calls useAuth()
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Register a new user with email and password
  const register = async (username, email, password) => {
    try {
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Store additional user data in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        username,
        email,
        createdAt: new Date().toISOString(),
      });
      
      return userCredential.user;
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  };

  // Sign in a user with email and password
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  };

  // Sign out
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  // Get user profile data from Firestore
  const getUserProfile = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        return userDoc.data();
      }
      return null;
    } catch (error) {
      console.error("Error getting user profile:", error);
      throw error;
    }
  };

  // Listen for Firebase auth state changes
  useEffect(() => {
    console.log('AuthContext: Setting up auth state listener');
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('AuthContext: Auth state changed', { user: !!user, email: user?.email });
      if (user) {
        // User is signed in
        try {
          const userProfile = await getUserProfile(user.uid);
          setUser({
            uid: user.uid,
            email: user.email,
            ...userProfile
          });
          console.log('AuthContext: User profile loaded', { uid: user.uid, email: user.email });
        } catch (error) {
          console.error("Error getting user profile:", error);
          setUser({
            uid: user.uid,
            email: user.email
          });
        }
      } else {
        // User is signed out
        console.log('AuthContext: User signed out');
        setUser(null);
      }
      console.log('AuthContext: Setting loading to false');
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  console.log('AuthContext: Current state', { user: !!user, loading });

  // Context values to be provided
  const value = {
    user,
    loading,
    register,
    login,
    logout,
    getUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div>
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.1)', padding: '4px', textAlign: 'center', fontSize: '12px', zIndex: 9999 }}>
            Loading auth...
          </div>
          {children}
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
