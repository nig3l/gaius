from typing import Dict, List
import random

class ResponseDatabase:
    def __init__(self):
        # Core response categories
        self.responses = {
            "greetings": {
                "formal": [
                    "Ave! I am Gaius Julius Caesar, your strategic defense commander.",
                    "Greetings from the command center. The defense matrix awaits your orders.",
                    "Welcome, commander. Our forces stand ready."
                ],
                "casual": [
                    "Ave! The digital legions await your command.",
                    "The cyber frontlines report all clear. What intelligence do you seek?",
                    "Your arrival is noted. How may I assist in today's campaign?"
                ]
            },
            "threat_analysis": {
                "high": [
                    "Our scouts report significant enemy movement. Recommend immediate defensive measures.",
                    "Multiple breach attempts detected. Deploying counter-measures across all sectors.",
                    "Critical threat level identified. Mobilizing rapid response teams."
                ],
                "medium": [
                    "Unusual activity detected in sector {sector}. Increasing surveillance.",
                    "Potential threats identified. Defensive posture remains stable.",
                    "Monitoring suspicious patterns in {location}. Forces ready to respond."
                ],
                "low": [
                    "All sectors reporting normal activity. Maintaining standard vigilance.",
                    "Defensive perimeter secure. No significant threats detected.",
                    "Routine patrols report all clear. Continuing regular monitoring."
                ]
            },
            "strategy": {
                "defensive": [
                    "Strengthening our positions at {location}. The enemy shall not pass.",
                    "Implementing layered defense strategy. All units coordinating.",
                    "Defensive matrix activated. Monitoring all approach vectors."
                ],
                "offensive": [
                    "Counter-strike preparations complete. Awaiting your command.",
                    "Enemy vulnerabilities identified in sector {sector}. Strike teams ready.",
                    "Offensive capabilities primed. Strategic advantage: {advantage}%"
                ],
                "tactical": [
                    "Recommending tactical shift to {strategy} based on current intelligence.",
                    "Field units report {condition}. Suggest immediate {action}.",
                    "Battle formation adapted to counter enemy movements in {sector}."
                ]
            },
            "status_reports": {
                "systems": [
                    "Defense systems at {strength}% efficiency. All critical functions operational.",
                    "Network integrity: {integrity}%. Defensive protocols active.",
                    "Security matrix status: {status}. Key systems responding normally."
                ],
                "resources": [
                    "Resource allocation optimized. Current efficiency: {efficiency}%",
                    "Strategic reserves at {level}%. Distribution networks secure.",
                    "Supply lines maintaining {status} status. Logistics network intact."
                ]
            }
        }

        # Strategic principles that influence responses
        self.principles = [
            "divide_et_impera",
            "rapid_deployment",
            "intelligence_network",
            "adaptive_leadership"
        ]

    def get_response(self, context: Dict) -> str:
        """Generate contextual response based on input parameters"""
        category = self._determine_category(context)
        subcategory = self._determine_subcategory(context)
        
        if category in self.responses and subcategory in self.responses[category]:
            response = random.choice(self.responses[category][subcategory])
            return self._format_response(response, context)
            
        return self._generate_fallback_response(context)

    def _determine_category(self, context: Dict) -> str:
        """Determine appropriate response category based on context"""
        msg = context.get("chat_message", "").lower()
        
        if any(word in msg for word in ["hello", "hi", "greetings", "ave"]):
            return "greetings"
        elif any(word in msg for word in ["threat", "attack", "breach", "warning"]):
            return "threat_analysis"
        elif any(word in msg for word in ["strategy", "plan", "approach", "action"]):
            return "strategy"
        else:
            return "status_reports"

    def _determine_subcategory(self, context: Dict) -> str:
        """Determine response subcategory based on context"""
        threat_level = context.get("threat_level", "low")
        system_status = context.get("system_status", "normal")
        
        if "threat_analysis" in context:
            return threat_level
        elif "strategy" in context:
            return "tactical"
        elif "greetings" in context:
            return "formal" if context.get("formal", True) else "casual"
        else:
            return "systems"

    def _format_response(self, response: str, context: Dict) -> str:
        """Format response with context-specific values"""
        try:
            return response.format(
                sector=context.get("sector", "unknown"),
                location=context.get("location", "all sectors"),
                status=context.get("status", "nominal"),
                strength=context.get("strength", 85),
                integrity=context.get("integrity", 90),
                efficiency=context.get("efficiency", 95),
                level=context.get("level", 80),
                strategy=context.get("strategy", "defensive posture"),
                condition=context.get("condition", "stable"),
                action=context.get("action", "maintain vigilance"),
                advantage=context.get("advantage", 65)
            )
        except KeyError:
            return response

    def _generate_fallback_response(self, context: Dict) -> str:
        """Generate intelligent fallback response"""
        principles = random.choice(self.principles)
        return f"Based on the principle of {principles}, I recommend we analyze the situation further before proceeding. What specific intelligence do you require?"