import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/BookList.css'; // CSS 파일을 import 합니다.

function BookList() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/books')
      .then((response) => {
        setBooks(response.data);
      })
      .catch((error) => {
        console.error('책 목록 불러오기 실패:', error);
      });
  }, []);

  return (
    <div style={{ marginTop: '30px' }}>
      <h2>등록된 책 목록</h2>
      <ul style={{ listStyle: 'none', padding: 0, textAlign: 'center'}}>
        {books.map((book) => (
          <li key={book.id} style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
            <strong>{book.title}</strong> - {book.author} ({book.publisher}) - {book.isbn}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BookList;
