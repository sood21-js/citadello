import { DeliveryRequest, DeliveryOption } from '../models/common';
import { DeliveryProvider } from './DeliveryProvider';
import { getRandomInt } from '../utils/random';

export class MockBoxberryProvider extends DeliveryProvider {
  readonly name = 'Boxberry Standard';
  readonly providerCode = 'boxberry';

  private readonly cityPrices: Record<string, number> = {
    москва: 300,
    казань: 500,
    'санкт-петербург': 400,
    новосибирск: 600,
  };

  private readonly baseDays = getRandomInt(1, 10);

  async calculateCost(request: DeliveryRequest): Promise<DeliveryOption> {
    // Имитация задержки API
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 1500));

    const city = request.address.city.toLowerCase();
    const cost = this.cityPrices[city] || 700; // Дефолтная цена для неизвестных городов

    return {
      provider: this.providerCode,
      name: this.name,
      cost,
      days: this.baseDays,
      description: `Фиксированная ставка для ${request.address.city}`,
    };
  }
}
