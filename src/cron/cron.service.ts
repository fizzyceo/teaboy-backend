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

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT) // Executes every 10 seconds
  async MenuRefresh() {
    // Fetch all cache keys

    const keys = await this.cacheManager.store.keys();
    console.log("All cache keys:", keys);

    // Filter keys that contain the word "menu"
    const menuKeys = keys.filter((key) => key.includes("menu"));

    for (const key of menuKeys) {
      console.log(`Clearing cache for key: ${key}`);
      if (key.includes(":")) {
        //we use the token to regenerate the data related to that user
      } else {
        await this.cacheManager.del(key);
      }
    }
    const menuEndpoints = [
      "v2/menu", // GET: Get all menus
      "v2/menu/:id", // GET: Get menu details by ID
      "v2/menu/:id/items", // GET: Get menu items for a menu by ID
      "v2/menu/s/:encryptedToken", // GET: Get menu from token
      "v2/menu/links/a", // GET: Get links with encrypted data
      "v2/menu/list/a", // GET: Get menu list
      "menu", // GET: Get all menus
      "menu/links/a", //GET: we get the encryptedToken from here
      "menu/s/:encryptedToken", // GET: Get menu from token
      "menu/list/a", // GET: Get menu list, we iterate through the response of this, get the menu_id and use it on the below endpoints to store them in the cache
      "menu/:id", // GET: Get menu details by ID
      "menu/:id/items", // GET: Get menu items for a menu by ID
    ];

    const response = await this.httpService
      .get(`http://localhost:8000/api/menu/links/a`)
      .toPromise(); // Ensure the endpoint corresponds to the endpoint URL
    const menuLinks = response.data;
    const links = menuLinks.map((ml) => ml.encrypted);
    console.log(links);

    const menuIds = menuLinks.map((ml) => ml.menu_id);

    await this.cacheManager.set("/api/menu/links/a", menuLinks); // Set TTL to 24 hours

    for (const link of links) {
      const response = await this.httpService
        .get(`http://localhost:8000/api/menu/s/${link}`)
        .toPromise(); // Ensure the endpoint corresponds to the endpoint URL

      await this.cacheManager.set(`/api/menu/s/${link}`, response.data); // Set TTL to 24 hours
    }
    for (const menuId of menuIds) {
      console.log(menuId);

      const response = await this.httpService
        .get(`http://localhost:8000/api/menu/${menuId}`)
        .toPromise(); // Ensure the endpoint corresponds to the endpoint URL

      await this.cacheManager.set(`/api/menu/${menuId}`, response.data); // Set TTL to 24 hours

      const response2 = await this.httpService
        .get(`http://localhost:8000/api/menu/${menuId}/items`)
        .toPromise(); // Ensure the endpoint corresponds to the endpoint URL

      await this.cacheManager.set(`/api/menu/${menuId}/items`, response2.data); // Set TTL to 24 hours
    }

    const menuresponselist = await this.httpService
      .get(`http://localhost:8000/api/menu/list/a`)
      .toPromise(); // Ensure the endpoint corresponds to the endpoint URL
    const menuList = menuresponselist.data;
    await this.cacheManager.set("/api/menu/list/a", menuList); // Set TTL to 24 hours

    // Re-cache the fetched data

    // Dynamically fetch the data for this key

    console.log("Menu cache refreshed for all relevant keys.");
  }
}
