import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react'
import { listBuilds, saveBuild as apiSaveBuild, deleteBuild as apiDeleteBuild } from './api'
import { useAuth } from '@/contexts/AuthContext'

const BuildContext = createContext(null)

const CATEGORIES = ['CPU', 'GPU', 'Motherboard', 'Memory', 'Case', 'PSU', 'CPU Cooler', 'Internal Drive']

const INITIAL_BUILD = Object.fromEntries(CATEGORIES.map(c => [c, c === 'Internal Drive' ? [] : null]))

const STORAGE_KEY = 'pc_builder_current_build'
const SAVED_KEY = 'pc_builder_saved_builds'

function loadSavedBuilds() {
  try {
    return JSON.parse(localStorage.getItem(SAVED_KEY)) || []
  } catch { return [] }
}

function saveSavedBuilds(list) {
  localStorage.setItem(SAVED_KEY, JSON.stringify(list))
}

export function BuildProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const [build, setBuild] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : INITIAL_BUILD
    } catch { return INITIAL_BUILD }
  })
  const [savedBuilds, setSavedBuilds] = useState(loadSavedBuilds)
  const [cloudBuilds, setCloudBuilds] = useState([])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(build))
  }, [build])

  useEffect(() => {
    if (!isAuthenticated) {
      setCloudBuilds([])
      return
    }
    listBuilds().then(res => setCloudBuilds(res.data || [])).catch(() => {})
  }, [isAuthenticated])

  const addComponent = useCallback((category, product) => {
    setBuild(prev => {
      if (category === 'Internal Drive') {
        if (prev['Internal Drive'].some(p => p.id === product.id)) return prev
        return { ...prev, 'Internal Drive': [...prev['Internal Drive'], product] }
      }
      return { ...prev, [category]: product }
    })
  }, [])

  const removeComponent = useCallback((category, productId) => {
    setBuild(prev => {
      if (category === 'Internal Drive') {
        return { ...prev, 'Internal Drive': prev['Internal Drive'].filter(p => p.id !== productId) }
      }
      return { ...prev, [category]: null }
    })
  }, [])

  const resetBuild = useCallback(() => setBuild(INITIAL_BUILD), [])

  const applyBuild = useCallback((buildData) => {
    const merged = { ...INITIAL_BUILD }
    CATEGORIES.forEach(c => {
      const v = buildData[c]
      if (v != null) merged[c] = c === 'Internal Drive' ? (Array.isArray(v) ? v : []) : v
    })
    setBuild(merged)
  }, [])

  const saveCurrentBuild = useCallback(async (name) => {
    const entry = { id: Date.now().toString(), name, components: JSON.parse(JSON.stringify(build)), createdAt: new Date().toISOString() }
    const updated = [...savedBuilds, entry]
    setSavedBuilds(updated)
    saveSavedBuilds(updated)
    try { await apiSaveBuild(name, build) } catch {}
    return entry
  }, [build, savedBuilds])

  const loadLocalBuild = useCallback((id) => {
    const entry = savedBuilds.find(b => b.id === id)
    if (entry) applyBuild(entry.components)
  }, [savedBuilds, applyBuild])

  const deleteLocalBuild = useCallback((id) => {
    const updated = savedBuilds.filter(b => b.id !== id)
    setSavedBuilds(updated)
    saveSavedBuilds(updated)
  }, [savedBuilds])

  const deleteCloudBuild = useCallback(async (id) => {
    await apiDeleteBuild(id)
    setCloudBuilds(prev => prev.filter(b => b.id !== id))
  }, [])

  const refreshCloudBuilds = useCallback(async () => {
    try {
      const res = await listBuilds()
      setCloudBuilds(res.data || [])
    } catch {}
  }, [])

  const buildCount = useMemo(() =>
    CATEGORIES.reduce((sum, c) => {
      const v = build[c]
      return sum + (Array.isArray(v) ? v.length : v ? 1 : 0)
    }, 0), [build])

  return (
    <BuildContext.Provider value={{
      build, addComponent, removeComponent, resetBuild, applyBuild,
      buildCount, CATEGORIES,
      savedBuilds, saveCurrentBuild, loadLocalBuild, deleteLocalBuild,
      cloudBuilds, deleteCloudBuild, refreshCloudBuilds,
    }}>
      {children}
    </BuildContext.Provider>
  )
}

export function useBuild() {
  const ctx = useContext(BuildContext)
  if (!ctx) throw new Error('useBuild must be used within BuildProvider')
  return ctx
}

export { CATEGORIES }
