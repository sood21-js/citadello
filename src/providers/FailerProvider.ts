import {  DeliveryRequest, DeliveryOption } from '../models/common';
import { getRandomInt } from '../utils/random';
import { DeliveryProvider } from './DeliveryProvider';

export class MockFailingProvider extends DeliveryProvider {
  readonly name = 'Failing Delivery';
  readonly providerCode = 'failing';

  private failureRate: number = 0.7; // 70% вероятность ошибки
  private callCount: number = 0;

  async calculateCost(request: DeliveryRequest): Promise<DeliveryOption> {
    this.callCount++;

    // Имитация задержки сети
    await new Promise((resolve) => setTimeout(resolve, getRandomInt(100, 1000)));

    // Имитация случайных ошибок
    if (Math.random() < this.failureRate) {
      const errors = [
        new Error('API временно недоступен'),
        new Error('Превышено время ожидания'),
        new Error('Ошибка авторизации'),
        new Error('Внутренняя ошибка сервера'),
      ];
      throw errors[getRandomInt(0, errors.length - 1)];
    }

    // Если успешно - возвращаем результат
    return {
      provider: this.providerCode,
      name: this.name,
      cost: getRandomInt(200, 800),
      days: getRandomInt(2, 5),
      description: `Успешная доставка после ${this.callCount} попыток`,
    };
  }
}
