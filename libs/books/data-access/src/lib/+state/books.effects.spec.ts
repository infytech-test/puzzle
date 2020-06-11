import { TestBed } from '@angular/core/testing';
import { expect } from 'chai';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { DataPersistence, NxModule } from '@nrwl/angular';
import { ReplaySubject } from 'rxjs';
import { createBook, SharedTestingModule } from '@tmo/shared/testing';

import { BooksEffects } from './books.effects';
import * as BooksActions from './books.actions';
import { HttpTestingController } from '@angular/common/http/testing';
import { debounceTime } from 'rxjs/operators';

describe('BooksEffects', () => {
  let actions: ReplaySubject<any>;
  let effects: BooksEffects;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NxModule.forRoot(), SharedTestingModule],
      providers: [
        BooksEffects,
        DataPersistence,
        provideMockActions(() => actions),
        provideMockStore()
      ]
    });

    effects = TestBed.inject(BooksEffects);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('loadBooks$', () => {
    it('should work', done => {
      actions = new ReplaySubject();
      actions.next(BooksActions.searchBooks({ term: 'b' }));

      effects.searchBooks$.subscribe(action => {
        expect(action).to.eql(
          BooksActions.searchBooksSuccess({ books: [createBook('A')] })
        );
        done();
      });

      setTimeout(() => {
        httpMock.expectOne('/api/books/search?q=b').flush([createBook('A')]);
        done();
      }, 500);
    });
  });
});
