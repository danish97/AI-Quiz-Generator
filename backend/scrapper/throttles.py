from rest_framework.throttling import SimpleRateThrottle
from django.core.cache import cache
from django.utils import timezone
import time

class QuizGenerationThrottle(SimpleRateThrottle):
    scope = "quiz_generation"
    rate = '2/10s'  # 2 requests per 10 seconds

    def get_cache_key(self, request, view):
        return self.get_ident(request)

    def allow_request(self, request, view):
        """
        Implement sliding window rate limiting for 2 requests per 10 seconds.
        """
        if self.rate is None:
            return True

        self.key = self.get_cache_key(request, view)
        if self.key is None:
            return True

        # Get the list of timestamps for this key
        timestamps = cache.get(self.key, [])

        # Remove timestamps older than 10 seconds
        now = time.time()
        timestamps = [ts for ts in timestamps if now - ts < 10]

        # Check if we can allow this request
        if len(timestamps) < 2:
            # Add current timestamp
            timestamps.append(now)
            cache.set(self.key, timestamps, 10)  # Cache for 10 seconds
            return True
        else:
            return False