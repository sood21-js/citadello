import { DeliveryProvider } from './DeliveryProvider';
import { MockCdekProvider } from './MockCdekProvider';
import { MockBoxberryProvider } from './MockBoxberryProvider';
import { MockFailingProvider } from './FailerProvider';

export class ProviderFactory {
  private static providers: Map<string, DeliveryProvider> = new Map();

  static {
    this.registerProvider('cdek', new MockCdekProvider());
    this.registerProvider('boxberry', new MockBoxberryProvider());
    this.registerProvider('failer', new MockFailingProvider());
  }

  static registerProvider(code: string, provider: DeliveryProvider): void {
    this.providers.set(code, provider);
  }

  static getProvider(code: string): DeliveryProvider | undefined {
    return this.providers.get(code);
  }

  static getAllProviders(): DeliveryProvider[] {
    return Array.from(this.providers.values());
  }

  static getAvailableProviders(): string[] {
    return Array.from(this.providers.keys());
  }
}
