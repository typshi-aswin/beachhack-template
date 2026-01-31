from pydantic import BaseModel
from typing import List, Dict

class TranscriptSegment(BaseModel):
    segment_id: str
    speaker: str
    start: float
    end: float
    text: str
    confidence: float

class MLRequest(BaseModel):
    conv_id: str
    customer_id: str
    segments: List[TranscriptSegment]
    past_interactions: int = 0
    unresolved_issues: int = 0

class MLResponse(BaseModel):
    facts: List[Dict]
    intent: Dict
    friction: Dict
    suggested_actions: List[Dict]
