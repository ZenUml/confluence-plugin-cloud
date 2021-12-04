import {setUpWindowLocation} from './../../../tests/SetUpWindowLocation';
import App from "@/model/app/App";

describe('App', () => {
  it('should know the host', () => {
    setUpWindowLocation('', 'https://some.host.name')
    let app = new App();
    expect(app).toBeTruthy();
    expect(app.host).toBe('some.host.name');
  });
});