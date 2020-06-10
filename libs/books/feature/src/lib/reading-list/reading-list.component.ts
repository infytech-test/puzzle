import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  getReadingList,
  removeFromReadingList,
  ReadingListBook,
  getAllBooks,
  addToReadingList,
  updateBookStatus
} from '@tmo/books/data-access';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReadingListItem } from '@tmo/shared/models';
import { Update } from '@ngrx/entity';

@Component({
  selector: 'tmo-reading-list',
  templateUrl: './reading-list.component.html',
  styleUrls: ['./reading-list.component.scss']
})
export class ReadingListComponent implements OnInit {
  books: ReadingListBook[];
  itemUpdated: ReadingListItem;
  readingList$ = this.store.select(getReadingList);
  readonly snackBarDelay: number = 3000; // 3000ms
  isFinished = true;

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
    const index = this.books.findIndex(x => x.id === item.bookId);
    this.store.dispatch(addToReadingList({ book: this.books[index] }));
  }

  updateReadingStatus(item) {
    const params: Update<ReadingListItem> = {
      id: item.bookId,
      changes: {
        finished: true,
        finishedDate: '' + new Date().toISOString()
      }
    };
    this.store.dispatch(updateBookStatus({ item: params }));
  }
}
