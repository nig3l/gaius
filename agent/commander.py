from typing import Dict, List
from security_tools import SecurityToolsInterface
from gaius_core import GaiusGeneral

class CommandInterface:
    def __init__(self, gaius: GaiusGeneral, security_tools: SecurityToolsInterface):
        self.gaius = gaius
        self.security_tools = security_tools
        self.command_types = {
            "analyze_threats": self.analyze_current_threats,
            "get_defense_status": self.get_defense_status,
            "configure_ids": self.configure_ids_settings,
            "tactical_advice": self.get_tactical_advice
        }

    def process_command(self, command: str, params: Dict) -> Dict:
        """Process incoming commands from security teams"""
        if command in self.command_types:
            return self.command_types[command](params)
        return {"status": "error", "message": "Unknown command"}

    def analyze_current_threats(self, params: Dict) -> Dict:
        """Get Gaius's analysis of current threat landscape"""
        ids_alerts = self.security_tools.analyze_ids_alerts()
        assessment = self.gaius.evaluate_situation({
            "threat_data": ids_alerts,
            "context": params.get("context", {})
        })
        return {
            "status": "success",
            "threat_assessment": assessment,
            "recommendations": self._generate_recommendations(assessment)
        }

    def get_defense_status(self, params: Dict) -> Dict:
        """Get current defensive posture assessment"""
        return {
            "status": "success",
            "defense_capabilities": self.security_tools.get_defense_capabilities(),
            "active_defenses": self._get_active_defenses()
        }

    def configure_ids_settings(self, params: Dict) -> Dict:
        """Configure IDS settings based on Gaius's recommendations"""
        success = self.security_tools.connect_ids(
            params.get("ids_type"),
            params.get("config", {})
        )
        return {
            "status": "success" if success else "error",
            "message": "IDS configuration updated" if success else "Configuration failed"
        }

    def get_tactical_advice(self, params: Dict) -> Dict:
        """Get specific tactical recommendations from Gaius"""
        situation = {
            "terrain": self.security_tools.get_network_topology(),
            "current_threats": params.get("threats", []),
            "defense_posture": self.security_tools.get_defense_capabilities()
        }
        assessment = self.gaius.evaluate_situation(situation)
        return {
            "status": "success",
            "tactical_advice": self._format_tactical_advice(assessment)
        }

    def _get_active_defenses(self) -> List[str]:
        """Get list of currently active defense mechanisms"""
        return ["ids_monitoring", "firewall_rules", "endpoint_protection"]

    def _generate_recommendations(self, assessment: Dict) -> List[str]:
        """Generate actionable recommendations based on assessment"""
        return [
            "Strengthen network visibility points",
            "Update IDS rules for emerging threats",
            "Review defense-in-depth strategy"
        ]

    def _format_tactical_advice(self, assessment: Dict) -> Dict:
        """Format tactical advice in clear, actionable terms"""
        return {
            "immediate_actions": [],
            "strategic_changes": [],
            "resource_allocation": []
        }