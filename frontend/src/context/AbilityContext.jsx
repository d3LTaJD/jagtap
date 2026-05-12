import React, { createContext, useContext, useState, useEffect } from 'react';
import { AbilityBuilder, Ability } from '@casl/ability';
import { createContextualCan } from '@casl/react';

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
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  );
};

export const useAbility = () => useContext(AbilityContext);
