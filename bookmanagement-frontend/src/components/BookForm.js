// src/components/BookForm.js
import React, { useState } from 'react';
import axios from 'axios';
import '../styles/BookForm.css'; // CSS 파일을 import 합니다.

const BookForm = () => {
  const [book, setBook] = useState({
    title: '',
    author: '',
    isbn: '',
    publisher: '',
  });

  const handleChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/books', book);
      alert('책 등록 성공!');
      setBook({ title: '', author: '', isbn: '', publisher: '' });
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

export default BookForm;
