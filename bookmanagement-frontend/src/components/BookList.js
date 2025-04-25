// src/components/BookList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/BookList.css';

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

  const handleDelete = async (id) => {
    const ok = window.confirm('정말 삭제할까요?');
    if (!ok) return;

    try {
      await axios.delete(`http://localhost:8080/api/books/${id}`);
      alert('삭제 완료!');
      setBooks(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      console.error(err);
      alert('삭제 실패 😢');
    }
  };

  return (
    <div style={{ marginTop: '30px' }}>
      <h2>📚 등록된 책 목록</h2>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        justifyContent: 'center'
      }}>
        {books.map((book) => (
          <div key={book.id} style={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '16px',
            width: '250px',
            backgroundColor: '#f9f9f9'
          }}>
            {book.thumbnail ? (
              <img
                src={book.thumbnail}
                alt={`${book.title} 썸네일`}
                style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
              />
            ) : (
              <div style={{
                width: '100%',
                height: '160px',
                backgroundColor: '#eee',
                textAlign: 'center',
                lineHeight: '160px',
                color: '#aaa',
                fontSize: '14px'
              }}>
                이미지 없음
              </div>
            )}
            <h3 style={{ fontSize: '16px', margin: '10px 0 4px' }}>{book.title}</h3>
            <p style={{ fontSize: '14px', color: '#555' }}>{book.author}</p>
            <p style={{ fontSize: '12px', color: '#777' }}>{book.publisher}</p>
            <div style={{ marginTop: '10px', textAlign: 'center' }}>
              <button className="edbutton" onClick={() => handleDelete(book.id)}>삭제</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BookList;
