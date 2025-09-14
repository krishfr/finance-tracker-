import ReactDOM from 'react-dom/client';
import './index.css'; // ✅ this pulls in Tailwind styles

import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
