/**
 * Задание 1.1 — «Таверна гильдии».
 * Тест описывает контракт класса Tavern, а не его реализацию.
 * Запуск: npm run test:e2e -- lessons/1.1
 */
import { Tavern } from '../../src/playground/tavern';

const MENU = { эль: 5, похлёбка: 8, пирог: 12 };

async function timed<T>(fn: () => Promise<T>) {
  const start = Date.now();
  const result = await fn();
  return { result, ms: Date.now() - start };
}

describe('1.1 — Таверна гильдии', () => {
  let tavern: Tavern;

  beforeEach(() => {
    tavern = new Tavern('Пьяный дракон', MENU);
  });

  it('знает своё название', () => {
    expect(tavern.getName()).toBe('Пьяный дракон');
  });

  it('order() возвращает Promise', async () => {
    const pending = tavern.order('эль');
    expect(pending).toBeInstanceOf(Promise);
    await pending;
  });

  it('order() подаёт блюдо в формате "<блюдо> подано! С вас <цена> золотых"', async () => {
    await expect(tavern.order('эль')).resolves.toBe(
      'эль подано! С вас 5 золотых',
    );
    await expect(tavern.order('пирог')).resolves.toBe(
      'пирог подано! С вас 12 золотых',
    );
  });

  it('order() готовит блюдо около 100 мс', async () => {
    const { ms } = await timed(() => tavern.order('похлёбка'));
    expect(ms).toBeGreaterThanOrEqual(90);
    expect(ms).toBeLessThan(400);
  });

  it('order() отклоняет промис с Error, если блюда нет в меню', async () => {
    const pending = tavern.order('жареный дракон');
    await expect(pending).rejects.toBeInstanceOf(Error);
    await expect(tavern.order('жареный дракон')).rejects.toThrow(
      'жареный дракон',
    );
  });

  it('getEarnings() считает только успешно поданные заказы', async () => {
    expect(tavern.getEarnings()).toBe(0);
    await tavern.order('эль');
    await tavern.order('пирог');
    await tavern.order('несуществующее блюдо').catch(() => undefined);
    expect(tavern.getEarnings()).toBe(17);
  });

  it('у разных таверн своя выручка', async () => {
    const other = new Tavern('Сонный гоблин', MENU);
    await tavern.order('эль');
    expect(other.getEarnings()).toBe(0);
  });

  it('orderMany() возвращает ответы в том же порядке, что и заказ', async () => {
    await expect(tavern.orderMany(['пирог', 'эль'])).resolves.toEqual([
      'пирог подано! С вас 12 золотых',
      'эль подано! С вас 5 золотых',
    ]);
  });

  it('orderMany() готовит блюда параллельно, а не по очереди', async () => {
    const { result, ms } = await timed(() =>
      tavern.orderMany(['эль', 'похлёбка', 'пирог']),
    );
    expect(result).toHaveLength(3);
    expect(ms).toBeLessThan(250);
    expect(tavern.getEarnings()).toBe(25);
  });

  it('orderMany() отклоняется, если хотя бы одного блюда нет в меню', async () => {
    await expect(tavern.orderMany(['эль', 'единорог'])).rejects.toThrow(
      'единорог',
    );
  });
});
