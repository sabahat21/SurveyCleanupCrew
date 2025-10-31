"""
Updated Flask Application - Two separate buttons for ranking and final POST
WITH CORS AND PREVIEW FEATURES
"""
import time
import traceback
from flask import Flask, render_template_string, jsonify, request
from flask_cors import CORS, cross_origin  # ADD THIS IMPORT
from config.settings import Config
from database.db_handler import DatabaseHandler
from services.ranking_service import RankingService
from services.final_service import FinalService
from utils.logger import setup_logger
from constants import LogMessages

# Initialize Flask app WITH CORS
app = Flask(__name__)
CORS(app)  # ADD THIS LINE - enables CORS for all routes

# Setup logging
logger = setup_logger()

# ... [KEEP ALL YOUR EXISTING CLASSES: AppInitializer, APIEndpoints, TemplateProvider]
# ... [KEEP ALL YOUR EXISTING CODE]

# Initialize application components
db_handler, ranking_service, final_service = AppInitializer.initialize()
api_endpoints = APIEndpoints(db_handler, ranking_service, final_service)

# Route handlers - ADD @cross_origin() TO ALL EXISTING ROUTES
@app.route('/')
@cross_origin()  # ADD THIS
def debug_ui():
    """Debug UI homepage"""
    return render_template_string(TemplateProvider.get_debug_ui_template())

@app.route('/api/health')
@cross_origin()  # ADD THIS
def health():
    """Health check endpoint"""
    result = api_endpoints.health_check()
    status_code = 500 if result["status"] == "error" else 200
    return jsonify(result), status_code

@app.route('/api/test-connection')
@cross_origin()  # ADD THIS
def test_connection():
    """Test API connection"""
    result = api_endpoints.test_connection()
    status_code = 500 if result["status"] == "error" else 200
    return jsonify(result), status_code

@app.route('/api/get-questions')
@cross_origin()  # ADD THIS
def get_questions():
    """Fetch questions from API"""
    result = api_endpoints.get_questions()
    status_code = 500 if result["status"] == "error" else 200
    return jsonify(result), status_code

@app.route('/api/process-ranking', methods=['POST'])
@cross_origin()  # ADD THIS
def process_ranking():
    """Process ranking for Input questions only"""
    result = api_endpoints.process_ranking()
    status_code = 500 if result["status"] == "error" else 200
    return jsonify(result), status_code

@app.route('/api/post-final-answers', methods=['POST'])
@cross_origin()  # ADD THIS
def post_final_answers():
    """POST final answers to /admin/survey/final"""
    result = api_endpoints.post_final_answers()
    status_code = 500 if result["status"] == "error" else 200
    return jsonify(result), status_code

# ADD THESE PREVIEW ENDPOINTS:
@app.route('/api/preview-ranking')
@cross_origin()
def preview_ranking():
    """Preview ranking details"""
    try:
        logger.info("🔍 Starting preview ranking endpoint...")
        
        # Test database connection
        try:
            connection_ok = db_handler.test_connection()
            if not connection_ok:
                return jsonify({
                    "status": "error", 
                    "message": "Database connection failed"
                }), 500
        except Exception as conn_error:
            return jsonify({
                "status": "error", 
                "message": f"Database connection error: {str(conn_error)}"
            }), 500
        
        # Fetch questions
        try:
            questions = db_handler.fetch_all_questions()
            logger.info(f"📊 Fetched {len(questions)} questions")
            
            if not questions:
                return jsonify({
                    "status": "success",
                    "data": [],
                    "message": "No questions found in database"
                })
                
        except Exception as fetch_error:
            return jsonify({
                "status": "error", 
                "message": f"Failed to fetch questions: {str(fetch_error)}"
            }), 500
        
        # Generate preview - use existing ranking service if available
        try:
            # Check if preview method exists, otherwise create simple preview
            if hasattr(ranking_service, 'preview_details'):
                details = ranking_service.preview_details(questions, top_n=5)
            else:
                # Fallback preview
                details = []
                for i, q in enumerate(questions[:5]):
                    details.append({
                        "text": q.get('question', f'Question {i}'),
                        "questionType": q.get('questionType', 'unknown'),
                        "questionLevel": q.get('questionLevel', 'Unknown'),
                        "questionCategory": q.get('questionCategory', ''),
                        "rankable": q.get('questionType', '').lower() == 'input',
                        "skipReason": "mcq" if q.get('questionType', '').lower() == 'mcq' else None,
                        "responseCount": len(q.get('answers', [])),
                        "clusters": []
                    })
            
            return jsonify({
                "status": "success",
                "data": details,
                "count": len(details)
            })
            
        except Exception as preview_error:
            logger.error(f"❌ Error in preview: {preview_error}")
            # Return basic question info as fallback
            fallback_data = []
            for i, q in enumerate(questions[:3]):
                fallback_data.append({
                    "text": q.get('question', f'Question {i}'),
                    "questionType": q.get('questionType', 'unknown'),
                    "rankable": False,
                    "skipReason": f"Error: {str(preview_error)}",
                    "clusters": []
                })
            return jsonify({
                "status": "success",
                "data": fallback_data,
                "message": "Preview generated with fallback"
            })
        
    except Exception as e:
        logger.error(f"💥 Critical error in preview_ranking: {e}")
        return jsonify({
            "status": "error", 
            "message": f"Server error: {str(e)}"
        }), 500

@app.route('/api/test-preview')
@cross_origin()
def test_preview():
    """Simple test endpoint that always returns JSON"""
    try:
        return jsonify({
            "status": "success",
            "data": [
                {
                    "text": "Test question 1 - What is your favorite color?",
                    "questionType": "input", 
                    "questionLevel": "Beginner",
                    "questionCategory": "Preferences",
                    "rankable": True,
                    "skipReason": None,
                    "responseCount": 5,
                    "clusters": [
                        {"value": "Blue", "count": 3, "rank": 1, "score": 25},
                        {"value": "Red", "count": 2, "rank": 2, "score": 15}
                    ]
                },
                {
                    "text": "Test question 2 - Select the correct answer", 
                    "questionType": "mcq",
                    "questionLevel": "Intermediate", 
                    "questionCategory": "Knowledge",
                    "rankable": False,
                    "skipReason": "mcq",
                    "responseCount": 4,
                    "clusters": []
                }
            ],
            "message": "Test preview working correctly"
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Test error: {str(e)}"
        }), 500

@app.route('/api/logs')
@cross_origin()  # ADD THIS
def get_logs():
    """Get recent logs (simulated)"""
    return jsonify({
        "status": "success",
        "logs": [
            {"timestamp": time.time(), "level": "INFO", "message": "Service started"},
            {"timestamp": time.time(), "level": "INFO", "message": "Configuration validated"},
        ]
    })

if __name__ == '__main__':
    logger.info("🌐 Starting Debug UI Server with CORS and Preview Features")
    logger.info(f"🔗 Access UI at: http://localhost:{Config.FLASK_PORT}")
    
    app.run(
        host='0.0.0.0', 
        port=Config.FLASK_PORT, 
        debug=Config.FLASK_DEBUG
    )
