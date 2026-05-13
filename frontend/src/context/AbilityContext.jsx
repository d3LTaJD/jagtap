import React, { createContext, useContext, useState, useEffect } from 'react';
import { AbilityBuilder, Ability } from '@casl/ability';
import { createContextualCan } from '@casl/react';
import api from '../api/client';

export const AbilityContext = createContext();
export const Can = createContextualCan(AbilityContext.Consumer);

const defineAbilitiesFor = (user) => {
  const { can, rules } = new AbilityBuilder(Ability);

  if (user && (user.role === 'SA' || user.role === 'SUPER_ADMIN')) {
    can('manage', 'all');
  } else if (user && user.permissions) {
    // Map existing permissions to CASL
    // user.permissions format: { Enquiry: { view: true, edit: false, ... }, Quotation: { ... } }
    Object.entries(user.permissions).forEach(([module, actions]) => {
      Object.entries(actions).forEach(([action, allowed]) => {
        if (allowed) {
          can(action, module);
        }
      });
    });
  }

  return new Ability(rules);
};

export const AbilityProvider = ({ children }) => {
  const [ability, setAbility] = useState(new Ability());

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setAbility(defineAbilitiesFor(user));
    }
    
    const fetchLatestPermissions = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await api.get('/auth/me');
        if (res.data && res.data.user) {
          const user = res.data.user;
          localStorage.setItem('user', JSON.stringify(user));
          setAbility(defineAbilitiesFor(user));
        }
      } catch (err) {
        console.error("Failed to automatically refresh user permissions", err);
      }
    };

    // Refresh immediately on mount to catch any changes made while offline/closed
    if (localStorage.getItem('token')) {
      fetchLatestPermissions();
    }

    // Auto-refresh every 5 minutes (300000 ms)
    const intervalId = setInterval(fetchLatestPermissions, 300000);
    
    // Listen for storage changes (for login/logout)
    const handleStorage = () => {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setAbility(defineAbilitiesFor(user));
      } else {
        setAbility(new Ability());
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(intervalId);
    };
  }, []);

  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  );
};

export const useAbility = () => useContext(AbilityContext);
