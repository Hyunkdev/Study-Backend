package com.book.bookmanagement.repository;

import com.book.bookmanagement.domain.Book;
import org.springframework.data.jpa.repository.JpaRepository;

public interface bookrepository extends JpaRepository<Book, Long> {
    // Custom query methods can be defined here if needed
    // For example, findByTitle, findByAuthor, etc.
}