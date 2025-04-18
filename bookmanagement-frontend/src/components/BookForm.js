// src/components/BookForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // useNavigate를 import 합니다.
import '../styles/BookForm.css'; // CSS 파일을 import 합니다.

const BookForm = () => {
  const [book, setBook] = useState({
    title: '',
    author: '',
    isbn: '',
    publisher: '',
    thumbnail: '', // 썸네일 URL을 추가합니다.
  });

  const KAKAO_API_KEY = 'c2cdcb1669151f246510e55c5e3f1722';

  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setBook((prev) => ({
      ...prev,
      [name]: value,
    }) );

    if (name === 'title' && value.trim() !== '') {
      try {
        const response = axios.get(`https://dapi.kakao.com/v3/search/book`, {
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
            thumbnail: result.thumbnail, // 썸네일 URL을 설정합니다.
            author: prev.author || result.authors[0] || '', // 저자 정보가 없을 경우에만 설정합니다.
            publisher: prev.publisher || result.publisher || '', // 출판사 정보가 없을 경우에만 설정합니다.
            isbn: prev.isbn || result.isbn || '', // ISBN 정보가 없을 경우에만 설정합니다.
          }) );
        }


      } catch (error) {
      console.error('Error fetching book data:', error);
    }
    

    
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/books', book);
      alert('책 등록 성공!');
      setBook({ title: '', author: '', isbn: '', publisher: '' });

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
      <button type="submit">책 등록</button>
    </form>
  );
};
}
export default BookForm;
