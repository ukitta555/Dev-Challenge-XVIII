import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';

describe('E2E', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Vertical mode, squares, just-the-right-sheet', () => {
    return request(app.getHttpServer())
      .post('/api/simple_box')
      .send({
        sheetSize: {
          w: 150,
          l: 200,
        },
        boxSize: {
          w: 50,
          h: 50,
          d: 50,
        },
      })
      .expect(200)
      .expect({
        success: true,
        amount: 1,
        program: [
          {
            command: 'START',
          },
          {
            command: 'GOTO',
            x: 0,
            y: 150,
          },
          {
            command: 'DOWN',
          },
          {
            command: 'GOTO',
            x: 50,
            y: 150,
          },
          {
            command: 'GOTO',
            x: 50,
            y: 200,
          },
          {
            command: 'UP',
          },
          {
            command: 'GOTO',
            x: 100,
            y: 200,
          },
          {
            command: 'DOWN',
          },
          {
            command: 'GOTO',
            x: 100,
            y: 150,
          },
          {
            command: 'GOTO',
            x: 150,
            y: 150,
          },
          {
            command: 'UP',
          },
          {
            command: 'GOTO',
            x: 150,
            y: 100,
          },
          {
            command: 'DOWN',
          },
          {
            command: 'GOTO',
            x: 100,
            y: 100,
          },
          {
            command: 'GOTO',
            x: 100,
            y: 0,
          },
          {
            command: 'UP',
          },
          {
            command: 'GOTO',
            x: 50,
            y: 0,
          },
          {
            command: 'DOWN',
          },
          {
            command: 'GOTO',
            x: 50,
            y: 100,
          },
          {
            command: 'GOTO',
            x: 0,
            y: 100,
          },
          {
            command: 'STOP',
          },
        ],
      });
  });

  it('Horizontal mode, squares, just-the-right-sheet', () => {
    return request(app.getHttpServer())
      .post('/api/simple_box')
      .send({
        sheetSize: {
          w: 200,
          l: 150,
        },
        boxSize: {
          w: 50,
          h: 50,
          d: 50,
        },
      })
      .expect(200)
      .expect({
        success: true,
        amount: 1,
        program: [
          {
            command: 'START',
          },
          {
            command: 'GOTO',
            x: 50,
            y: 0,
          },
          {
            command: 'DOWN',
          },
          {
            command: 'GOTO',
            x: 50,
            y: 50,
          },
          {
            command: 'GOTO',
            x: 0,
            y: 50,
          },
          {
            command: 'UP',
          },
          {
            command: 'GOTO',
            x: 0,
            y: 100,
          },
          {
            command: 'DOWN',
          },
          {
            command: 'GOTO',
            x: 50,
            y: 100,
          },
          {
            command: 'GOTO',
            x: 50,
            y: 150,
          },
          {
            command: 'UP',
          },
          {
            command: 'GOTO',
            x: 100,
            y: 150,
          },
          {
            command: 'DOWN',
          },
          {
            command: 'GOTO',
            x: 100,
            y: 100,
          },
          {
            command: 'GOTO',
            x: 200,
            y: 100,
          },
          {
            command: 'UP',
          },
          {
            command: 'GOTO',
            x: 200,
            y: 50,
          },
          {
            command: 'DOWN',
          },
          {
            command: 'GOTO',
            x: 100,
            y: 50,
          },
          {
            command: 'GOTO',
            x: 100,
            y: 0,
          },
          {
            command: 'STOP',
          },
        ],
      });
  });

  it('Horizontal mode, different box sizes, fits easily', () => {
    return request(app.getHttpServer())
      .post('/api/simple_box')
      .send({
        sheetSize: {
          w: 1000,
          l: 1000,
        },
        boxSize: {
          w: 50,
          h: 100,
          d: 200,
        },
      })
      .expect(200)
      .expect({
        success: true,
        amount: 1,
        program: [
          { command: 'START' },
          { command: 'GOTO', x: 50, y: 0 },
          { command: 'DOWN' },
          { command: 'GOTO', x: 50, y: 50 },
          { command: 'GOTO', x: 0, y: 50 },
          { command: 'UP' },
          { command: 'GOTO', x: 0, y: 250 },
          { command: 'DOWN' },
          { command: 'GOTO', x: 50, y: 250 },
          { command: 'GOTO', x: 50, y: 300 },
          { command: 'GOTO', x: 150, y: 300 },
          { command: 'GOTO', x: 150, y: 250 },
          { command: 'GOTO', x: 300, y: 250 },
          { command: 'GOTO', x: 300, y: 50 },
          { command: 'GOTO', x: 150, y: 50 },
          { command: 'GOTO', x: 150, y: 0 },
          { command: 'STOP' },
        ],
      });
  });

  it('Horizontal mode, size permutations required to fit the box', () => {
    return request(app.getHttpServer())
      .post('/api/simple_box')
      .send({
        sheetSize: {
          w: 300,
          l: 300,
        },
        boxSize: {
          w: 50,
          d: 200,
          h: 100,
        },
      })
      .expect(200)
      .expect({
        success: true,
        amount: 1,
        program: [
          { command: 'START' },
          { command: 'GOTO', x: 50, y: 0 },
          { command: 'DOWN' },
          { command: 'GOTO', x: 50, y: 50 },
          { command: 'GOTO', x: 0, y: 50 },
          { command: 'UP' },
          { command: 'GOTO', x: 0, y: 250 },
          { command: 'DOWN' },
          { command: 'GOTO', x: 50, y: 250 },
          { command: 'GOTO', x: 50, y: 300 },
          { command: 'UP' },
          { command: 'GOTO', x: 150, y: 300 },
          { command: 'DOWN' },
          { command: 'GOTO', x: 150, y: 250 },
          { command: 'GOTO', x: 300, y: 250 },
          { command: 'UP' },
          { command: 'GOTO', x: 300, y: 50 },
          { command: 'DOWN' },
          { command: 'GOTO', x: 150, y: 50 },
          { command: 'GOTO', x: 150, y: 0 },
          { command: 'STOP' },
        ],
      });
  });

  it('Vertical mode, size permutations required to fit the box', () => {
    return request(app.getHttpServer())
      .post('/api/simple_box')
      .send({
        sheetSize: {
          w: 350,
          l: 300,
        },
        boxSize: {
          w: 50,
          d: 250,
          h: 100,
        },
      })
      .expect(200)
      .expect({
        success: true,
        amount: 1,
        program: [
          { command: 'START' },
          { command: 'GOTO', x: 0, y: 250 },
          { command: 'DOWN' },
          { command: 'GOTO', x: 50, y: 250 },
          { command: 'GOTO', x: 50, y: 300 },
          { command: 'UP' },
          { command: 'GOTO', x: 300, y: 300 },
          { command: 'DOWN' },
          { command: 'GOTO', x: 300, y: 250 },
          { command: 'GOTO', x: 350, y: 250 },
          { command: 'UP' },
          { command: 'GOTO', x: 350, y: 150 },
          { command: 'DOWN' },
          { command: 'GOTO', x: 300, y: 150 },
          { command: 'GOTO', x: 300, y: 0 },
          { command: 'UP' },
          { command: 'GOTO', x: 50, y: 0 },
          { command: 'DOWN' },
          { command: 'GOTO', x: 50, y: 150 },
          { command: 'GOTO', x: 0, y: 150 },
          { command: 'STOP' },
        ],
      });
  });

  it('Impossible to make a box', () => {
    return request(app.getHttpServer())
      .post('/api/simple_box')
      .send({
        sheetSize: {
          w: 199,
          l: 150,
        },
        boxSize: {
          w: 50,
          h: 50,
          d: 50,
        },
      })
      .expect(422)
      .expect({
        success: false,
        error: 'Invalid sheet size. Too small for producing at least one box',
      });
  });

  it('Missing parameter in box sizes', () => {
    return request(app.getHttpServer())
      .post('/api/simple_box')
      .send({
        sheetSize: {
          w: 200,
          l: 150,
        },
        boxSize: {
          w: 50,
          h: 50,
        },
      })
      .expect(422)
      .expect({
        success: false,
        error:
          'Invalid input format. Box size params: w, h, d; sheet size: l, w',
      });
  });

  it('Missing parameter in sheet sizes', () => {
    return request(app.getHttpServer())
      .post('/api/simple_box')
      .send({
        sheetSize: {
          w: 200,
        },
        boxSize: {
          w: 50,
          h: 50,
          d: 123,
        },
      })
      .expect(422)
      .expect({
        success: false,
        error:
          'Invalid input format. Box size params: w, h, d; sheet size: l, w',
      });
  });

  it('Non-positive size (sheet)', () => {
    return request(app.getHttpServer())
      .post('/api/simple_box')
      .send({
        sheetSize: {
          w: 0,
          h: -123,
        },
        boxSize: {
          w: 50,
          h: 50,
          d: 123,
        },
      })
      .expect(422)
      .expect({
        success: false,
        error: 'Invalid input format. Please use only positive integers',
      });
  });

  it('Non-positive size (box)', () => {
    return request(app.getHttpServer())
      .post('/api/simple_box')
      .send({
        sheetSize: {
          w: 200,
          l: 100,
        },
        boxSize: {
          w: 50,
          h: 0,
          d: -123,
        },
      })
      .expect(422)
      .expect({
        success: false,
        error: 'Invalid input format. Please use only positive integers',
      });
  });
});
