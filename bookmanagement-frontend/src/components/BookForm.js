// src/components/BookForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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
  const KAKAO_API_KEY = '카카오 REST API 키';
  const navigate = useNavigate();

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
      await axios.post('http://localhost:8080/api/books', book);
      alert('책 등록 완료!');
      navigate('/');
    } catch (err) {
      console.error('요청 실패 😢', err);
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
      <button type="submit">등록</button>
    </form>
  );
};

export default BookForm;
