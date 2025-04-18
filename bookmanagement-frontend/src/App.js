import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import BookList from './components/BookList'; // BookList 컴포넌트 경로 확인하고 수정
import BookForm from './components/BookForm'; // BookForm 도 쓸 거면 같이 추가


function App() {
  return (
    <Router>
      <div>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>📚 Book Management</h1>
          <Link to="/add">
            <button style={{ margin:'10px', padding: '10px 20px', borderRadius: '6px', backgroundColor: '#4a90e2', color: 'white', border: 'none' }}>
              책 등록
            </button>
          </Link>
        </header>

        <Routes>
          <Route path="/" element={<BookList/>} />
          <Route path="/add" element={<BookForm/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
