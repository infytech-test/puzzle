import { TestBed } from '@angular/core/testing';
import { expect } from 'chai';
import { ReplaySubject } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { DataPersistence, NxModule } from '@nrwl/angular';
import {
  SharedTestingModule,
  createUpdateItem,
  createUpdatedListItem
} from '@tmo/shared/testing';

import { ReadingListEffects } from './reading-list.effects';
import * as ReadingListActions from './reading-list.actions';
import { HttpTestingController } from '@angular/common/http/testing';

describe('ToReadEffects', () => {
  let actions: ReplaySubject<any>;
  let effects: ReadingListEffects;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NxModule.forRoot(), SharedTestingModule],
      providers: [
        ReadingListEffects,
        DataPersistence,
        provideMockActions(() => actions),
        provideMockStore()
      ]
    });

    effects = TestBed.inject(ReadingListEffects);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('loadReadingList$', () => {
    it('should work', done => {
      actions = new ReplaySubject();
      actions.next(ReadingListActions.loadReadingList());

      effects.loadReadingList$.subscribe(action => {
        expect(action).to.eql(
          ReadingListActions.loadReadingListSuccess({ list: [] })
        );
        done();
      });

      httpMock.expectOne('/api/reading-list').flush([]);
    });

    it('It should mark the book as finished successfully', done => {
      const updateItem = createUpdateItem('A');
      const updatedListItem = createUpdatedListItem('A');
      actions = new ReplaySubject();
      actions.next(
        ReadingListActions.updateBookStatus({
          item: updateItem
        })
      );

      effects.updateBook$.subscribe(action => {
        expect(action).to.eql(
          ReadingListActions.confirmedUpdateBookStatus({ item: updateItem })
        );
        done();
      });
      httpMock
        .expectOne('/api/reading-list/A/finished')
        .flush([updatedListItem]);
    });
  });
});
