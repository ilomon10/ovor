import React, { useContext, useState, useEffect } from 'react';
import { useFeathers } from 'components/feathers';

const CommonContext = React.createContext(null);

export default CommonContext;

export const CommonProvider = ({ children }) => {
  const feathers = useFeathers();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const { user } = await feathers.doGet('authentication')
      setUser(user);
    }
    fetch();
  }, [feathers]);

  return (
    <CommonContext.Provider value={{
      user
    }}>
      {children}
    </CommonContext.Provider>
  )
}

export const useCommon = () => {
  const common = useContext(CommonContext);
  return common;
}
