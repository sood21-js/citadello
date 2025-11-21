import { DeliveryRequest } from "../../models/common";
import { DeliveryService } from "../DeliveryService";

describe('DeliveryService', () => {
  let deliveryService: DeliveryService;

  beforeEach(() => {
    deliveryService = new DeliveryService();
  });

  const mockRequest: DeliveryRequest = {
    cart: {
      weight: 3,
      dimensions: { length: 10, width: 10, height: 10 },
      total: 1500,
    },
    address: {
      city: 'Москва',
      street: 'Тестовая',
      house: '1',
    },
  };

  it('should return options from all providers', async () => {
    const response = await deliveryService.getDeliveryOptions(mockRequest);

    expect(response.options).toHaveLength(2);
    expect(response.options[0].cost).toBeLessThanOrEqual(response.options[1].cost);

    const providers = response.options.map((opt: any) => opt.provider);
    expect(providers).toContain('cdek');
    expect(providers).toContain('boxberry');
  });

  it('should sort options by cost', async () => {
    const response = await deliveryService.getDeliveryOptions(mockRequest);

    for (let i = 0; i < response.options.length - 1; i++) {
      expect(response.options[i].cost).toBeLessThanOrEqual(response.options[i + 1].cost);
    }
  });
});
