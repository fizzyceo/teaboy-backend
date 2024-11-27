import { HttpService } from "@nestjs/axios";
import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";

@Injectable()
export class CronService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly httpService: HttpService // Inject HttpService for dynamic API calls
  ) {}

  @Cron(CronExpression.EVERY_4_HOURS) // Executes every 10 seconds
  async MenuRefresh() {
    // Fetch all cache keys
    const keys = await this.cacheManager.store.keys();
    console.log("All cache keys:", keys);

    // Filter keys that contain the word "menu"
    const menuKeys = keys.filter((key) => key.includes("menu"));

    for (const key of menuKeys) {
      console.log(`Clearing cache for key: ${key}`);
      await this.cacheManager.del(key);

      // Dynamically fetch the data for this key
      try {
        const response = await this.httpService
          .get(`http://localhost:8000${key}`)
          .toPromise(); // Ensure the key corresponds to the endpoint URL
        const data = response.data;

        // Re-cache the fetched data
        console.log(`Re-caching data for key: ${key}`);
        await this.cacheManager.set(key, data); // Set TTL to 24 hours
      } catch (error) {
        console.error(`Error fetching data for key ${key}:`, error.message);
      }
    }

    console.log("Menu cache refreshed for all relevant keys.");
  }
}
