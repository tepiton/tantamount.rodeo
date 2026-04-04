/**
 * Footnote Popover Interactions
 * Progressive enhancement for CSS-first footnote popovers
 * Handles keyboard navigation, touch interactions, and accessibility
 */

class FootnoteInteractions {
  constructor() {
    this.currentPopover = null
    this.isTouch = 'ontouchstart' in window
    this.init()
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup())
    } else {
      this.setup()
    }
  }

  setup() {
    // Find all enhanced footnote references
    this.footnoteRefs = document.querySelectorAll('a.footnote-enhanced[data-footnote-content]')
    
    if (this.footnoteRefs.length === 0) {
      return // No footnotes on this page
    }

    // Create popovers for each footnote
    this.createPopovers()

    // Set up interactions
    this.setupKeyboardNavigation()
    this.setupClickHandling()
    this.setupTouchHandling()
    this.setupAccessibility()
    
    // Show that JS enhancement is active
    document.body.classList.add('footnotes-js-enhanced')
  }

  createPopovers() {
    this.footnoteRefs.forEach((ref, index) => {
      const content = ref.getAttribute('data-footnote-content')
      const fnId = ref.getAttribute('data-footnote-id')
      
      // Create popover element
      const popover = document.createElement('div')
      popover.className = 'footnote-popover'
      popover.innerHTML = `
        <div class="footnote-popover-content">
          ${content}
        </div>
        <button class="footnote-popover-close" aria-label="Close footnote">×</button>
      `
      
      // Add popover to document body for absolute positioning
      document.body.appendChild(popover)
      
      // Store reference to popover on the link
      ref.footnotePopover = popover
      
      // Hide traditional footnotes once we have popovers
      const traditionalFootnotes = document.getElementById('footnotes-section')
      if (traditionalFootnotes) {
        traditionalFootnotes.style.display = 'none'
      }
    })
  }

  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // Esc key to close current popover
      if (e.key === 'Escape' && this.currentPopover) {
        this.closePopover()
        e.preventDefault()
      }
    })
  }

  setupClickHandling() {
    // Handle clicks on footnote references
    this.footnoteRefs.forEach(ref => {
      ref.addEventListener('click', (e) => {
        e.preventDefault()
        this.togglePopover(ref)
      })
    })

    // Handle clicks on close buttons
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('footnote-popover-close')) {
        e.preventDefault()
        this.closePopover()
      }
    })

    // Click outside to close
    document.addEventListener('click', (e) => {
      if (this.currentPopover && 
          !this.currentPopover.contains(e.target) && 
          !e.target.closest('.footnote-enhanced')) {
        this.closePopover()
      }
    })
  }

  setupTouchHandling() {
    if (!this.isTouch) return

    // Enhanced touch handling for mobile devices
    this.footnoteRefs.forEach(ref => {
      // Prevent default touch behavior that might interfere
      ref.addEventListener('touchstart', (e) => {
        e.stopPropagation()
      })

      // Handle long press for additional accessibility
      let touchTimer
      ref.addEventListener('touchstart', () => {
        touchTimer = setTimeout(() => {
          this.announceFootnote(ref)
        }, 500)
      })

      ref.addEventListener('touchend', () => {
        clearTimeout(touchTimer)
      })
    })
  }

  setupAccessibility() {
    // Add ARIA attributes for better screen reader support
    this.footnoteRefs.forEach((ref, index) => {
      const popover = ref.footnotePopover
      
      if (popover) {
        const popoverId = `footnote-popover-${index}`
        
        ref.setAttribute('aria-describedby', popoverId)
        ref.setAttribute('aria-expanded', 'false')
        ref.setAttribute('role', 'button')
        ref.setAttribute('tabindex', '0')
        
        popover.setAttribute('id', popoverId)
        popover.setAttribute('role', 'tooltip')
        popover.setAttribute('aria-hidden', 'true')
      }
    })

    // Handle Enter key on footnote references
    this.footnoteRefs.forEach(ref => {
      ref.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          this.togglePopover(ref)
        }
      })
    })
  }

  togglePopover(ref) {
    if (this.currentPopover === ref.footnotePopover) {
      this.closePopover()
    } else {
      this.openPopover(ref)
    }
  }

  openPopover(ref) {
    // Close any existing popover
    this.closePopover()
    
    const popover = ref.footnotePopover
    if (!popover) return
    
    this.currentPopover = popover
    
    // Update ARIA attributes
    ref.setAttribute('aria-expanded', 'true')
    popover.setAttribute('aria-hidden', 'false')
    
    // Position the popover relative to the reference
    this.positionPopover(ref, popover)
    
    // Show the popover
    popover.style.opacity = '1'
    popover.style.visibility = 'visible'
    popover.style.pointerEvents = 'auto'
    
    // Add active class for additional styling if needed
    ref.classList.add('footnote-active')
    
    // Announce to screen readers
    this.announceFootnote(ref)
    
    // Focus management for keyboard users
    if (document.activeElement === ref) {
      // Keep focus on the reference for easier closing with Esc
      ref.focus()
    }
  }

  closePopover() {
    if (!this.currentPopover) return
    
    // Find the corresponding ref
    const ref = Array.from(this.footnoteRefs).find(r => r.footnotePopover === this.currentPopover)
    
    if (ref) {
      // Update ARIA attributes
      ref.setAttribute('aria-expanded', 'false')
      this.currentPopover.setAttribute('aria-hidden', 'true')
      
      // Hide the popover
      this.currentPopover.style.opacity = '0'
      this.currentPopover.style.visibility = 'hidden'
      this.currentPopover.style.pointerEvents = 'none'
      
      // Remove active class
      ref.classList.remove('footnote-active')
    }
    
    this.currentPopover = null
  }
  
  positionPopover(ref, popover) {
    const refRect = ref.getBoundingClientRect()
    const popoverRect = popover.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    
    // Default position: above the reference, centered
    let top = refRect.top - popoverRect.height - 10
    let left = refRect.left + (refRect.width / 2) - (popoverRect.width / 2)
    let showBelow = false
    
    // Adjust if popover would go off the left edge
    if (left < 10) {
      left = 10
    }
    
    // Adjust if popover would go off the right edge
    if (left + popoverRect.width > viewportWidth - 10) {
      left = viewportWidth - popoverRect.width - 10
    }
    
    // If popover would go above viewport, position below instead
    if (top < 10) {
      top = refRect.bottom + 10
      showBelow = true
    }
    
    // Mobile handling: use fixed bottom positioning (no arrow needed)
    if (viewportWidth <= 640) {
      popover.style.position = 'fixed'
      popover.style.bottom = '20px'
      popover.style.left = '20px'
      popover.style.right = '20px'
      popover.style.top = 'auto'
      popover.style.transform = 'none'
      // Remove any arrow classes on mobile
      popover.classList.remove('arrow-up')
    } else {
      popover.style.position = 'absolute'
      popover.style.top = `${top + window.scrollY}px`
      popover.style.left = `${left}px`
      popover.style.bottom = 'auto'
      popover.style.right = 'auto'
      popover.style.transform = 'none'
      
      // Add arrow-up class if positioned below reference
      if (showBelow) {
        popover.classList.add('arrow-up')
      } else {
        popover.classList.remove('arrow-up')
      }
    }
  }

  announceFootnote(ref) {
    const announcer = document.getElementById('footnote-announcer')
    const popover = ref.footnotePopover
    
    if (announcer && popover) {
      const content = popover.querySelector('.footnote-popover-content')
      if (content) {
        // Clean up the content for screen readers
        const text = content.textContent.trim()
        announcer.textContent = `Footnote: ${text}`
        
        // Clear after announcement
        setTimeout(() => {
          announcer.textContent = ''
        }, 1000)
      }
    }
  }

  // Fallback method to show traditional footnotes if needed
  showFallbackFootnotes() {
    const fallbackSection = document.getElementById('footnotes-section')
    if (fallbackSection) {
      fallbackSection.style.display = 'block'
      console.log('Footnote popovers not supported, showing traditional footnotes')
    }
  }
}

// Initialize when script loads
new FootnoteInteractions()

// Export for potential external use
window.FootnoteInteractions = FootnoteInteractions