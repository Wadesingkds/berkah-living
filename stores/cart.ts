import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '@/types'

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: string) => void
  updateQty: (productId: string, qty: number) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        const items = get().items
        const existingItem = items.find(i => i.productId === item.productId)
        
        if (existingItem) {
          set({
            items: items.map(i =>
              i.productId === item.productId
                ? { ...i, qty: i.qty + item.qty }
                : i
            )
          })
        } else {
          set({ items: [...items, item] })
        }
      },
      
      removeItem: (productId) => {
        set({ items: get().items.filter(i => i.productId !== productId) })
      },
      
      updateQty: (productId, qty) => {
        if (qty <= 0) {
          get().removeItem(productId)
          return
        }
        
        set({
          items: get().items.map(i =>
            i.productId === productId ? { ...i, qty } : i
          )
        })
      },
      
      clearCart: () => {
        set({ items: [] })
      },
      
      getTotal: () => {
        return get().items.reduce((sum, item) => sum + (item.price * item.qty), 0)
      },
      
      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.qty, 0)
      }
    }),
    {
      name: 'berkah-living-cart'
    }
  )
)
