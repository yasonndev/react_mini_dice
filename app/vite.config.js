import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
    server: {
        host: true,      // Обязательно! Чтобы Vite слушал 0.0.0.0, а не только 127.0.0.1
        port: 5173,      // Внутренний порт контейнера

        // 1. Разрешаем домен ngrok
        allowedHosts: [
            'brett-lumpy-veronika.ngrok-free.dev',
            'localhost',
            '.ngrok-free.dev' // Разрешит любой поддомен ngrok (удобно!)
        ],

        // 2. Настройка Hot Module Replacement (HMR)
        // Без этого правки в коде не будут отображаться в Telegram без перезагрузки
        hmr: {
            clientPort: 443, // Ngrok работает через 443 (https)
            host: 'brett-lumpy-veronika.ngrok-free.dev',
            protocol: 'wss'  // Используем защищенный WebSocket
        },
    },
    plugins: [
      react(),
      tailwindcss(),
    ],
})
