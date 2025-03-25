import traceback
from fastapi import FastAPI, WebSocket, HTTPException, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from typing import List, Dict
import asyncio
import logging
from datetime import datetime, timedelta
from gaius_core import GaiusGeneral
from security_tools import SecurityToolsInterface
from commander import CommandInterface

def log_error(error: Exception, context: str = ""):
    """Enhanced error logging"""
    logging.error(f"""
    Error in {context}:
    Type: {type(error).__name__}
    Message: {str(error)}
    Traceback:
    {traceback.format_exc()}
    """)

class GaiusDashboard:
    def __init__(self):
        self.app = FastAPI(title="Gaius Command Center")
        self.app.add_middleware(
            CORSMiddleware,
            allow_origins=["http://localhost:5173"],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )
        
        self.active_connections: List[WebSocket] = []
        self.gaius = GaiusGeneral()
        self.security_tools = SecurityToolsInterface(self.gaius)
        self.commander = CommandInterface(self.gaius, self.security_tools)
        
        # removing static files mounting since it's not needed yet
        # self.app.mount("/static", StaticFiles(directory="static"), name="static")
        
        self._setup_routes()
        
        # Registering websocket routes on startup
        @self.app.on_event("startup")
        async def startup_event():
            await self._setup_websocket_routes()

    def _setup_routes(self):
        """Setup dashboard API endpoints"""
        @self.app.get("/status")
        async def get_security_status():
            try:
                logging.info("Fetching defense capabilities...")
                defense_status = self.security_tools.get_defense_capabilities()
                logging.info(f"Defense capabilities: {defense_status}")

                logging.info("Analyzing current threats...")
                threats = self.commander.analyze_current_threats({})
                logging.info(f"Threats: {threats}")

                return {
                    "current_posture": {
                        "defense_capabilities": defense_status,
                        "active_systems": self.security_tools._get_active_systems()
                    },
                    "active_threats": threats,
                    "gaius_recommendations": self._get_actionable_items(),
                    "threat_timeline": self._format_timeline_data(),
                    "defense_radar": self._format_radar_data(defense_status),
                    "risk_heatmap": self._format_risk_heatmap_data()
                }
            except Exception as e:
                log_error(e, "/status endpoint")
                raise HTTPException(status_code=500, detail="Internal server error")

        @self.app.post("/action/{action_id}")
        async def execute_recommendation(self, action_id: str):
            """Execute one-click actions recommended by Gaius"""
            return self._execute_action(action_id)

    async def _setup_websocket_routes(self):
        @self.app.websocket("/ws/dashboard")
        async def websocket_endpoint(websocket: WebSocket):
            await websocket.accept()
            self.active_connections.append(websocket)
            try:
                while True:
                    data = {
                        "timestamp": datetime.now().isoformat(),
                        "status": "active",
                        # will Add more real-time data here
                    }
                    await websocket.send_json(data)
                    await asyncio.sleep(5)  # Send updates every 5 seconds
            except WebSocketDisconnect:
                self.active_connections.remove(websocket)
            except Exception as e:
                log_error(e, "WebSocket /ws/dashboard")
                if websocket in self.active_connections:
                    self.active_connections.remove(websocket)

        @self.app.websocket("/ws/chat")
        async def chat_endpoint(websocket: WebSocket):
            await websocket.accept()
            try:
                while True:
                    message = await websocket.receive_text()
                    logging.info(f"Received chat message: {message}")
                    
                    try:
                        # Get Gaius's response with timeout
                        response = await asyncio.wait_for(
                            self.gaius.evaluate_situation({
                                "chat_message": message,
                                "current_context": self.security_tools.get_defense_capabilities()
                            }),
                            timeout=10.0
                        )
                        
                        # Ensure we have a valid response
                        if not response or "ai_insights" not in response:
                            response = {
                                "ai_insights": "Ave! I apologize for the delay in my response. Please restate your query."
                            }
                        
                        # Format the response
                        chat_response = {
                            "type": "chat",
                            "content": response["ai_insights"],
                            "timestamp": datetime.now().isoformat()
                        }
                        
                        await websocket.send_json(chat_response)
                        
                    except asyncio.TimeoutError:
                        await websocket.send_json({
                            "type": "error",
                            "content": "Response timeout. My strategic calculations are taking longer than expected.",
                            "timestamp": datetime.now().isoformat()
                        })
                    except Exception as e:
                        log_error(e, "Chat WebSocket message processing")
                        await websocket.send_json({
                            "type": "error",
                            "content": "My apologies, I encountered an error in my strategic analysis.",
                            "timestamp": datetime.now().isoformat()
                        })
                        
            except WebSocketDisconnect:
                logging.info("Chat WebSocket disconnected")
            except Exception as e:
                log_error(e, "Chat WebSocket")
                await websocket.close()

    def _get_dashboard_updates(self) -> Dict:
        """Get real-time dashboard data"""
        return {
            "threat_landscape": {
                "current_level": self.commander.analyze_current_threats({}),
                "trend": self._calculate_threat_trend(),
                "hotspots": self._identify_security_hotspots()
            },
            "defense_status": {
                "readiness": self.security_tools.get_defense_capabilities(),
                "active_countermeasures": self._get_active_defenses(),
                "resource_utilization": self._get_resource_metrics()
            },
            "gaius_insights": {
                "strategic_advice": self.commander.get_tactical_advice({}),
                "recommended_actions": self._get_actionable_items(),
                "risk_assessment": self._calculate_risk_metrics()
            }
        }

    def _calculate_threat_trend(self):
        return {"trend": "increasing", "rate": 0.15}

    def _identify_security_hotspots(self):
        return ["network_perimeter", "user_endpoints"]

    def _get_active_defenses(self):
        return ["ids", "firewall", "endpoint_protection"]

    def _get_resource_metrics(self):
        return {"cpu": 45, "memory": 60, "storage": 30}

    def _calculate_risk_metrics(self):
        return {"overall": "medium", "critical_assets": "low"}

    def _execute_action(self, action_id: str):
        return {"status": "success", "message": f"Action {action_id} executed"}

    def _get_actionable_items(self):
        """Convert Gaius's strategic advice into clickable actions"""
        assessment = self.commander.get_tactical_advice({})
        return {
            "immediate_actions": self._format_actions(assessment),
            "strategic_changes": self._format_strategic_items(assessment),
            "resource_needs": self._format_resource_requests(assessment)
        }

    def _format_timeline_data(self) -> Dict:
        """Format threat timeline data for frontend"""
        try:
            current_time = datetime.now()
            return {
                "labels": [(current_time - timedelta(hours=x)).strftime("%H:%M") 
                          for x in range(6, -1, -1)],
                "values": self.security_tools.get_threat_metrics()["hourly_threats"],
                "mitigated": self.security_tools.get_threat_metrics()["hourly_mitigated"]
            }
        except Exception as e:
            log_error(e, "Formatting timeline data")
            return {"labels": [], "values": [], "mitigated": []}

    def _format_radar_data(self, defense_status: Dict) -> Dict:
        """Format defense capabilities for radar chart"""
        try:
            return {
                "labels": ["Firewall", "IDS/IPS", "Encryption", "Authentication", 
                          "Monitoring", "Backup"],
                "values": [
                    defense_status.get("firewall", 0),
                    defense_status.get("ids", 0),
                    defense_status.get("encryption", 0),
                    defense_status.get("authentication", 0),
                    defense_status.get("monitoring", 0),
                    defense_status.get("backup", 0)
                ]
            }
        except Exception as e:
            log_error(e, "Formatting radar data")
            return {"labels": [], "values": []}

    def _format_risk_heatmap_data(self):
        # Placeholder method
        return {}

    def _format_actions(self, assessment):
        # Placeholder method
        return []

    def _format_strategic_items(self, assessment):
        # Placeholder method
        return []

    def _format_resource_requests(self, assessment):
        # Placeholder method
        return []