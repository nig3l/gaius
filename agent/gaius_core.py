import os
from dotenv import load_dotenv
from typing import Dict, List
import logging
from datetime import datetime
from enum import Enum
from openai import OpenAI

# Load environment variables
load_dotenv()

class ThreatLevel(Enum):
    LOW = 1
    MEDIUM = 2 
    HIGH = 3
    CRITICAL = 4

class GaiusGeneral:
    def __init__(self):
        self.name = "Gaius Julius Caesar"
        self.title = "Imperator"
        
        #  Deepseek API key from environment variable
        deepseek_api_key = os.getenv("DEEPSEEK_API_KEY")
        if not deepseek_api_key:
            raise ValueError("DEEPSEEK_API_KEY not found in environment variables")
            
        # Initialize API client with Deepseek endpoint and key
        self.openai_client = OpenAI(
            api_key=deepseek_api_key,
            base_url="https://api.deepseek.com/v1"
        )
        
        # Core strategic principles
        self.strategic_principles = {
            "divide_et_impera": {
                "principle": "Divide and conquer",
                "applications": [
                    "Split enemy forces",
                    "Exploit internal divisions",
                    "Create strategic alliances",
                    "Isolate threats individually"
                ]
            },
            "rapid_deployment": {
                "principle": "Speed and mobility",
                "applications": [
                    "Swift response to threats",
                    "Surprise attacks",
                    "Strategic positioning",
                    "Resource mobilization"
                ]
            },
            "intelligence_network": {
                "principle": "Information superiority",
                "applications": [
                    "Scout network deployment",
                    "Local informant cultivation",
                    "Pattern recognition",
                    "Predictive analysis"
                ]
            },
            "adaptive_leadership": {
                "principle": "Flexible command",
                "applications": [
                    "Situation-based strategy",
                    "Resource optimization",
                    "Morale management",
                    "Tactical adaptation"
                ]
            }
        }
        
        # Decision making framework
        self.decision_framework = {
            "analysis": {
                "terrain_evaluation": None,
                "force_assessment": None,
                "political_landscape": None,
                "resource_availability": None
            },
            "execution": {
                "primary_strategy": None,
                "contingency_plans": [],
                "communication_channels": [],
                "response_protocols": []
            }
        }

    def evaluate_situation(self, context: Dict) -> Dict:
        base_assessment = self._perform_base_assessment(context)
        llm_enhanced_assessment = self._enhance_with_llm(
            base_assessment,
            self.strategic_principles,
            context
        )
        return llm_enhanced_assessment

    def _enhance_with_llm(self, base_assessment: Dict, principles: Dict, context: Dict) -> Dict:
        """Modified to use Deepseek's model with fallback responses"""
        try:
            if "chat_message" in context:
                try:
                    # Attempt to use Deepseek API
                    response = self.openai_client.chat.completions.create(
                        model="deepseek-chat",
                        messages=[
                            {
                                "role": "system",
                                "content": "You are Gaius Julius Caesar's strategic AI advisor. Respond as Caesar would."
                            },
                            {
                                "role": "user",
                                "content": context["chat_message"]
                            }
                        ],
                        temperature=0.7,
                        max_tokens=500
                    )
                    return self._merge_assessments(base_assessment, response.choices[0].message.content)
                    
                except Exception as api_error:
                    logging.error(f"Deepseek API error: {api_error}")
                    # Fallback to predetermined responses
                    responses = {
                        "greeting": "Ave! I stand ready to assist with your strategic needs.",
                        "status": "Our defenses are holding strong. What intelligence do you seek?",
                        "error": "A temporary setback in our communication lines. Please restate your query.",
                    }
                    
                    msg = context["chat_message"].lower()
                    if "hello" in msg or "hi" in msg:
                        response_text = responses["greeting"]
                    elif "status" in msg:
                        response_text = responses["status"]
                    else:
                        response_text = responses["error"]
                        
                    return self._merge_assessments(base_assessment, response_text)
                    
            return base_assessment
            
        except Exception as e:
            logging.error(f"Error in LLM enhancement: {e}")
            return base_assessment

    def formulate_strategy(self, assessment):
        """
        Develops comprehensive strategy based on situation assessment
        Incorporates relevant strategic principles
        """
        pass

    def adapt_principles(self, modern_context):
        """
        Adapts historical principles to modern scenarios
        Maintains core strategic value while updating implementation
        """
        pass
    
    def _perform_base_assessment(self, context: Dict) -> Dict:
        """
        Caesar's systematic approach to situation analysis
        Returns detailed strategic assessment
        """
        assessment = {
            "threat_level": None,
            "key_factors": [],
            "vulnerabilities": [],
            "opportunities": [],
            "recommended_principles": []
        }
        
        # 1. Terrain and Position Analysis (Caesar always started here)
        terrain_factors = self._analyze_terrain(context.get('terrain', {}))
        assessment['key_factors'].extend(terrain_factors)
        
        # 2. Force Comparison (Caesar's strength/weakness evaluation)
        force_analysis = self._analyze_forces(
            context.get('friendly_forces', {}),
            context.get('enemy_forces', {})
        )
        assessment['threat_level'] = self._determine_threat_level(force_analysis)
        
        # 3. Strategic Opportunities (Caesar's opportunity spotting)
        opportunities = self._identify_opportunities(context, force_analysis)
        assessment['opportunities'] = opportunities
        
        # 4. Principle Selection (Which strategies best fit the situation)
        applicable_principles = self._select_strategic_principles(
            assessment['threat_level'],
            assessment['key_factors'],
            opportunities
        )
        assessment['recommended_principles'] = applicable_principles
        
        return assessment

    def _analyze_terrain(self, network_topology: Dict) -> List[str]:
        """
        Caesar's terrain analysis methodology adapted for network infrastructure
        """
        key_factors = []
    
        # Network Visibility Points (High Ground)
        visibility_points = network_topology.get('monitoring_points', {})
        if visibility_points.get('ids_coverage'):
            key_factors.append('ids_monitoring_advantage')
        if visibility_points.get('siem_coverage'):
            key_factors.append('siem_visibility_advantage')
        if visibility_points.get('netflow_analytics'):
            key_factors.append('traffic_analysis_capability')
    
        # Data Transmission Paths (Supply Routes)
        data_paths = network_topology.get('data_routes', {})
        if data_paths.get('encrypted_channels'):
            key_factors.append('secure_data_transmission')
        if data_paths.get('redundant_paths'):
            key_factors.append('resilient_data_flow')
        if data_paths.get('bottlenecks'):
            key_factors.append('transmission_vulnerability')
    
        # Failover Systems (Exit Routes)
        failover = network_topology.get('failover_systems', {})
        if failover.get('backup_sites', 0) < 2:
            key_factors.append('limited_failover_options')
        if failover.get('disaster_recovery'):
            key_factors.append('recovery_capability')
        if failover.get('backup_power'):
            key_factors.append('power_resilience')
        
        return key_factors

    def _analyze_forces(self, friendly: Dict, enemy: Dict) -> Dict:
        """Caesar's force comparison methodology"""
        return {
            'strength_ratio': friendly.get('strength', 0) / enemy.get('strength', 1),
            'mobility_advantage': friendly.get('mobility', 0) > enemy.get('mobility', 0),
            'supply_advantage': friendly.get('supplies', 0) > enemy.get('supplies', 0)
        }

    def _determine_threat_level(self, force_analysis: Dict) -> ThreatLevel:
        """Caesar's threat assessment methodology"""
        if force_analysis['strength_ratio'] < 0.5:
            return ThreatLevel.CRITICAL
        elif force_analysis['strength_ratio'] < 0.8:
            return ThreatLevel.HIGH
        elif force_analysis['strength_ratio'] < 1.2:
            return ThreatLevel.MEDIUM
        return ThreatLevel.LOW

    def _identify_opportunities(self, context: Dict, force_analysis: Dict) -> List[str]:
        """Caesar's opportunity identification methodology"""
        opportunities = []
        
        # Look for divide and conquer opportunities
        if context.get('enemy_unity', 1.0) < 0.8:
            opportunities.append('internal_division_exploit')
            
        # Quick strike opportunities
        if force_analysis['mobility_advantage']:
            opportunities.append('rapid_strike')
            
        # Supply line attacks (Caesar's favorite)
        if not force_analysis['supply_advantage']:
            opportunities.append('supply_line_vulnerability')
            
        return opportunities

    def _select_strategic_principles(self, threat_level: ThreatLevel, 
                                   factors: List[str], 
                                   opportunities: List[str]) -> List[str]:
        """Caesar's principle selection logic"""
        selected_principles = []
        
        if 'internal_division_exploit' in opportunities:
            selected_principles.append('divide_et_impera')
            
        if 'rapid_strike' in opportunities:
            selected_principles.append('rapid_deployment')
            
        if threat_level in [ThreatLevel.HIGH, ThreatLevel.CRITICAL]:
            selected_principles.append('intelligence_network')
            
        return selected_principles

    def _construct_strategic_prompt(self, base_assessment: Dict, principles: Dict, context: Dict) -> str:
        """Constructs prompt for LLM strategic enhancement"""
        return f"""
        Initial Assessment:
        - Threat Level: {base_assessment['threat_level']}
        - Key Factors: {', '.join(base_assessment['key_factors'])}
        - Opportunities: {', '.join(base_assessment['opportunities'])}
        
        Given this situation, formulate a strategic response considering:
        1. Immediate defensive actions
        2. Resource allocation
        3. Long-term strategic positioning
        4. Risk mitigation measures
        """

    def _merge_assessments(self, base_assessment: Dict, llm_response: str) -> Dict:
        """Merges base assessment with LLM insights"""
        try:
            return {
                **base_assessment,
                "ai_insights": llm_response,
                "timestamp": datetime.now().isoformat()
            }
        except Exception as e:
            logging.error(f"Error merging assessments: {e}")
            return base_assessment
