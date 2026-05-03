const FASTAPI_URL = import.meta.env.VITE_FASTAPI_URL || 'http://localhost:8000'

export async function analyzeImage(file) {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${FASTAPI_URL}/analyze`, {
    method: 'POST',
    body: formData
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || 'Image analysis failed')
  }

  return response.json()
}

export function processAnalysisResults(data) {
  if (!data || !data.detections || data.detections.length === 0) {
    return {
      hasResults: false,
      products: [],
      categories: [],
      message: 'No components detected in the image'
    }
  }

  const products = []
  const categories = []

  for (const detection of data.detections) {
    const category = detection.category || 'Unknown'
    const hasMatches = detection.matches && detection.matches.length > 0
    const hasOcrText = detection.ocr_results && detection.ocr_results.length > 0

    categories.push({
      name: category,
      confidence: detection.confidence,
      bbox: detection.bbox
    })

    if (hasMatches) {
      for (const match of detection.matches) {
        products.push({
          ...match,
          detectedCategory: category,
          ocrText: hasOcrText ? detection.ocr_results[0].text : null
        })
      }
    }
  }

  return {
    hasResults: products.length > 0 || categories.length > 0,
    products: products,
    categories: categories,
    hasProductMatches: products.length > 0,
    message: products.length > 0 
      ? `Found ${products.length} matching product(s)`
      : 'No product matches found. Showing detected components below.'
  }
}

export function formatPrice(price) {
  if (!price) return 'N/A'
  return price
}

export function extractShortName(fullName, maxLength = 60) {
  if (!fullName) return 'Unknown Product'
  if (fullName.length <= maxLength) return fullName
  return fullName.substring(0, maxLength) + '...'
}