const request = require('supertest');
const app = require('./index');

describe('GET endpoints', () => {
  it('should get the weather forecast', async () => {
    const res = await request(app).get(
      '/darkSky?latitude=-33.923189097929544&longitude=150.9193301849991&time=1577232000'
    );

    expect(res.statusCode).toEqual(200);
  });

  it('should get the name of a certain postal code', async () => {
    const res = await request(app).get('/geoNames?zip=Liverpool');

    expect(res.statusCode).toEqual(200);
    expect(JSON.parse(res.text).placeName).toEqual('Liverpool');
    expect(JSON.parse(res.text).postalCode).toEqual('2170');
  });


  it('should get an image url from pixabay', async () => {
    const res = await request(app).get('/pixabay?image=Liverpool');

    expect(res.statusCode).toEqual(200);
    expect(res.text).toContain('http');
  });

});
