import React, { useState } from 'react'
import Kpi from '../components/ui/Kpi'
import { Badge } from '../components/ui/Badge'
import { Modal } from '../components/ui/Modal'

export const UIShowcase: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-display-lg font-display font-bold text-dark-gray mb-4">🎨 UI Component Showcase</h1>
        <p className="text-body-lg text-gray-600">Modern, polished components with gradients, animations, and professional styling</p>
      </div>

      {/* Typography Section */}
      <section className="mb-12">
        <h2 className="text-heading-xl font-display font-bold text-dark-gray mb-6">Typography System</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-2xl p-8 border border-gray-200">
          <div>
            <h3 className="text-display-lg">Display Large</h3>
            <p className="text-gray-600">3.5rem, Bold</p>
          </div>
          <div>
            <h3 className="text-display-md">Display Medium</h3>
            <p className="text-gray-600">2.875rem, Bold</p>
          </div>
          <div>
            <h3 className="text-heading-xl">Heading XL</h3>
            <p className="text-gray-600">2rem, Semibold</p>
          </div>
          <div>
            <h3 className="text-heading-lg">Heading Large</h3>
            <p className="text-gray-600">1.875rem, Semibold</p>
          </div>
          <div>
            <p className="text-body-lg">Body Large - 1.125rem</p>
          </div>
          <div>
            <p className="text-body-md">Body Medium - 1rem</p>
          </div>
        </div>
      </section>

      {/* Colors & Gradients */}
      <section className="mb-12">
        <h2 className="text-heading-xl font-display font-bold text-dark-gray mb-6">Color & Gradients</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card-elevated border border-white/40 p-6">
            <div className="w-full h-24 bg-gradient-primary rounded-lg mb-3 shadow-glow-blue"></div>
            <p className="font-bold">Primary Gradient</p>
            <p className="text-sm text-gray-600">#1741FF → #0F2ECC</p>
          </div>
          <div className="card-elevated border border-white/40 p-6">
            <div className="w-full h-24 bg-gradient-accent rounded-lg mb-3 shadow-glow-purple"></div>
            <p className="font-bold">Accent Gradient</p>
            <p className="text-sm text-gray-600">#7C3AED → #06B6D4</p>
          </div>
          <div className="card-elevated border border-white/40 p-6">
            <div className="w-full h-24 bg-gradient-success rounded-lg mb-3"></div>
            <p className="font-bold">Success Gradient</p>
            <p className="text-sm text-gray-600">#10B981 → #06B6D4</p>
          </div>
          <div className="card-elevated border border-white/40 p-6">
            <div className="w-full h-24 bg-gradient-warm rounded-lg mb-3"></div>
            <p className="font-bold">Warm Gradient</p>
            <p className="text-sm text-gray-600">#FF6B6B → #FFD93D</p>
          </div>
        </div>
      </section>

      {/* KPI Cards */}
      <section className="mb-12">
        <h2 className="text-heading-xl font-display font-bold text-dark-gray mb-6">KPI Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Kpi title="Primary KPI" value="2,543" delta="↑ 12% growth" icon="📊" color="primary" />
          <Kpi title="Success KPI" value="$1.2M" delta="↑ 8% from last month" icon="💰" color="success" />
          <Kpi title="Warning KPI" value="450" delta="↓ 3% decrease" icon="⚠️" color="warning" />
        </div>
      </section>

      {/* Badges */}
      <section className="mb-12">
        <h2 className="text-heading-xl font-display font-bold text-dark-gray mb-6">Badges</h2>
        <div className="bg-white rounded-2xl p-8 border border-gray-200 flex flex-wrap gap-4">
          <Badge variant="default">Default</Badge>
          <Badge variant="success">✓ Success</Badge>
          <Badge variant="warning">⚠ Warning</Badge>
          <Badge variant="danger">✕ Danger</Badge>
          <Badge variant="info">ℹ Info</Badge>
        </div>
      </section>

      {/* Buttons */}
      <section className="mb-12">
        <h2 className="text-heading-xl font-display font-bold text-dark-gray mb-6">Buttons</h2>
        <div className="bg-white rounded-2xl p-8 border border-gray-200 space-y-4">
          <div className="flex flex-wrap gap-3">
            <button className="btn-primary">Primary Button</button>
            <button className="btn-secondary">Secondary Button</button>
            <button className="btn-ghost">Ghost Button</button>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="btn-primary disabled:opacity-50" disabled>Disabled Primary</button>
            <button className="btn-primary">
              <span>Loading...</span>
            </button>
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="mb-12">
        <h2 className="text-heading-xl font-display font-bold text-dark-gray mb-6">Card Variants</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card hover:shadow-card-lg transition-all">
            <p className="font-bold mb-2">Default Card</p>
            <p className="text-gray-600">Standard card with subtle shadow and border</p>
          </div>
          <div className="card-elevated border border-white/40">
            <p className="font-bold mb-2">Elevated Card</p>
            <p className="text-gray-600">Card with gradient background and elevated shadow</p>
          </div>
          <div className="card-interactive">
            <p className="font-bold mb-2">Interactive Card</p>
            <p className="text-gray-600">Hover to see the interactive effects</p>
          </div>
        </div>
      </section>

      {/* Animations */}
      <section className="mb-12">
        <h2 className="text-heading-xl font-display font-bold text-dark-gray mb-6">Animations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card-elevated border border-white/40 p-6">
            <div className="animate-fadeInUp w-12 h-12 bg-gradient-primary rounded-lg mb-4"></div>
            <p className="font-bold">Fade In Up</p>
            <p className="text-sm text-gray-600">Element fades in and slides up</p>
          </div>
          <div className="card-elevated border border-white/40 p-6">
            <div className="animate-pulse-glow w-12 h-12 bg-gradient-accent rounded-lg mb-4"></div>
            <p className="font-bold">Pulse Glow</p>
            <p className="text-sm text-gray-600">Element has a pulsing glow effect</p>
          </div>
        </div>
      </section>

      {/* Modal Demo */}
      <section className="mb-12">
        <h2 className="text-heading-xl font-display font-bold text-dark-gray mb-6">Modal Component</h2>
        <div className="bg-white rounded-2xl p-8 border border-gray-200">
          <button 
            onClick={() => setModalOpen(true)}
            className="btn-primary"
          >
            Open Modal Demo
          </button>
        </div>
        <Modal 
          open={modalOpen} 
          onClose={() => setModalOpen(false)}
          title="Modal Example"
          subtitle="This is a beautifully designed modal component"
          icon="🎉"
        >
          <div className="space-y-4">
            <p className="text-gray-700">This modal demonstrates the enhanced UI design with gradients, animations, and professional styling.</p>
            <div className="flex gap-3">
              <button className="btn-primary">Confirm</button>
              <button className="btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </Modal>
      </section>

      {/* Design System Info */}
      <section className="mb-12 bg-gradient-to-r from-primary/10 to-accent-purple/10 rounded-2xl p-8 border border-white/40">
        <h2 className="text-heading-xl font-display font-bold text-dark-gray mb-4">✨ Design System Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
          <div>
            <p className="font-bold mb-2">🎨 Color Palette</p>
            <p className="text-sm">Primary, Accent, Success, Warning, Danger colors with gradient variations</p>
          </div>
          <div>
            <p className="font-bold mb-2">📝 Typography</p>
            <p className="text-sm">Complete typography scale from Display Large to Body Small</p>
          </div>
          <div>
            <p className="font-bold mb-2">🌊 Gradients</p>
            <p className="text-sm">Beautiful gradient overlays for cards, buttons, and backgrounds</p>
          </div>
          <div>
            <p className="font-bold mb-2">✨ Animations</p>
            <p className="text-sm">Smooth fade-in, slide, pulse, and glow animations</p>
          </div>
          <div>
            <p className="font-bold mb-2">🎯 Spacing</p>
            <p className="text-sm">Consistent padding and margins based on 4px grid</p>
          </div>
          <div>
            <p className="font-bold mb-2">🔲 Components</p>
            <p className="text-sm">Complete library of buttons, cards, inputs, badges, and more</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default UIShowcase
