import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/BookForm.css'; // 스타일도 꼭 포함

const BookForm = () => {
  const [book, setBook] = useState({
    title: '',
    author: '',
    isbn: '',
    publisher: '',
    thumbnail: '',
  });

  const [suggestions, setSuggestions] = useState([]); // 자동완성 리스트
  const [showSuggestions, setShowSuggestions] = useState(false); // 드롭다운 표시 여부

  const KAKAO_API_KEY = 'c2cdcb1669151f246510e55c5e3f1722'; // 여기에 너의 API 키 넣기
  const navigate = useNavigate();

  // 입력값 변경 처리
  const handleChange = async (e) => {
    const { name, value } = e.target;

    setBook((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 제목 자동완성
    if (name === 'title' && value.trim() !== '') {
      try {
        const response = await axios.get('https://dapi.kakao.com/v3/search/book', {
          headers: {
            Authorization: `KakaoAK ${KAKAO_API_KEY}`,
          },
          params: {
            query: value,
            target: 'title',
          },
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

  // 추천 항목 클릭 시 자동 입력
  const handleSuggestionClick = (item) => {
    setBook({
      title: item.title || '',
      author: item.authors?.[0] || '',
      isbn: item.isbn || '',
      publisher: item.publisher || '',
      thumbnail: item.thumbnail || '',
    });
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/books', book);
      alert('책 등록 성공!');
      setBook({ title: '', author: '', isbn: '', publisher: '', thumbnail: '' });
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('등록 실패 😢');
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
                className="autocomplete-item"
                onClick={() => handleSuggestionClick(item)}
              >
                {item.title}
              </li>
            ))}
          </ul>
        )}
      </div>

      <input
        name="author"
        value={book.author}
        onChange={handleChange}
        placeholder="저자"
        required
      />
      <input
        name="isbn"
        value={book.isbn}
        onChange={handleChange}
        placeholder="ISBN"
        required
      />
      <input
        name="publisher"
        value={book.publisher}
        onChange={handleChange}
        placeholder="출판사"
        required
      />

      {book.thumbnail && (
        <img
          src={book.thumbnail}
          alt="책 썸네일"
          style={{ width: '120px', marginTop: '10px' }}
        />
      )}

      <button type="submit">책 등록</button>
    </form>
  );
};

export default BookForm;
