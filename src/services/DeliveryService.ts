import { DeliveryRequest, DeliveryResponse, DeliveryOption } from '../models/common';
import { ProviderFactory } from '../providers';

export class DeliveryService {
  async getDeliveryOptions(request: DeliveryRequest): Promise<DeliveryResponse> {
    const providers = ProviderFactory.getAllProviders();

    // Параллельный опрос всех провайдеров
    const promises = providers.map((provider) => provider.getOptions(request));

    const results = await Promise.all(promises);

    // Фильтруем неудачные запросы и сортируем по цене
    const options = results
      .filter((option): option is DeliveryOption => option !== null)
      .sort((a, b) => a.cost - b.cost);

    return { options };
  }

  async addProvider(code: string, provider: any): Promise<void> {
    ProviderFactory.registerProvider(code, provider);
  }
}
