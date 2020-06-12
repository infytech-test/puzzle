import {
  $,
  browser,
  ExpectedConditions,
  element,
  by,
  $$,
  protractor
} from 'protractor';
import { expect } from 'chai';

describe('When: I use the reading list feature', () => {
  it('Then: I should see my reading list', async () => {
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );

    const readingListToggle = await $('[data-testing="toggle-reading-list"]');
    await readingListToggle.click();

    await browser.wait(
      ExpectedConditions.textToBePresentInElement(
        $('[data-testing="reading-list-container"]'),
        'My Reading List'
      )
    );
  });

  it('Then: I should see my snackbar undo action', async () => {
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );

    let readingListToggle = await $('[data-testing="toggle-reading-list"]');
    await readingListToggle.click();

    const removeToggle = await $$('[data-testing="remove-toggle"]');

    if (removeToggle.length > 0) {
      for (let i = 0; i < removeToggle.length; i++)
        await removeToggle[i].click();
    }

    browser.refresh();

    const input = await $('input[type="search"]');
    await input.sendKeys('undo');
    const items = await $$('[data-testing="book-item"]');
    expect(items.length).to.be.greaterThan(1, 'At least one book');
    browser.sleep(500);

    const firstElement = $$('[data-testing="book-item"]')
      .$$('button')
      .first();
    firstElement.click();
    expect(await firstElement.getAttribute('disabled')).equals('true');

    readingListToggle = await $('[data-testing="toggle-reading-list"]');
    await readingListToggle.click();

    const removeToggle_1 = await $$('[data-testing="remove-toggle"]').first();
    await removeToggle_1.click();

    const snackbar_undo = await $(
      '.mat-simple-snackbar-action.mat-focus-indicator.mat-button'
    );

    const deferred = protractor.promise.defer();
    const promise = deferred.promise;

    promise
      .then(function() {
        snackbar_undo.click();
      })
      .then(async function() {
        expect(
          (
            await $$(
              '[data-testing="reading-list-container"] .reading-list-content'
            )
          ).length
        ).equals(1);
      });
  });
});
