import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Search, X, Camera, Upload, Image as ImageIcon, Cpu, Zap, HardDrive, Thermometer, CircuitBoard } from 'lucide-react'
import { analyzeImage, searchProducts } from '@/features/catalog/api/catalog'
import { formatPrice } from '@/utils/currency'

const categoryIcons = {
  cpu: Cpu, gpu: Zap, 'video-card': Zap, ram: CircuitBoard,
  memory: CircuitBoard, storage: HardDrive, motherboard: CircuitBoard,
  cooling: Thermometer, chassis: HardDrive, 'power supply': Zap,
  psu: Zap, ssd: HardDrive,
}

function DetectionCard({ detection }) {
  const Icon = categoryIcons[detection.category] || CircuitBoard
  const confidence = Math.round(detection.confidence * 100)

  return (
    <div className="trace-border bg-surface-container-lowest p-4">
      <div className="flex items-center gap-3 mb-3">
        <Icon className="w-5 h-5 text-primary" />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="font-label text-xs uppercase tracking-wider text-primary">{detection.category}</span>
            <span className="font-label text-[10px] text-on-surface-variant/60">{confidence}%</span>
          </div>
          <div className="h-1.5 bg-surface-container overflow-hidden mt-1">
            <div className="h-full bg-primary transition-all" style={{ width: `${confidence}%` }} />
          </div>
        </div>
      </div>

      {detection.ocr_results?.length > 0 && (
        <div className="mb-3 p-2 bg-background/50 font-body text-[11px] text-on-surface leading-relaxed">
          {detection.ocr_results.map((r, i) => (
            <span key={i}>
              {i > 0 && ' '}
              <span className="text-primary">&gt;</span> {r.text}
            </span>
          ))}
        </div>
      )}

      {detection.matches?.length > 0 && (
        <div className="space-y-2">
          <div className="font-label text-[11px] text-on-surface-variant/50 uppercase tracking-wider">MATCHED PRODUCTS</div>
          {detection.matches.slice(0, 3).map((match, i) => (
            <Link
              key={match.id || i}
              to={`/product/${match.table_name}/${match.id}`}
              className="block trace-border bg-surface-container p-2.5 hover:bg-surface-container-high transition-colors"
            >
              <div className="font-label text-[11px] text-on-surface leading-tight uppercase tracking-wider">{match.name}</div>
              <div className="flex items-center justify-between mt-1">
                <span className="font-label text-[11px] text-on-surface-variant/60 uppercase">
                  {match.manufacturer || ''}
                  {match.table_name && ` / ${match.table_name}`}
                </span>
                {match.price && (
                  <span className="font-headline text-sm text-primary">{formatPrice(match.price)}</span>
                )}
              </div>
            </Link>
          ))}
          {detection.matches.length > 3 && (
            <div className="font-label text-[11px] text-on-surface-variant/40 text-center pt-1 uppercase tracking-wider">
              +{detection.matches.length - 3} more results
            </div>
          )}
        </div>
      )}

      {(!detection.ocr_results?.length && !detection.matches?.length) && (
        <div className="font-label text-[10px] text-on-surface-variant/40 text-center py-2 uppercase tracking-wider">
          No text or matches found
        </div>
      )}
    </div>
  )
}

export default function SearchPopover({ isOpen, onClose }) {
  const [query, setQuery] = useState('')
  const [textResults, setTextResults] = useState([])
  const [textLoading, setTextLoading] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [analysisError, setAnalysisError] = useState(null)
  const inputRef = useRef(null)
  const fileInputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setQuery('')
      setTextResults([])
      setImageFile(null)
      setImagePreview(null)
      setAnalysisResult(null)
      setAnalysisError(null)
    }
  }, [isOpen])

  useEffect(() => {
    if (!query.trim()) { setTextResults([]); return }
    const timer = setTimeout(async () => {
      setTextLoading(true)
      try {
        const res = await searchProducts({ q: query, limit: 8 })
        setTextResults(res.results || [])
      } catch { setTextResults([]) }
      finally { setTextLoading(false) }
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  const handleImageSelect = useCallback(async (file) => {
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    setAnalysisResult(null)
    setAnalysisError(null)
    setAnalyzing(true)
    try {
      const result = await analyzeImage(file)
      setAnalysisResult(result)
    } catch (err) {
      setAnalysisError(err.message || 'Analysis failed. Is the backend running?')
    } finally {
      setAnalyzing(false)
    }
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    const file = e.dataTransfer?.files?.[0]
    if (file?.type?.startsWith('image/')) handleImageSelect(file)
  }, [handleImageSelect])

  const handleDragOver = (e) => e.preventDefault()

  const getFirstImage = (urls) => {
    if (!urls) return null
    try {
      const parsed = JSON.parse(urls)
      return Array.isArray(parsed) ? parsed[0] : null
    } catch {
      return urls || null
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center pt-16 md:pt-20 px-4 md:px-6 bg-background/60 backdrop-blur-sm">
      <div className="w-full max-w-5xl diagnostic-panel flex flex-col max-h-[85vh]">
        {/* Search header */}
        <div className="p-4 md:p-6 flex items-center gap-4 border-b border-primary/10">
          <div className="flex-1 flex items-center gap-3 bg-surface-container border border-outline/30 px-4 py-2.5 focus-within:border-primary/50 transition-colors">
            <Search className="w-5 h-5 text-primary flex-shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-transparent border-none focus:ring-0 w-full font-label text-sm uppercase tracking-wider text-on-surface placeholder:text-on-surface-variant/40"
              placeholder="SEARCH BY MODEL, SKU, OR KEYWORD..."
            />
            <button onClick={onClose} className="text-on-surface-variant/50 hover:text-primary transition-colors p-1 flex-shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar — Image upload */}
          <div className="hidden md:flex w-72 lg:w-80 flex-shrink-0 flex-col gap-4 p-4 md:p-6 border-r border-primary/10 overflow-y-auto">
            <div>
              <div className="font-label text-[10px] tracking-[0.2em] text-primary uppercase mb-3 flex items-center gap-2">
                <Camera className="w-3.5 h-3.5" /> VISUAL IDENTIFICATION
              </div>
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
                className="trace-border bg-surface-container p-6 flex flex-col items-center text-center cursor-pointer hover:bg-surface-container-high transition-colors"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleImageSelect(e.target.files[0])
                  }}
                />
                <div className="w-12 h-12 border-2 border-outline/30 flex items-center justify-center mb-3">
                  <Upload className="w-5 h-5 text-outline" />
                </div>
                <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-wider leading-relaxed">
                  Drop a component photo or click to upload
                </p>
                <div className="flex gap-2 mt-3">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click() }}
                    className="font-label text-[11px] tracking-[0.15em] uppercase text-primary border border-primary/30 px-3 py-1.5 hover:bg-primary/10 transition-colors"
                  >
                    CHOOSE FILE
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      const input = document.createElement('input')
                      input.type = 'file'
                      input.accept = 'image/*'
                      input.capture = 'environment'
                      input.onchange = () => {
                        if (input.files?.[0]) handleImageSelect(input.files[0])
                      }
                      input.click()
                    }}
                    className="font-label text-[11px] tracking-[0.15em] uppercase text-primary border border-primary/30 px-3 py-1.5 hover:bg-primary/10 transition-colors flex items-center gap-1.5"
                  >
                    <Camera className="w-3 h-3" /> CAMERA
                  </button>
                </div>
              </div>
            </div>

            <div>
              <div className="font-label text-[10px] tracking-[0.2em] text-primary uppercase mb-3">BROWSE CATEGORIES</div>
              <div className="flex flex-wrap gap-2">
                {['GPU', 'CPU', 'Motherboard', 'Memory', 'Internal Drive', 'PSU'].map((cat) => (
                  <Link
                    key={cat}
                    to={`/category/${encodeURIComponent(cat)}`}
                    onClick={onClose}
                    className="font-label text-[11px] tracking-[0.15em] uppercase text-on-surface-variant border border-outline/30 px-2.5 py-1.5 hover:text-primary hover:border-primary/50 transition-colors"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-surface-container-lowest/50">
            {/* Image analysis results */}
            {imagePreview && (
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <ImageIcon className="w-4 h-4 text-primary" />
                  <span className="font-label text-[10px] tracking-[0.2em] text-primary uppercase">ANALYZED IMAGE</span>
                  <button
                    onClick={() => {
                      setImageFile(null)
                      setImagePreview(null)
                      setAnalysisResult(null)
                      setAnalysisError(null)
                    }}
                    className="font-label text-[11px] text-on-surface-variant/50 hover:text-primary ml-auto uppercase"
                  >
                    CLEAR
                  </button>
                </div>
                <div className="trace-border bg-surface-container p-2 max-w-xs">
                  <img src={imagePreview} alt="Uploaded component" className="w-full h-auto max-h-48 object-contain" />
                </div>
              </div>
            )}

            {analyzing && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 bg-primary animate-pulse-amber" />
                  <span className="font-label text-xs tracking-[0.2em] text-primary uppercase">ANALYZING IMAGE</span>
                </div>
                <div className="h-1 w-48 bg-surface-container overflow-hidden">
                  <div className="h-full w-1/3 bg-primary animate-boot-indeterminate" />
                </div>
                <p className="font-label text-[10px] text-on-surface-variant/60 uppercase tracking-wider mt-4">
                  Running YOLO detection + OCR...
                </p>
              </div>
            )}

            {analysisError && (
              <div className="mb-6 p-4 border border-error/30 bg-error/5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 bg-error" />
                  <span className="font-label text-[10px] tracking-[0.15em] uppercase text-error">ANALYSIS FAILED</span>
                </div>
                <p className="font-label text-[10px] text-on-surface-variant/80 uppercase tracking-wider">
                  {analysisError}
                </p>
                <p className="font-label text-[11px] text-on-surface-variant/50 mt-2">
                  Please retry the analysis.
                </p>
              </div>
            )}

            {analysisResult?.detections?.length > 0 && (
              <div className="mb-6">
                <div className="font-label text-[10px] tracking-[0.2em] text-primary uppercase mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary" />
                  DETECTED COMPONENTS ({analysisResult.detections.length})
                </div>
                <div className="space-y-4">
                  {analysisResult.detections.map((det, i) => (
                    <DetectionCard key={i} detection={det} />
                  ))}
                </div>
              </div>
            )}

            {analysisResult?.detections?.length === 0 && !analyzing && !analysisError && imagePreview && (
              <div className="text-center py-12">
                <span className="font-label text-[10px] tracking-[0.2em] text-primary">{'>'} NO DETECTIONS</span>
                <p className="font-label text-[10px] text-on-surface-variant/60 uppercase tracking-wider mt-2">
                  No components were detected in the image. Try a different photo.
                </p>
              </div>
            )}

            {/* Text search results */}
            {!imageFile && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-label text-[10px] tracking-[0.15em] text-on-surface-variant/60 uppercase">
                    {query ? `RESULTS (${textResults.length})` : 'START TYPING TO SEARCH'}
                  </span>
                  {textResults.length > 0 && (
                    <Link
                      to={`/catalog?q=${encodeURIComponent(query)}`}
                      onClick={onClose}
                      className="font-label text-[11px] tracking-[0.15em] uppercase text-primary hover:text-primary-container transition-colors"
                    >
                      VIEW ALL &gt;
                    </Link>
                  )}
                </div>

                {textLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-4 h-4 border border-primary border-t-transparent animate-spin" />
                  </div>
                ) : textResults.length > 0 ? (
                  <div className="space-y-3">
                    {textResults.slice(0, 5).map((product, idx) => {
                      const imageUrl = getFirstImage(product.image_urls)
                      return (
                        <div
                          key={`${product.table_name}-${product.id}-${idx}`}
                          onClick={() => { navigate(`/product/${product.table_name}/${product.id}`); onClose() }}
                          className="trace-border bg-surface-container-lowest p-3 hover:bg-surface-container transition-colors cursor-pointer flex gap-4"
                        >
                          <div className="w-20 h-20 bg-surface-container flex-shrink-0 flex items-center justify-center overflow-hidden">
                            {imageUrl ? (
                              <img src={imageUrl} alt="" className="w-full h-full object-contain p-1" />
                            ) : (
                              <span className="font-headline text-2xl text-outline/20">?</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start gap-2">
                              <h4 className="font-label text-xs uppercase tracking-wider text-on-surface truncate">
                                {product.name}
                              </h4>
                              <span className="font-headline text-base tracking-tight text-primary flex-shrink-0">
                                {formatPrice(product.price)}
                              </span>
                            </div>
                            <p className="font-label text-[11px] text-on-surface-variant/60 uppercase tracking-wider mt-1">
                              {product.manufacturer || product.table_name || 'COMPONENT'}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : query ? (
                  <div className="text-center py-12">
                    <span className="font-label text-[10px] tracking-[0.15em] text-on-surface-variant/40 uppercase">NO MATCHES</span>
                    <p className="font-label text-[11px] text-on-surface-variant/40 mt-2">Try different keywords</p>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <span className="font-label text-[10px] tracking-[0.15em] text-on-surface-variant/30 uppercase">
                      SEARCH {analysisResult ? 'OR TYPE' : 'BY NAME OR UPLOAD A PHOTO'}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-surface-container px-4 md:px-6 py-3 border-t border-primary/10 flex items-center justify-between">
          <div className="flex gap-4 md:gap-6">
            <div className="flex items-center gap-1.5">
              <kbd className="bg-background px-1.5 py-0.5 font-label text-[11px] text-on-surface-variant border border-outline/30">ESC</kbd>
              <span className="font-label text-[11px] text-on-surface-variant/50 uppercase tracking-wider">CLOSE</span>
            </div>
            <div className="flex items-center gap-1.5">
              <kbd className="bg-background px-1.5 py-0.5 font-label text-[11px] text-on-surface-variant border border-outline/30">↑↓</kbd>
              <span className="font-label text-[11px] text-on-surface-variant/50 uppercase tracking-wider">NAVIGATE</span>
            </div>
          </div>
          <div className="font-label text-[11px] tracking-[0.2em] text-on-surface-variant/30 uppercase">
            YOLO + OCR SEARCH v1.0
          </div>
        </div>
      </div>

      <button onClick={onClose} className="mt-4 font-label text-[11px] tracking-[0.15em] uppercase text-on-surface-variant/40 hover:text-primary transition-colors">
        CLICK OUTSIDE TO CLOSE
      </button>
    </div>
  )
}
