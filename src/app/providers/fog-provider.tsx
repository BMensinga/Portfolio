'use client'

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

export type FogDensity = 'max' | 'medium' | 'light' | 'clear'
export type FogPosition = { y: number }

interface FogContextValue {
  density: FogDensity
  setDensity: (density: FogDensity) => void
  visible: boolean
  setVisible: (visible: boolean) => void
  position: FogPosition
  setPosition: (position: FogPosition) => void
  setPositionBy: (delta: Partial<FogPosition>) => void
  resetFog: () => void
}

const FogContext = createContext<FogContextValue | null>(null)

export function FogProvider({ children }: { children: ReactNode }) {
  const [density, setDensity] = useState<FogDensity>('light')
  const [visible, setVisible] = useState<boolean>(true)
  const [position, _setPosition] = useState<FogPosition>({ y: 0 })

  const setPosition = useCallback((pos: FogPosition) => _setPosition(pos), [])
  const setPositionBy = useCallback((delta: Partial<FogPosition>) => {
    _setPosition((prev) => ({ y: delta.y != null ? prev.y + delta.y : prev.y }))
  }, [])

  const resetFog = useCallback(() => {
    setVisible(true)
    setDensity('light')
    _setPosition({ y: 0 })
  }, [])

  const value = useMemo(() => ({ density, setDensity, visible, setVisible, position, setPosition, setPositionBy, resetFog }), [density, visible, position, setPosition, setPositionBy, resetFog])

  return <FogContext.Provider value={value}>{children}</FogContext.Provider>
}

export function useFog() {
  const ctx = useContext(FogContext)
  if (!ctx) throw new Error('useFog must be used within a FogProvider')
  return ctx
}