import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import {
  useHistory
} from 'react-router-dom';

export const TabContext = React.createContext({
  tabs: [],
  activeTab: null,
  setCurrentTabState: (tab) => { },
  setActiveTab: () => { },
  addNewTab: () => { },
  removeTab: () => { },
  changeActiveTab: () => { },
});

const TabSystem = ({ children }) => {
  const [tabs, setTabs] = useState(JSON.parse(localStorage.getItem('ovor.tabs')) || []);
  const [activeTab, setActiveTabState] = useState(JSON.parse(localStorage.getItem('ovor.activeTab')) || 0);
  const history = useHistory();
  const prevTabs = useRef([]);
  const setActiveTab = useCallback((v) => {
    setActiveTabState(v);
  }, [setActiveTabState]);
  const changeActiveTab = useCallback((id) => {
    let index = id;
    let tab = tabs[index];
    if (tab === undefined) {
      index = tabs.length - 1;
      index = index < 0 ? 0 : index;
      tab = tabs[index];
    };
    setActiveTab(index);
    history.push(tab.path);
  }, [tabs, history, setActiveTab]);
  const addNewTab = useCallback(() => {
    setTabs(() => {
      return ([{
        title: "New Tab",
        path: "/"
      }, ...tabs])
    });
  }, [tabs]);
  const removeTab = useCallback((id) => {
    if (id < activeTab) setActiveTab(activeTab - 1);
    setTabs(() => ([...tabs.filter((...x) => x[1] !== id)]));
  }, [activeTab, tabs, setActiveTab]);
  const setCurrentTabState = useCallback(({ title, path }) => setTabs(() => {
    return ([
      ...tabs.map((v, i) => {
        if (i === activeTab) return { title, path };
        return v;
      })
    ]);
  }), [activeTab, tabs]);
  useEffect(() => {
    const tabsStore = JSON.parse(localStorage.getItem('ovor.tabs'));
    if (localStorage.getItem('ovor.tabs') === null) addNewTab();
    if (JSON.stringify(tabsStore) !== JSON.stringify(tabs)) localStorage.setItem('ovor.tabs', JSON.stringify(tabs));
    if (prevTabs.current.length !== 0
      && JSON.stringify(tabs[activeTab]) !== JSON.stringify(prevTabs.current[activeTab])) changeActiveTab(activeTab);
    prevTabs.current = tabs;
  }, [tabs]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const activeTabStore = parseInt(localStorage.getItem('ovor.activeTab'));
    if (activeTabStore !== activeTab) localStorage.setItem('ovor.activeTab', activeTab);
  }, [activeTab]);
  return (
    <TabContext.Provider value={{
      tabs: [...tabs],
      activeTab,
      changeActiveTab,
      setCurrentTabState,
      setActiveTab,
      addNewTab,
      removeTab,
    }}>
      {children}
    </TabContext.Provider>
  )
}

export default TabSystem;