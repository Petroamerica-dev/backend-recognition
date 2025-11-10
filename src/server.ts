import { createApp } from "./app"
import { testConnection } from "./config/db";
import { PORT, NODE_ENV } from "./config/env";

const startServer = async () => {
    try {
        await testConnection();
        const app = createApp();
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
            console.log(`📝 Environment: ${NODE_ENV}`);
            console.log(`📊 Database conected`);
        })
    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error);
        process.exit(1);
    }
}

startServer();