import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  getReadingList,
  removeFromReadingList,
  ReadingListBook,
  getAllBooks,
  addToReadingList
} from '@tmo/books/data-access';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'tmo-reading-list',
  templateUrl: './reading-list.component.html',
  styleUrls: ['./reading-list.component.scss']
})
export class ReadingListComponent implements OnInit {
  books: ReadingListBook[];
  readingList$ = this.store.select(getReadingList);
  readonly snackBarDelay: number = 3000; // 3000ms

  constructor(private readonly store: Store, private _snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.store.select(getAllBooks).subscribe(books => {
      this.books = books;
    });
  }

  removeFromReadingList(item) {
    this.store.dispatch(removeFromReadingList({ item }));
    const snackBarRef = this._snackBar.open(
      'Removed the book from reading list',
      'Undo',
      {
        duration: this.snackBarDelay
      }
    );
    snackBarRef.onAction().subscribe(() => {
      this.undoReadingList(item);
    });
  }

  undoReadingList(item) {
    if (
      item.bookId !== null &&
      item.bookId !== undefined &&
      item.bookId !== ''
    ) {
      const index = this.books.findIndex(x => x.id === item.bookId);
      this.store.dispatch(addToReadingList({ book: this.books[index] }));
    }
  }
}
