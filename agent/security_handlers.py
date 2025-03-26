from typing import Dict

class BasePlatformHandler:
    async def test_connection(self) -> bool:
        raise NotImplementedError
        
    async def gather_data(self) -> Dict:
        raise NotImplementedError

class SplunkHandler(BasePlatformHandler):
    def __init__(self, config: Dict):
        self.host = config["host"]
        self.port = config["port"]
        self.token = config["token"]
        
    async def test_connection(self) -> bool:
        # Implement Splunk connection test
        pass
        
    async def gather_data(self) -> Dict:
        # Implement Splunk data gathering
        pass