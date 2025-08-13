from typing import Dict, List, Any
from constants import QuestionFields

class ResponseProcessor:
    @staticmethod
    def extract_questions_from_response(response_data: Any) -> List[Dict]:
        if isinstance(response_data, dict):
            if "questions" in response_data:
                return response_data["questions"]
            if "data" in response_data:
                d = response_data["data"]
                return d if isinstance(d, list) else [d]
            if response_data.get(QuestionFields.QUESTION_ID) or response_data.get("_id"):
                return [response_data]
            return []
        if isinstance(response_data, list):
            return response_data
        return []

    @staticmethod
    def is_success_response(response_data: Any) -> bool:
        if isinstance(response_data, dict):
            return (
                response_data.get("success", False)
                or response_data.get("statusCode") == 200
                or "data" in response_data
            )
        return True