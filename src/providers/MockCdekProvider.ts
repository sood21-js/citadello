import { DeliveryRequest, DeliveryOption } from '../models/common';
import { DeliveryProvider } from './DeliveryProvider';
import { getRandomInt } from '../utils/random';

export class MockCdekProvider extends DeliveryProvider {
  readonly name = 'CDEK Express';
  readonly providerCode = 'cdek';

  private readonly pricePerKg = 100;
  private readonly baseDays = getRandomInt(10, 20);

  async calculateCost(request: DeliveryRequest): Promise<DeliveryOption> {
    // Имитация задержки API
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000));

    const cost = request.cart.weight * this.pricePerKg;

    return {
      provider: this.providerCode,
      name: this.name,
      cost: Math.round(cost),
      days: this.baseDays,
      description: 'Доставка по весу',
    };
  }
}
