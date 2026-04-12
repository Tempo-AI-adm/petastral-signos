'use client'

export function ShareCTA({ petName }: { petName: string }) {
  const handleShare = () => {
    const url = window.location.href
    const text = `fiz o laudo de ${petName} kkk 😂 ${url}\nfazer card grátis: signopet.com.br`
    if (navigator.share) {
      navigator.share({ text })
    } else {
      navigator.clipboard.writeText(text)
    }
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg,#a855f7,#ec4899)',
      borderRadius: 16, padding: '16px 20px', marginBottom: 16, textAlign: 'center',
    }}>
      <div style={{ fontSize: 14, color: 'white', marginBottom: 10, fontWeight: 600 }}>
        Gostou do que descobriu sobre {petName}? 🐾
      </div>
      <button
        onClick={handleShare}
        style={{
          background: 'white', color: '#a855f7', border: 'none',
          borderRadius: 999, padding: '10px 24px',
          fontWeight: 700, fontSize: 14, cursor: 'pointer',
        }}
      >
        📩 Compartilhar por mensagem no Instagram
      </button>
    </div>
  )
}
