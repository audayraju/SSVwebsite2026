import React, { createContext, useContext, useEffect, useState } from 'react'

const FavoritesContext = createContext(null)

export function FavoritesProvider({ children }) {
    const [favorites, setFavorites] = useState([])

    // load from localStorage
    useEffect(() => {
        try {
            const raw = localStorage.getItem('ssv_favorites')
            if (raw) setFavorites(JSON.parse(raw))
        } catch (e) {
            console.warn('Failed to load favorites', e)
        }
    }, [])

    // persist
    useEffect(() => {
        try {
            localStorage.setItem('ssv_favorites', JSON.stringify(favorites))
        } catch (e) {
            console.warn('Failed to save favorites', e)
        }
    }, [favorites])

    function addFavorite(item) {
        setFavorites(prev => {
            if (prev.find(p => p.id === item.id)) return prev
            return [...prev, item]
        })
    }

    function removeFavorite(id) {
        setFavorites(prev => prev.filter(p => p.id !== id))
    }

    function toggleFavorite(item) {
        if (favorites.find(p => p.id === item.id)) removeFavorite(item.id)
        else addFavorite(item)
    }

    function isFavorite(id) {
        return favorites.some(p => p.id === id)
    }

    return (
        <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, toggleFavorite, isFavorite }}>
            {children}
        </FavoritesContext.Provider>
    )
}

export function useFavorites() {
    const ctx = useContext(FavoritesContext)
    if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider')
    return ctx
}

export default FavoritesContext
