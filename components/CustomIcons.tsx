import React from 'react'

// Ícone SVG customizado para Sushi
export const SushiIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M2 12C2 9.79 3.79 8 6 8H18C20.21 8 22 9.79 22 12V16C22 18.21 20.21 20 18 20H6C3.79 20 2 18.21 2 16V12Z" />
    <circle cx="7" cy="12" r="1.5" fill="white" />
    <circle cx="12" cy="12" r="1.5" fill="white" />
    <circle cx="17" cy="12" r="1.5" fill="white" />
    <path d="M6 8V6C6 4.89 6.89 4 8 4H16C17.11 4 18 4.89 18 6V8" stroke="currentColor" strokeWidth="1" fill="none" />
  </svg>
)

// Ícone SVG customizado para Grill/Brasa
export const GrillIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M3 17H21L19 19H5L3 17Z" />
    <path d="M4 15H20V16H4V15Z" />
    <path d="M6 6L8 13H16L18 6H6Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <line x1="7" y1="3" x2="7" y2="5" stroke="currentColor" strokeWidth="1.5" />
    <line x1="12" y1="2" x2="12" y2="5" stroke="currentColor" strokeWidth="1.5" />
    <line x1="17" y1="3" x2="17" y2="5" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="10" cy="9" r="1" />
    <circle cx="14" cy="11" r="1" />
  </svg>
)

// Ícone SVG customizado para Cocktail
export const CocktailIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M5 7L12 14L19 7H5Z" />
    <line x1="12" y1="14" x2="12" y2="20" stroke="currentColor" strokeWidth="2" />
    <line x1="8" y1="20" x2="16" y2="20" stroke="currentColor" strokeWidth="2" />
    <circle cx="8" cy="9" r="1" fill="white" />
    <circle cx="16" cy="9" r="1" fill="white" />
    <path d="M7 4L17 4" stroke="currentColor" strokeWidth="1.5" />
  </svg>
)

// Ícone SVG customizado para Fish
export const FishIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M6.5 12C6.5 9 9 7 12 7S17.5 9 17.5 12S15 17 12 17S6.5 15 6.5 12Z" />
    <path d="M17.5 12L21 10V14L17.5 12Z" />
    <path d="M6.5 12L3 8L6.5 9.5V12Z" />
    <path d="M6.5 12L3 16L6.5 14.5V12Z" />
    <circle cx="14" cy="11" r="1" fill="white" />
    <path d="M10 12L12 14L14 12" stroke="white" strokeWidth="1" fill="none" />
  </svg>
)

// Ícone SVG customizado para Chopsticks
export const ChopsticksIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="6" y1="4" x2="22" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="5" cy="4" r="1" />
    <circle cx="7" cy="4" r="1" />
  </svg>
)

export const CustomIcons = {
  sushi: SushiIcon,
  grill: GrillIcon,
  cocktail: CocktailIcon,
  fish: FishIcon,
  chopsticks: ChopsticksIcon
}
