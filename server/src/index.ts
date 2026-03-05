import './db';
import { seedDatabase } from './seed';
seedDatabase(); // Automatically seed if database is empty

import app from './app';

const PORT = Number(process.env.PORT) || 3001;

app.listen(PORT, () => {
    console.log(`🚀  Inventory API running on http://localhost:${PORT}`);
});
