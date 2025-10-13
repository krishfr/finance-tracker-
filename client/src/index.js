import ReactDOM from 'react-dom/client';
import './index.css';

// 🛑 FIX: ALL IMPORTS MUST BE AT THE TOP 🛑
import App from './App'; // <-- MOVED UP HERE

// Importing and registering ChartJS components ONCE here
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);