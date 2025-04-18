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
    thumbnail: '',
  });

  const KAKAO_API_KEY = 'c2cdcb1669151f246510e55c5e3f1722';
  const navigate = useNavigate();

  const handleChange = async (e) => {
    const { name, value } = e.target;

    setBook((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 제목이 입력될 때만 카카오 API 호출
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

        const result = response.data.documents[0];
        if (result) {
          setBook((prev) => ({
            ...prev,
            thumbnail: result.thumbnail || '',
            author: prev.author || result.authors?.[0] || '',
            publisher: prev.publisher || result.publisher || '',
            isbn: prev.isbn || result.isbn || '',
          }));
        }
      } catch (error) {
        console.error('Kakao API 에러:', error);
      }
    }
  };

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
      <input name="title" value={book.title} onChange={handleChange} placeholder="제목" required />
      <input name="author" value={book.author} onChange={handleChange} placeholder="저자" required />
      <input name="isbn" value={book.isbn} onChange={handleChange} placeholder="ISBN" required />
      <input name="publisher" value={book.publisher} onChange={handleChange} placeholder="출판사" required />

      {book.thumbnail && (
        <img src={book.thumbnail} alt="책 이미지" style={{ width: '120px', marginTop: '10px' }} />
      )}

      <button type="submit">책 등록</button>
    </form>
  );
};

export default BookForm;
