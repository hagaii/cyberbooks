import React, { useState, useEffect } from 'react';
import './Catalog.css';
import useDebounce from './useDebounce';
import Pagination from './Pagination';
import PurchaseForm from './PurchaseForm';
import { Book } from './Types';
import useFetchBooks from './useFetchBooks';

interface Props {}

const Catalog: React.FC<Props> = () => {
  const [searchTerm, setSearchTerm] = useState<string>(''); 
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [matchesPerPage, setMatchesPerPage] = useState<number>(25);
  const [selectedItems, setSelectedItems] = useState<Book[]>([]);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const {books, totalItems, handleFetchBooks}: {books: Book[], totalItems: number, handleFetchBooks: Function } = useFetchBooks()
  useEffect(() => {
    handleFetchBooks({debouncedSearchTerm, currentPage, matchesPerPage});
  }, [debouncedSearchTerm, currentPage, matchesPerPage]);

  const totalPages = Math.ceil(totalItems / matchesPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleCheckboxChange = (item: Book) => {
    const isSelected = selectedItems.includes(item);
    if (isSelected) {
      setSelectedItems(selectedItems.filter((selectedItem) => selectedItem !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const [showPurchaseForm, setShowPurchaseForm] = useState<boolean>(false);
  const [booksForForm, setBooksForForm] = useState<Book[]>(selectedItems)

  const handlePurchaseClick = (book: Book|null) => {
    setBooksForForm(book ? [book] : selectedItems)
    setShowPurchaseForm(true);
  };

  const handleCloseForm = () => {
    setShowPurchaseForm(false);
  };

  // TODO: handle the actual billing process here
  const handlePurchase = (formData: any) => {
    console.log('Purchase Data:', formData);
  };

  return !books.length ? null : (
    <>
      <h1>Catalog</h1>
      <input
        type="text"
        placeholder="Search for cyber books"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: '33%' }}
      />
      <div>
        <label>Matches Per Page:</label>
        <select
          value={matchesPerPage}
          onChange={(e) => setMatchesPerPage(Number(e.target.value))}
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      <div className="book-list">
        <ul>
          {books.map((book, index) => (
            <li key={index}>
              <label htmlFor={book.volumeInfo.title}>{book.volumeInfo.title}</label>
              <div onClick={()=>handlePurchaseClick(book)} style={{ width: '120px', minHeight: '60px' }}>
              {book.volumeInfo.imageLinks ? 
              <img
                src={book.volumeInfo.imageLinks.thumbnail}
                alt={book.volumeInfo.title}
              /> : 'No Image Available'}
              </div>
              <input type="checkbox" id={book.volumeInfo.title} checked={selectedItems.includes(book)} onChange={()=>handleCheckboxChange(book)} />
            </li>
          ))}
        </ul>
        <div>
        <button onClick={() => handlePurchaseClick(null)} disabled={selectedItems.length===0}>
        Purchase selected books
        </button>
        <button onClick={() => setSelectedItems([])} disabled={selectedItems.length===0}>
        Clear selected books
        </button> 
      </div>
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      
      <PurchaseForm books={booksForForm} isOpen={showPurchaseForm} onClose={handleCloseForm} onPurchase={handlePurchase} />
    </>
  );
};

export default Catalog;
