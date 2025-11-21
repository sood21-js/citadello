import { DeliveryRequest } from '../../models/common';
import { MockBoxberryProvider } from '../MockBoxberryProvider';
import { MockCdekProvider } from '../MockCdekProvider';

describe('Delivery Providers', () => {
  const mockRequest: DeliveryRequest = {
    cart: {
      weight: 5,
      dimensions: { length: 10, width: 10, height: 10 },
      total: 1000,
    },
    address: {
      city: 'Москва',
      street: 'Тестовая',
      house: '1',
    },
  };

  describe('MockCdekProvider', () => {
    const provider = new MockCdekProvider();

    it('should calculate cost based on weight', async () => {
      const option = await provider.calculateCost(mockRequest);

      expect(option.provider).toBe('cdek');
      expect(option.cost).toBe(500); // 5kg * 100 руб/кг
      expect(typeof option.days).toBe('number'); // Исправлено: было instanceof 'number'
      expect(option.description).toContain('Доставка по весу'); // Исправлено: может быть разный текст
    });

    it('should handle different weights correctly', async () => {
      const heavyRequest = { ...mockRequest, cart: { ...mockRequest.cart, weight: 10 } };
      const option = await provider.calculateCost(heavyRequest);

      expect(option.cost).toBe(1000);
    });
  });

  describe('MockBoxberryProvider', () => {
    const provider = new MockBoxberryProvider();

    it('should return fixed price for Moscow', async () => {
      const option = await provider.calculateCost(mockRequest);

      expect(option.provider).toBe('boxberry');
      expect(option.cost).toBe(300);
      expect(typeof option.days).toBe('number'); // Исправлено: может быть случайное число
      expect(option.description).toContain('Москва');
    });

    it('should return correct price for Kazan', async () => {
      const kazanRequest = {
        ...mockRequest,
        address: { ...mockRequest.address, city: 'Казань' },
      };
      const option = await provider.calculateCost(kazanRequest);

      expect(option.cost).toBe(500);
    });

    it('should return default price for unknown city', async () => {
      const unknownRequest = {
        ...mockRequest,
        address: { ...mockRequest.address, city: 'НеизвестныйГород' },
      };
      const option = await provider.calculateCost(unknownRequest);

      expect(option.cost).toBe(700);
    });
  });
});
