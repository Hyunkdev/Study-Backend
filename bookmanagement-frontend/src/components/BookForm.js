// src/components/BookForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/BookForm.css';

const BookForm = () => {
  const [book, setBook] = useState({
    title: '',
    author: '',
    isbn: '',
    publisher: '',
    thumbnail: ''
  });

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const KAKAO_API_KEY = 'c2cdcb1669151f246510e55c5e3f1722'; // 실제 발급받은 키로 교체 필요
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      setBook(location.state);
    }
  }, [location]);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setBook((prev) => ({ ...prev, [name]: value }));

    if (name === 'title' && value.trim() !== '') {
      try {
        const response = await axios.get('https://dapi.kakao.com/v3/search/book', {
          headers: {
            Authorization: `KakaoAK ${KAKAO_API_KEY}`,
          },
          params: {
            query: value,
            target: 'title'
          }
        });

        setSuggestions(response.data.documents || []);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Kakao 책 검색 에러:', error);
      }
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (item) => {
    setBook({
      title: item.title || '',
      author: item.authors?.[0] || '',
      isbn: item.isbn || '',
      publisher: item.publisher || '',
      thumbnail: item.thumbnail || ''
    });
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (book.id) {
        await axios.put(`http://localhost:8080/api/books/${book.id}`, book);
        alert('책 수정 완료!');
      } else {
        await axios.post('http://localhost:8080/api/books', book);
        alert('책 등록 완료!');
      }
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('요청 실패 😢');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ position: 'relative' }}>
        <input
          name="title"
          value={book.title}
          onChange={handleChange}
          placeholder="제목"
          required
          autoComplete="off"
        />
        {showSuggestions && suggestions.length > 0 && (
          <ul className="autocomplete-list">
            {suggestions.slice(0, 5).map((item, index) => (
              <li
                key={index}
                onClick={() => handleSuggestionClick(item)}
                className="autocomplete-item"
              >
                {item.title}
              </li>
            ))}
          </ul>
        )}
      </div>
      <input name="author" value={book.author} onChange={handleChange} placeholder="저자" required />
      <input name="isbn" value={book.isbn} onChange={handleChange} placeholder="ISBN" required />
      <input name="publisher" value={book.publisher} onChange={handleChange} placeholder="출판사" required />
      {book.thumbnail && (
        <img src={book.thumbnail} alt="썸네일" style={{ width: '120px', marginTop: '10px' }} />
      )}
      <button type="submit">{book.id ? '수정' : '등록'}</button>
    </form>
  );
};

export default BookForm;
