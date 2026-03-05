import './db'; // Ensure DB and schema are initialised before server starts
import app from './app';

const PORT = Number(process.env.PORT) || 3001;

app.listen(PORT, () => {
    console.log(`🚀  Inventory API running on http://localhost:${PORT}`);
});
