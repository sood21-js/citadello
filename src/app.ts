import express from 'express';
import { getDeliveryOptions } from './controllers/deliveryController';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Routes
app.post('/api/delivery/options', getDeliveryOptions);

// Health check
app.get('/health', (_, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Delivery service running on port ${PORT}`);
});

export default app;
