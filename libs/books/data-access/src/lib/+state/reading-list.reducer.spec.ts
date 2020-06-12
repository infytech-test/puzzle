import { expect } from 'chai';
import * as ReadingListActions from './reading-list.actions';
import {
  initialState,
  readingListAdapter,
  reducer,
  State
} from './reading-list.reducer';
import {
  createBook,
  createReadingListItem,
  createUpdateItem
} from '@tmo/shared/testing';
import { Update } from '@ngrx/entity';

describe('Books Reducer', () => {
  describe('valid Books actions', () => {
    let state: State;

    beforeEach(() => {
      state = readingListAdapter.setAll(
        [createReadingListItem('A'), createReadingListItem('B')],
        initialState
      );
    });

    it('loadBooksSuccess should load books from reading list', () => {
      const list = [
        createReadingListItem('A'),
        createReadingListItem('B'),
        createReadingListItem('C')
      ];
      const action = ReadingListActions.loadReadingListSuccess({ list });

      const result: State = reducer(initialState, action);

      expect(result.loaded).to.be.true;
      expect(result.ids.length).to.eq(3);
    });

    it('failedAddToReadingList should undo book addition to the state', () => {
      const previousState = readingListAdapter.setAll(
        [createReadingListItem('A')],
        initialState
      );

      const action = ReadingListActions.failedAddToReadingList({
        book: createBook('B')
      });

      const result: State = reducer(previousState, action);

      expect(result.ids).to.eql(['A']);
    });

    it('failedRemoveFromReadingList should undo book removal from the state', () => {
      const previousState = readingListAdapter.setAll(
        [
          createReadingListItem('A'),
          createReadingListItem('B'),
          createReadingListItem('C')
        ],
        initialState
      );

      const action = ReadingListActions.failedRemoveFromReadingList({
        item: createReadingListItem('C')
      });

      const result: State = reducer(previousState, action);

      expect(result.ids).to.eql(['A', 'B', 'C']);
    });

    it('updateBookStatus should update book status to finished', () => {
      const updateItem = createUpdateItem('A');
      const action = ReadingListActions.updateBookStatus({
        item: updateItem
      });

      const result = reducer(initialState, action);
      expect(action.item.changes.finished).to.eql(
        ReadingListActions.confirmedUpdateBookStatus({ item: updateItem }).item
          .changes.finished
      );
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).to.eql(initialState);
    });
  });
});
