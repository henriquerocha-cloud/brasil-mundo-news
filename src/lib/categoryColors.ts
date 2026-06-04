export const categoryColors: Record<string, string> = {
  'brasil': '#c4170c', // g1 red
  'mundo': '#0669de',  // globo.com blue
  'economia': '#008b5d', // valor economico green
  'politica': '#c4170c', // g1 red
  'esportes': '#06aa48', // ge green
  'tecnologia': '#f0a830', // tech orange
  'entretenimento': '#ff1493', // globo pop pink
  'default': '#0669de'
}

export function getCategoryColor(slug?: string) {
  if (!slug) return categoryColors.default
  return categoryColors[slug.toLowerCase()] || categoryColors.default
}
