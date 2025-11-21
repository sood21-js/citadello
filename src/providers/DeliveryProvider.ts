import { DeliveryOption, DeliveryRequest } from '../models/common';
import { DEFAULT_MAX_RETRIES, DEFAULT_RETRY_DELAY, MAX_PROVIDER_TIMEOUT } from './const';

export abstract class DeliveryProvider {
  abstract readonly name: string;
  abstract readonly providerCode: string;

  protected timeout: number = 5000; // Таймаут на одну операцию
  protected maxRetries: number = DEFAULT_MAX_RETRIES;
  protected retryDelay: number = DEFAULT_RETRY_DELAY;

  abstract calculateCost(request: DeliveryRequest): Promise<DeliveryOption>;

  protected async withTimeout<T>(promise: () => Promise<T>, timeoutMs: number = this.timeout): Promise<T> {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(`Provider timeout after ${timeoutMs}ms`)), timeoutMs);
    });

    return Promise.race([promise(), timeoutPromise]);
  }

  protected async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  protected async withRetry<T>(operation: () => Promise<T>, maxRetries: number = this.maxRetries): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Attempt ${attempt}/${maxRetries} for ${this.name}`);
        return await operation();
      } catch (error) {
        lastError = error as Error;
        console.warn(`Attempt ${attempt}/${maxRetries} failed for ${this.name}:`, lastError.message);

        if (attempt < maxRetries) {
          // Экспоненциальная задержка с джиттером
          const delay = this.retryDelay * Math.pow(2, attempt - 1) + Math.random() * 1000;
          console.log(`Retrying ${this.name} in ${Math.round(delay)}ms...`);
          await this.sleep(delay);
        }
      }
    }

    throw lastError!;
  }

  public async getOptions(request: DeliveryRequest): Promise<DeliveryOption | null> {
    try {
      const operation = () => this.withRetry(() => this.calculateCost(request));
      return await this.withTimeout(operation, MAX_PROVIDER_TIMEOUT);
    } catch (error) {
      console.error(`Provider ${this.name} failed after ${this.maxRetries} attempts:`, error);
      return null;
    }
  }
}
