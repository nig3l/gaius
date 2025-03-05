from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from typing import List, Dict
import asyncio
from gaius_core import GaiusGeneral
from security_tools import SecurityToolsInterface
from commander import CommandInterface

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
        
        # Mount static files if needed (or comment out if directory doesn't exist)
        self.app.mount("/static", StaticFiles(directory="static"), name="static")
        
        self._setup_routes()
        
        # Register websocket routes on startup
        @self.app.on_event("startup")
        async def startup_event():
            await self._setup_websocket_routes()
    def _setup_routes(self):
        """Setup dashboard API endpoints"""
        @self.app.get("/status")
        async def get_security_status():
            return {
                "current_posture": self.security_tools.get_defense_status({}),
                "active_threats": self.commander.analyze_current_threats({}),
                "gaius_recommendations": self._get_actionable_items()
            }

        @self.app.post("/action/{action_id}")
        async def execute_recommendation(action_id: str):
            """Execute one-click actions recommended by Gaius"""
            return self._execute_action(action_id)

    async def _setup_websocket_routes(self):
        @self.app.websocket("/ws/dashboard")
        async def websocket_endpoint(websocket: WebSocket):
            await websocket.accept()
            self.active_connections.append(websocket)
            try:
                while True:
                    # Real-time updates
                    dashboard_data = self._get_dashboard_updates()
                    await websocket.send_json(dashboard_data)
                    await asyncio.sleep(5)
            except:
                self.active_connections.remove(websocket)

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

    def _format_visualization_data(self, data: Dict) -> Dict:
        """Format data for frontend visualization"""
        return {
            "charts": {
                "threat_timeline": self._format_timeline_data(data),
                "defense_radar": self._format_radar_chart_data(data),
                "risk_heatmap": self._format_heatmap_data(data)
            },
            "metrics": {
                "key_indicators": self._format_kpi_data(data),
                "trends": self._format_trend_data(data),
                "alerts": self._format_alert_data(data)
            }
        }

    def _get_actionable_items(self):
        """Convert Gaius's strategic advice into clickable actions"""
        assessment = self.commander.get_tactical_advice({})
        return {
            "immediate_actions": self._format_actions(assessment),
            "strategic_changes": self._format_strategic_items(assessment),
            "resource_needs": self._format_resource_requests(assessment)
        }

    def _get_actionable_recommendations(self) -> List[Dict]:
        """Get formatted, actionable recommendations"""
        return [
            {
                "id": "action_1",
                "title": "Update IDS Rules",
                "priority": "high",
                "impact": "immediate",
                "effort": "low",
                "automated": True
            },
            {
                "id": "action_2",
                "title": "Review Network Segmentation",
                "priority": "medium",
                "impact": "long-term",
                "effort": "medium",
                "automated": False
            }
        ]

async def chat_endpoint(self, websocket: WebSocket):
    @self.app.websocket("/ws/chat")
    async def websocket_endpoint(websocket: WebSocket):
        await websocket.accept()
        try:
            while True:
                message = await websocket.receive_text()
                
                # Get Gaius's strategic response
                response = self.gaius.evaluate_situation({
                    "chat_message": message,
                    "current_context": self.security_tools.get_defense_capabilities()
                })
                
                await websocket.send_json({
                    "type": "chat",
                    "content": response
                })
        except:
            await websocket.close()

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
