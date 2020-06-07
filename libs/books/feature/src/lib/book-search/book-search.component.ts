import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  addToReadingList,
  getReadingList,
  removeFromReadingList,
  clearSearch,
  getAllBooks,
  ReadingListBook,
  searchBooks
} from '@tmo/books/data-access';
import { FormBuilder } from '@angular/forms';
import { Book, ReadingListItem } from '@tmo/shared/models';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'tmo-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss']
})
export class BookSearchComponent implements OnInit {
  books: ReadingListBook[];
  listItems: ReadingListItem[];
  readingList$ = this.store.select(getReadingList);
  readonly snackBarDelay: number = 3000; // 3000ms

  searchForm = this.fb.group({
    term: ''
  });

  constructor(
    private readonly store: Store,
    private readonly fb: FormBuilder,
    private _snackBar: MatSnackBar
  ) {}

  get searchTerm(): string {
    return this.searchForm.value.term;
  }

  ngOnInit(): void {
    this.store.select(getAllBooks).subscribe(books => {
      this.books = books;
    });
    this.store.select(getReadingList).subscribe(listItems => {
      this.listItems = listItems;
    });
  }

  formatDate(date: void | string) {
    return date
      ? new Intl.DateTimeFormat('en-US').format(new Date(date))
      : undefined;
  }

  addBookToReadingList(book: Book) {
    this.store.dispatch(addToReadingList({ book }));
    const snackBarRef = this._snackBar.open(
      'Added the book to the reading list',
      'Undo',
      {
        duration: this.snackBarDelay
      }
    );
    snackBarRef.onAction().subscribe(() => {
      this.undoReadingList(book);
    });
  }

  undoReadingList(book: Book) {
    if (book.id !== null && book.id !== undefined && book.id !== '') {
      const index = this.listItems.findIndex(x => x.bookId === book.id);
      this.store.dispatch(
        removeFromReadingList({ item: this.listItems[index] })
      );
    }
  }

  searchExample() {
    this.searchForm.controls.term.setValue('javascript');
    this.searchBooks();
  }

  searchBooks() {
    if (this.searchForm.value.term) {
      this.store.dispatch(searchBooks({ term: this.searchTerm }));
    } else {
      this.store.dispatch(clearSearch());
    }
  }
}
