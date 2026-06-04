export function AdUnit({ zone }: { zone: 'header' | 'sidebar' | 'sidebar-bottom' }) {
  let sizeClass = 'h-[90px]'
  let text = 'Anúncio (728x90)'
  
  if (zone === 'sidebar') {
    sizeClass = 'h-[250px] max-w-[300px]'
    text = 'Anúncio (300x250)'
  } else if (zone === 'sidebar-bottom') {
    sizeClass = 'h-[600px] max-w-[300px]'
    text = 'Anúncio (300x600)'
  }

  return (
    <div className={`w-full bg-muted border border-border flex items-center justify-center rounded-lg relative overflow-hidden group mx-auto ${sizeClass}`}>
      <span className="text-muted-foreground text-sm font-medium z-10">{text}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
    </div>
  )
}
