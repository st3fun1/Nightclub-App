import { NightclubAppPage } from './app.po';

describe('nightclub-app App', () => {
  let page: NightclubAppPage;

  beforeEach(() => {
    page = new NightclubAppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
