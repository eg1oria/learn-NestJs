/**
 * Задание 1.4 — «Босс: Табличка у входа».
 * Запуск: npm run test:e2e -- lessons/1.4
 */
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';

const ISO_8601 = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

describe('1.4 — Босс: Табличка у входа', () => {
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

  it('GET /health отвечает 200 и JSON', async () => {
    await request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  it('status равен "ok"', async () => {
    const { body } = await request(app.getHttpServer()).get('/health');
    expect(body.status).toBe('ok');
  });

  it('uptime — неотрицательное число секунд', async () => {
    const { body } = await request(app.getHttpServer()).get('/health');
    expect(typeof body.uptime).toBe('number');
    expect(body.uptime).toBeGreaterThanOrEqual(0);
    // В секундах, а не в миллисекундах: тестовый процесс живёт меньше суток.
    expect(body.uptime).toBeLessThan(86_400);
  });

  it('uptime растёт со временем', async () => {
    const first = await request(app.getHttpServer()).get('/health');
    await sleep(50);
    const second = await request(app.getHttpServer()).get('/health');
    expect(second.body.uptime).toBeGreaterThan(first.body.uptime);
  });

  it('timestamp — ISO 8601 и текущее время', async () => {
    const before = Date.now();
    const { body } = await request(app.getHttpServer()).get('/health');
    const after = Date.now();

    expect(typeof body.timestamp).toBe('string');
    expect(body.timestamp).toMatch(ISO_8601);
    const ts = new Date(body.timestamp).getTime();
    expect(ts).toBeGreaterThanOrEqual(before - 1000);
    expect(ts).toBeLessThanOrEqual(after + 1000);
  });

  it('GET / по-прежнему приветствует Гильдию', async () => {
    const res = await request(app.getHttpServer()).get('/').expect(200);
    expect(res.text).toContain('Гильдию героев');
  });
});
