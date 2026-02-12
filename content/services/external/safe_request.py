# student_Reco/content/services/external/safe_request.py

import time
import requests


def safe_get(url, params=None, headers=None, timeout=10, retries=2, backoff=1.5):
    """
    Safe GET request:
    - Handles rate limit (429)
    - Handles timeouts/network errors
    - Retries with backoff
    - Returns (data, error_str)
    """
    params = params or {}
    headers = headers or {}

    last_error = None

    for attempt in range(retries + 1):
        try:
            resp = requests.get(url, params=params, headers=headers, timeout=timeout)

            # Rate limit
            if resp.status_code == 429:
                last_error = "429 Too Many Requests"
                sleep_for = backoff * (attempt + 1)
                time.sleep(sleep_for)
                continue

            resp.raise_for_status()
            return resp.json(), None

        except requests.RequestException as e:
            last_error = str(e)
            sleep_for = backoff * (attempt + 1)
            time.sleep(sleep_for)

    return None, last_error
