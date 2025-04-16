import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 9090;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.get('/', (req, res) => {
  res.send('Test server is working!');
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});