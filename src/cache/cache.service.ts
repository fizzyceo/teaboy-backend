import { CacheInterceptor } from "@nestjs/cache-manager";
import { Injectable, ExecutionContext } from "@nestjs/common";

@Injectable()
export class UserSpecificCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest();

    const user = request.user; // Assumes the user is added to the request by the authentication guard

    if (!user) {
      // If no user is present, fall back to the default cache key
      return super.trackBy(context);
    }

    // Include user-specific details in the cache key
    const cacheKey = `${request.url}:user=${user.user_id}`;
    return cacheKey;
  }
}
