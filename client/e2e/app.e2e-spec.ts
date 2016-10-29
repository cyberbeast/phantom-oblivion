import { PhantomOblivionPage } from './app.po';

describe('phantom-oblivion App', function() {
  let page: PhantomOblivionPage;

  beforeEach(() => {
    page = new PhantomOblivionPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
