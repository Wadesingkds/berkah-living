'use client'

import { useEffect, useState } from 'react'

export default function TestPage() {
  const [jsWorks, setJsWorks] = useState(false)
  const [clickWorks, setClickWorks] = useState(false)

  useEffect(() => {
    // Test 1: Basic JS execution
    setJsWorks(true)
    console.log('✓ useEffect executed')

    // Test 2: Event listener
    const btn = document.getElementById('test-btn')
    if (btn) {
      btn.addEventListener('click', () => {
        console.log('✓ Event listener fired')
        setClickWorks(true)
      })
    }
  }, [])

  const handleClick = () => {
    console.log('✓ onClick handler fired')
    setClickWorks(true)
  }

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">JavaScript Test</h1>

      <div className="space-y-2">
        <p>
          useEffect executed:{' '}
          <span className={jsWorks ? 'text-green-600' : 'text-red-600'}>
            {jsWorks ? '✓ YES' : '✗ NO'}
          </span>
        </p>

        <button
          id="test-btn"
          onClick={handleClick}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Click Me (onClick)
        </button>

        <p>
          onClick works:{' '}
          <span className={clickWorks ? 'text-green-600' : 'text-red-600'}>
            {clickWorks ? '✓ YES' : '✗ NO'}
          </span>
        </p>
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded">
        <p className="text-sm text-gray-600">
          Open browser console (F12) to see logs
        </p>
      </div>
    </div>
  )
}
