/**
 * Задание 1.2 — «Первые слова Гильдии».
 * Запуск: npm run test:e2e -- lessons/1.2
 */
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';

describe('1.2 — Первые слова Гильдии', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET / отвечает 200', async () => {
    await request(app.getHttpServer()).get('/').expect(200);
  });

  it('GET / приветствует Гильдию героев', async () => {
    const res = await request(app.getHttpServer()).get('/');
    expect(res.text).toContain('Гильдию героев');
  });

  it('GET / больше не говорит "Hello World!"', async () => {
    const res = await request(app.getHttpServer()).get('/');
    expect(res.text).not.toContain('Hello World');
  });
});
