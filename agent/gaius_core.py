import os
from dotenv import load_dotenv
from typing import Dict, List
import logging
from datetime import datetime
from enum import Enum
from openai import OpenAI
from response_database import ResponseDatabase
from handlers.siem import SplunkHandler, ElasticHandler, QRadarHandler  # Import SplunkHandler, ElasticHandler, and QRadarHandler from the appropriate module

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
        self.response_database = ResponseDatabase()
        
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
        
        # Add response context tracking
        self.conversation_context = {
            "previous_responses": [],
            "threat_history": [],
            "active_strategies": set(),
            "current_security_stance": "normal"
        }
        
        # Add security integration configs
        self.security_integrations = {
            "siem": {
                "platforms": ["splunk", "elastic", "qradar"],
                "connection_status": {},
                "data_handlers": {}
            },
            "edr": {
                "platforms": ["crowdstrike", "sentinel", "carbon_black"],
                "connection_status": {},
                "data_handlers": {}
            },
            "soar": {
                "platforms": ["phantom", "demisto", "swimlane"],
                "connection_status": {},
                "data_handlers": {}
            }
        }

    async def evaluate_situation(self, context: Dict) -> Dict:
        """Enhanced situation evaluation with security platform data"""
        base_assessment = self._perform_base_assessment(context)
        
        # Gather data from integrated platforms
        security_data = await self._gather_security_platform_data()
        enhanced_context = {**context, "security_platform_data": security_data}
        
        if "chat_message" in context:
            response_context = {
                **enhanced_context,
                "threat_level": base_assessment["threat_level"].name.lower(),
                "sector": self._identify_affected_sector(base_assessment),
                "strategy": self._determine_strategy(base_assessment),
                "strength": self._calculate_defense_strength(base_assessment),
                "previous_responses": self.conversation_context["previous_responses"][-3:]
            }
            
            response = await self._generate_enhanced_response(response_context)
            self.conversation_context["previous_responses"].append(response)
            
            return self._merge_assessments(base_assessment, response)
            
        return base_assessment

    async def _enhance_with_llm(self, base_assessment: Dict, principles: Dict, context: Dict) -> Dict:
        """Modified to use async/await with proper error handling"""
        try:
            if "chat_message" in context:
                try:
                    # Attempt to use Deepseek API
                    response = await self.openai_client.chat.completions.create(
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
                    # Enhanced fallback responses
                    msg = context["chat_message"].lower()
                    response_text = self._get_fallback_response(msg)
                    return self._merge_assessments(base_assessment, response_text)
                    
            return base_assessment
            
        except Exception as e:
            logging.error(f"Error in LLM enhancement: {e}")
            return self._merge_assessments(base_assessment, "Ave! I am currently regrouping my thoughts. Please try again shortly.")

    async def integrate_security_platform(self, platform_type: str, config: Dict) -> bool:
        """Integrate with external security platforms"""
        try:
            if platform_type not in self.security_integrations:
                logging.error(f"Unsupported platform type: {platform_type}")
                return False
                
            platform_name = config.get("platform_name")
            if platform_name not in self.security_integrations[platform_type]["platforms"]:
                logging.error(f"Unsupported {platform_type} platform: {platform_name}")
                return False
                
            # Initialize connection handler
            handler = await self._create_platform_handler(platform_type, config)
            self.security_integrations[platform_type]["data_handlers"][platform_name] = handler
            
            # Test connection
            if await self._test_platform_connection(handler):
                self.security_integrations[platform_type]["connection_status"][platform_name] = "connected"
                return True
                
            return False
            
        except Exception as e:
            logging.error(f"Error integrating security platform: {e}")
            return False

    async def _create_platform_handler(self, platform_type: str, config: Dict):
        """Create appropriate handler for security platform"""
        handlers = {
            "siem": self._create_siem_handler,
            "edr": self._create_edr_handler,
            "soar": self._create_soar_handler
        }
        return await handlers[platform_type](config)

    async def _create_siem_handler(self, config: Dict):
        """Create SIEM integration handler"""
        platform = config.get("platform_name")
        if platform == "splunk":
            return SplunkHandler(config)  # i'll need to implement these handler classes
        elif platform == "elastic":
            return ElasticHandler(config)
        elif platform == "qradar":
            return QRadarHandler(config)

    async def _test_platform_connection(self, handler) -> bool:
        """Test connection to security platform"""
        try:
            return await handler.test_connection()
        except Exception as e:
            logging.error(f"Connection test failed: {e}")
            return False

    async def _gather_security_platform_data(self) -> Dict:
        """Gather data from integrated security platforms"""
        security_data = {}
        
        for platform_type, config in self.security_integrations.items():
            platform_data = {}
            for platform, handler in config["data_handlers"].items():
                if config["connection_status"].get(platform) == "connected":
                    try:
                        platform_data[platform] = await handler.gather_data()
                    except Exception as e:
                        logging.error(f"Error gathering data from {platform}: {e}")
                        
            security_data[platform_type] = platform_data
            
        return security_data

    def _get_fallback_response(self, msg: str) -> str:
        """Enhanced fallback response system"""
        responses = {
            "greeting": [
                "Ave! I stand ready to assist with your strategic needs.",
                "Greetings, Commander. How may I be of service today?",
                "Welcome to the command center. What intelligence do you seek?"
            ],
            "status": [
                "Our defenses are holding strong. What specific information do you require?",
                "Current defensive posture is stable. Key systems are operational.",
                "All defensive positions are maintaining vigilance."
            ],
            "default": [
                "I am analyzing the situation and will provide strategic guidance shortly.",
                "Your query requires careful tactical consideration. Please proceed.",
                "I shall provide a detailed assessment once I have gathered more intelligence."
            ]
        }

        import random
        if any(word in msg for word in ["hello", "hi", "greetings", "ave"]):
            return random.choice(responses["greeting"])
        elif any(word in msg for word in ["status", "report", "update"]):
            return random.choice(responses["status"])
        return random.choice(responses["default"])

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

    def _identify_affected_sector(self, assessment: Dict) -> str:
        """Determine which sector is most relevant to the current situation"""
        if "network_vulnerability" in assessment.get("key_factors", []):
            return "network perimeter"
        elif "authentication_breach" in assessment.get("key_factors", []):
            return "access control"
        return "general defense"

    def _determine_strategy(self, assessment: Dict) -> str:
        """Select appropriate strategic response"""
        if assessment["threat_level"] in [ThreatLevel.HIGH, ThreatLevel.CRITICAL]:
            return "active defense protocol"
        return "standard defensive posture"

    def _calculate_defense_strength(self, assessment: Dict) -> int:
        """Calculate current defensive capability percentage"""
        factors = assessment.get("key_factors", [])
        strengths = len([f for f in factors if "advantage" in f or "capability" in f])
        weaknesses = len([f for f in factors if "vulnerability" in f or "limited" in f])
        
        base_strength = 75
        modifier = (strengths - weaknesses) * 5
        return min(100, max(0, base_strength + modifier))
