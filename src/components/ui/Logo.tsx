export function Logo() {
  return (
    <div className="flex items-center gap-3">
      {/* Ícone Geométrico Premium (Globo Abstrato Minimalista) */}
      <svg
        width="36"
        height="36"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Círculo Principal */}
        <circle cx="50" cy="50" r="46" className="stroke-foreground" strokeWidth="6" />
        
        {/* Linhas do Globo (Latitudes e Longitudes Abstratas) */}
        <ellipse cx="50" cy="50" rx="20" ry="46" className="stroke-foreground" strokeWidth="3" />
        <line x1="4" y1="50" x2="96" y2="50" className="stroke-foreground" strokeWidth="3" />
        
        {/* Detalhe de corc (Ponto focal "Primary") */}
        <circle cx="70" cy="30" r="8" className="fill-primary" />
      </svg>
      
      {/* Texto do Logo */}
      <div className="flex flex-col justify-center">
        <span className="text-2xl font-black font-serif tracking-tighter leading-none text-foreground uppercase">
          B&M<span className="text-primary">.</span>
        </span>
        <span className="text-[9px] font-bold tracking-[0.2em] text-muted-foreground uppercase leading-none mt-1">
          News Portal
        </span>
      </div>
    </div>
  )
}
