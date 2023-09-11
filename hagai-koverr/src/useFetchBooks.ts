import { useState } from "react";
import { Book } from "./Types";

const MAX_RESULTS_PER_REQUEST = 25;
export interface Props {
  debouncedSearchTerm: string;
  currentPage: number;
  matchesPerPage: number;
}
async function fetchBooks({debouncedSearchTerm, currentPage, matchesPerPage}: Props) {
  try {
    let startIndex = (currentPage - 1) * matchesPerPage;
    let totalItemsFetched = 0;
    let totalItems = 0;
    let fetchedBooks: Book[]= [];

    while (totalItemsFetched < matchesPerPage) {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${debouncedSearchTerm}+cyber&startIndex=${startIndex}&maxResults=${Math.min(
          matchesPerPage - totalItemsFetched,
          MAX_RESULTS_PER_REQUEST
        )}`
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      fetchedBooks = fetchedBooks.concat(data.items);
      totalItemsFetched += data.items.length;

      if (totalItemsFetched < matchesPerPage) {
        startIndex += MAX_RESULTS_PER_REQUEST;
      }
      totalItems = data.totalItems
    }
    return {fetchedBooks, totalItems }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

export default function useFetchBooks() {
  const [books, setBooks] = useState<Book[]>([])
  const [totalItems, setTotalItems] = useState(0)

  async function handleFetchBooks ({debouncedSearchTerm, currentPage, matchesPerPage}: Props) {
    const responseData = await fetchBooks({debouncedSearchTerm, currentPage, matchesPerPage})
    if (responseData) {
      setBooks(responseData.fetchedBooks)
      setTotalItems(responseData.totalItems)
    }
  }

  return { books, totalItems, handleFetchBooks }
 

}