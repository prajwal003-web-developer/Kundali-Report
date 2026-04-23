import { create } from "zustand"



const useKundaliStores = create((set) => ({
  KundaliDatas:[],
  setKundaliDatas:(data)=>set({
    KundaliDatas:data
  }),
  AddKundaliDatas:(data)=>set((state)=>({
    KundaliDatas:[...state.KundaliDatas , data]
  }))

}))

export default useKundaliStores