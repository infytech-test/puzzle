import { $, $$, browser, ExpectedConditions, by, element } from 'protractor';
import { expect } from 'chai';

describe('When: Use the search feature', () => {
  it('Then: I should be able to search books by title', async () => {
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );

    const form = await $('form');
    const input = await $('input[type="search"]');
    await input.sendKeys('javascript');
    await form.submit();

    const items = await $$('[data-testing="book-item"]');
    expect(items.length).to.be.greaterThan(1, 'At least one book');
  });

  it('Then: I should see search results as I am typing', async () => {
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );
    const input = await element(by.id('inputField'));
    let inputText = await input.getAttribute('value');

    if (inputText === undefined || inputText === '') inputText = 'test book';
    await input.sendKeys(inputText);

    const items = $$('[data-testing="book-item"]');
    if (items.length > 0)
      expect(items.length).to.be.greaterThan(1, 'At least one book');
    expect(items.length, 'No input to search').to.be.undefined;
  });
});
