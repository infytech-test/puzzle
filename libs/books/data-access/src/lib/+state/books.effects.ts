import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { fetch } from '@nrwl/angular';
import * as BooksActions from './books.actions';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Book } from '@tmo/shared/models';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'

@Injectable()
export class BooksEffects {
  readonly debounceTimeDelay:number = 500; // 500ms
  searchBooks$ = createEffect(() =>
    this.actions$.pipe(
      debounceTime(this.debounceTimeDelay),
      distinctUntilChanged(),
      ofType(BooksActions.searchBooks),
      fetch({
        run: action => {
          return this.http
            .get<Book[]>(`/api/books/search?q=${action.term}`)
            .pipe(
              map(data => BooksActions.searchBooksSuccess({ books: data }))
            );
        },

        onError: (action, error) => {
          console.error('Error', error);
          return BooksActions.searchBooksFailure({ error });
        }
      })
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly http: HttpClient
  ) {}
}
