import { create } from "zustand"



const useNavControl = create((set) => ({
  
  isSidebarOpen:false,

  
  openSidebar: () => set({ isSidebarOpen: true }),

  closeSidebar: () => set({ isSidebarOpen: false }),

  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}))

export default useNavControl