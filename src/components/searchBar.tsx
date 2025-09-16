"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { FixedSizeList as List } from "react-window"
import { Input } from "@/components/ui/input"
import { Search, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import axios from "axios"
import debounce from "lodash.debounce"
import { getSearchProducts } from "@/app/(protected)/actions/product"

interface SearchResult {
  id: number
  name: string
  image: string
}

const searchCache: Record<string, SearchResult[]> = {}

export default function SearchBar() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)

  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const abortControllerRef = useRef<AbortController | null>(null)

  const performSearch = useCallback(
    debounce(async (searchTerm: string) => {
      if (searchTerm.trim().length < 2) {
        setResults([])
        setShowDropdown(false)
        return
      }

      if (searchCache[searchTerm]) {
        setResults(searchCache[searchTerm])
        setShowDropdown(true)
        return
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      abortControllerRef.current = new AbortController()

      try {
        setLoading(true)
        const res = await getSearchProducts(
          searchTerm
        )
        
        searchCache[searchTerm] = res.data
        setResults(res.data)
        setShowDropdown(true)
        setSelectedIndex(-1)
      } catch (err) {
        if (!axios.isCancel(err)) {
          console.error("Search failed", err)
        }
      } finally {
        setLoading(false)
      }
    }, 300),
    []
  )

  useEffect(() => {
    performSearch(query)
    return () => performSearch.cancel()
  }, [query, performSearch])

  const handleSelect = (id: number) => {
    setShowDropdown(false)
    router.push(`/productDetail/${id}`)
    setQuery("")
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || results.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        const nextIndex = selectedIndex >= results.length - 1 ? 0 : selectedIndex + 1
        setSelectedIndex(nextIndex)
        document.getElementById(`search-result-${nextIndex}`)?.scrollIntoView({
          block: 'nearest',
        })
        break
        
      case 'ArrowUp':
        e.preventDefault()
        const prevIndex = selectedIndex <= 0 ? results.length - 1 : selectedIndex - 1
        setSelectedIndex(prevIndex)
        document.getElementById(`search-result-${prevIndex}`)?.scrollIntoView({
          block: 'nearest',
        })
        break
        
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleSelect(results[selectedIndex].id)
        }
        break
        
      case 'Escape':
        e.preventDefault()
        setShowDropdown(false)
        setSelectedIndex(-1)
        break
        
      default:
        break
    }
  }

  const handleBlur = (e: React.FocusEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.relatedTarget as Node)) {
      setShowDropdown(false)
      setSelectedIndex(-1)
    }
  }

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const product = results[index]
    const isSelected = index === selectedIndex
    
    return (
      <button
        id={`search-result-${index}`}
        style={style}
        onMouseDown={() => handleSelect(product.id)}
        className={`w-full text-left px-4 py-2 flex items-center gap-3 ${
          isSelected ? 'bg-gray-100' : 'hover:bg-gray-50'
        }`}
        role="option"
        aria-selected={isSelected}
      >
        <img
          src={product.image || "/placeholder-product.jpg"}
          alt={product.name}
          className="w-8 h-8 object-cover rounded"
          loading="lazy"
          width={32}
          height={32}
        />
        <span className="text-sm truncate">{product.name}</span>
      </button>
    )
  }

  return (
    <div className="relative w-full max-w-sm">
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setShowDropdown(true)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder="Search products..."
          className="pr-10"
          aria-autocomplete="list"
          aria-expanded={showDropdown}
          aria-controls="search-results"
          aria-activedescendant={
            selectedIndex >= 0 ? `search-result-${selectedIndex}` : undefined
          }
          role="combobox"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
          ) : (
            <Search className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </div>

      {showDropdown && (
        <div
          ref={dropdownRef}
          id="search-results"
          className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-80 overflow-hidden"
          role="listbox"
          aria-label="Search results"
        >
          {results.length > 0 ? (
            <List
              height={Math.min(results.length * 50, 320)}
              itemCount={results.length}
              itemSize={50}
              width="100%"
            >
              {Row}
            </List>
          ) : (
            !loading && query.length >= 2 && (
              <div className="p-4 text-sm text-gray-500">No products found</div>
            )
          )}
        </div>
      )}
    </div>
  )
}