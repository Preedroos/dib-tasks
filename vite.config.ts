import type { UserConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default {
  plugins: [
    tailwindcss(),
    react()
  ],
} satisfies UserConfig
