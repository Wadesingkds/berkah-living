export type OrderStatus = 'PENDING' | 'PAID' | 'DELIVERED' | 'DONE' | 'CANCELLED'
export type PaymentType = 'TRANSFER' | 'COD' | 'QRIS'
export type OrderSource = 'CHAT' | 'CATALOG' | 'MANUAL'

export interface Product {
  id: string
  name: string
  price: number
  stock: number
  minStock: number
  categoryId: string
  category?: Category
  imageUrl?: string | null
  isActive: boolean
  createdAt: string
}

export interface Category {
  id: string
  name: string
}

export interface Customer {
  id: string
  name: string
  phone: string
  isVip: boolean
  totalOrders: number
  totalSpend: number
  lastOrderAt?: string
  createdAt: string
}

export interface Order {
  id: string
  orderNumber: string
  customerId: string
  customer?: Customer
  items: OrderItem[]
  total: number
  status: OrderStatus
  paymentType: PaymentType
  source: OrderSource
  driverId?: string
  notes?: string
  createdAt: string
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  product?: Product
  qty: number
  price: number
}

export interface Driver {
  id: string
  name: string
  phone: string
}

export interface Supplier {
  id: string
  name: string
  phone: string
}

export interface CartItem {
  productId: string
  name: string
  price: number
  qty: number
  imageUrl?: string | null
}
