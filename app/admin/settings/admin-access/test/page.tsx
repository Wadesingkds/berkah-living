export const dynamic = 'force-dynamic'

import { Suspense } from 'react'

function TestContent() {
  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Pure HTML Form Test</h1>
      
      <form action="/api/admin/access" method="POST" className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nama</label>
          <input 
            type="text" 
            name="name" 
            defaultValue="Test Admin"
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input 
            type="email" 
            name="email" 
            defaultValue="test@test.com"
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input 
            type="tel" 
            name="phone" 
            defaultValue="08123456789"
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Role</label>
          <select name="role" className="w-full px-3 py-2 border rounded">
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
            <option value="owner">Owner</option>
          </select>
        </div>
        
        <button 
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Submit (Native HTML)
        </button>
      </form>
    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TestContent />
    </Suspense>
  )
}
