from transformers import pipeline

class LightLLM:
    def __init__(self):
        self.classifier = pipeline(
            "text-generation",
            model="deepseek-ai/deepseek-coder-1.3b-base",  # Smaller model
            device_map="auto"
        )
    
    def generate_response(self, prompt: str, max_length: int = 256) -> str:
        response = self.classifier(prompt, max_length=max_length, temperature=0.7)[0]['generated_text']
        return response.strip()
