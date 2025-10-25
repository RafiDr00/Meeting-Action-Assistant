import React from 'react';
import { Mic, Sparkles, Upload, Calendar, Users, Target, Zap, ArrowRight } from 'lucide-react';
import Hero3D from './Hero3D';

interface UnusualFrontierProps {
  onEnterApp?: () => void;
}

export default function UnusualFrontier({ onEnterApp }: UnusualFrontierProps) {
  // Inline styles to ensure visibility over 3D background
  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: '#0a0a0a',
    color: '#f5f5f5',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    position: 'relative',
    overflow: 'auto'
  };

  const backgroundStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1
  };

  const contentOverlayStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 2000,
    minHeight: '100vh',
    backgroundColor: 'rgba(10, 10, 10, 0.85)',
    backdropFilter: 'blur(2px)'
  };

  const glassStyle: React.CSSProperties = {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
  };

  const headerStyle: React.CSSProperties = {
    padding: '24px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
  };

  const mainStyle: React.CSSProperties = {
    padding: '48px 24px',
    maxWidth: '1200px',
    margin: '0 auto'
  };

  return (
    <div style={containerStyle}>
      {/* Background Layer */}
      <div style={backgroundStyle}>
        <Hero3D />
      </div>

      {/* Content Layer - Guaranteed Visible */}
      <div style={contentOverlayStyle}>
        {/* Header */}
        <header style={headerStyle}>
          <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #ffffff, #999999)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
              }}>
                <Mic size={24} color="#000" />
              </div>
              <div>
                <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#ffffff' }}>
                  Meeting AI
                </h1>
                <p style={{ margin: 0, fontSize: '12px', color: '#999999' }}>
                  Neural Action Assistant
                </p>
              </div>
            </div>

            {/* Launch Button */}
            <button
              onClick={onEnterApp}
              style={{
                ...glassStyle,
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease'
              }}
            >
              <span>Launch App</span>
              <ArrowRight size={16} />
            </button>
          </nav>
        </header>

        {/* Main Content */}
        <main style={mainStyle}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: window.innerWidth > 1024 ? '1fr 1fr' : '1fr',
            gap: '48px', 
            alignItems: 'center' 
          }}>
            
            {/* Left Column - Hero Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {/* AI Badge */}
              <div style={{
                ...glassStyle,
                padding: '8px 16px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                alignSelf: 'flex-start'
              }}>
                <Sparkles size={16} color="#ffffff" />
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#ffffff' }}>
                  AI-Powered Meeting Intelligence
                </span>
              </div>

              {/* Main Headline */}
              <div>
                <h2 style={{
                  margin: 0,
                  fontSize: window.innerWidth > 768 ? '56px' : '40px',
                  fontWeight: '900',
                  lineHeight: '1.1',
                  color: '#ffffff'
                }}>
                  Transform Your
                </h2>
                <h2 style={{
                  margin: 0,
                  fontSize: window.innerWidth > 768 ? '56px' : '40px',
                  fontWeight: '900',
                  lineHeight: '1.1',
                  background: 'linear-gradient(135deg, #ffffff, #999999)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  Meetings Into Action
                </h2>
              </div>

              {/* Description */}
              <p style={{
                margin: 0,
                fontSize: '18px',
                lineHeight: '1.6',
                color: '#cccccc',
                maxWidth: '500px'
              }}>
                Automatically transcribe meetings, extract action items, and track tasks with advanced AI. 
                Never miss a follow-up again.
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <button
                  onClick={onEnterApp}
                  style={{
                    ...glassStyle,
                    padding: '16px 32px',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#ffffff',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  <Upload size={20} />
                  <span>Start Processing</span>
                </button>
                
                <button style={{
                  ...glassStyle,
                  padding: '16px 32px',
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#ffffff',
                  border: 'none',
                  cursor: 'pointer'
                }}>
                  View Demo
                </button>
              </div>

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '24px' }}>
                {[
                  { value: '98%', label: 'Accuracy' },
                  { value: '2min', label: 'Processing' },
                  { value: '100+', label: 'Languages' }
                ].map((stat, i) => (
                  <div key={i} style={{ ...glassStyle, padding: '20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffffff', marginBottom: '4px' }}>
                      {stat.value}
                    </div>
                    <div style={{ fontSize: '12px', color: '#999999' }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Feature Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {[
                { icon: Calendar, title: 'Smart Transcription', desc: 'Advanced AI transcribes meetings with speaker identification and timestamps.' },
                { icon: Target, title: 'Action Item Extraction', desc: 'Automatically identifies tasks, owners, and deadlines from conversations.' },
                { icon: Users, title: 'Team Collaboration', desc: 'Share insights, assign tasks, and track progress across your team.' }
              ].map((feature, i) => (
                <div key={i} style={{ ...glassStyle, padding: '24px' }}>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      background: 'linear-gradient(135deg, #ffffff, #666666)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <feature.icon size={24} color="#000" />
                    </div>
                    <div>
                      <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 'bold', color: '#ffffff' }}>
                        {feature.title}
                      </h3>
                      <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.5', color: '#cccccc' }}>
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Status Indicator */}
              <div style={{
                ...glassStyle,
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    background: '#ffffff',
                    borderRadius: '50%',
                    animation: 'pulse 2s infinite'
                  }} />
                  <Zap size={20} color="#ffffff" />
                  <span style={{ fontWeight: '600', color: '#ffffff' }}>AI Engine Online</span>
                </div>
                <span style={{ fontSize: '14px', color: '#999999' }}>Ready to process</span>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Pulse Animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
