"""
Updated Ranking Service - Only processes Input questions, no automatic final endpoint
"""

import logging
from typing import List, Dict, Tuple

from config.settings import Config
from constants import AnswerFields, QuestionFields
from utils.data_formatters import QuestionFormatter, DataValidator

logger = logging.getLogger('survey_analytics')

######
# services/ranking_service.py (or put in a shared constants module)
MIN_RESPONSES = 3
######

def _to_bool(v) -> bool:
    if isinstance(v, bool):
        return v
    if isinstance(v, str):
        return v.strip().lower() in {"true", "1", "yes", "y"}
    return bool(v)

def _to_int(v) -> int:
    try:
        return int(v)
    except Exception:
        return 0
    
###############
def _total_responses(answers: list[dict]) -> int:
    def _to_int(v):
        try: return int(v)
        except: return 0
    return sum(_to_int(a.get(AnswerFields.RESPONSE_COUNT, 1)) for a in answers)
#####################

class AnswerRanker:
    def __init__(self, scoring_values: List[int]):
        self.scoring_values = scoring_values or []

    def rank_answers(self, answers: List[Dict]) -> Tuple[List[Dict], int, int]:
        logger.debug("Processing %d answers for ranking", len(answers))

        correct = [a for a in answers if _to_bool(a.get(AnswerFields.IS_CORRECT))]
        incorrect = [a for a in answers if not _to_bool(a.get(AnswerFields.IS_CORRECT))]
        logger.debug("Found %d correct answers, %d incorrect answers", len(correct), len(incorrect))

        # Pre-rank diagnostics
        for a in correct:
            logger.debug("[PRE-RANK] correct ans='%s' rc=%s old_rank=%s",
                         str(a.get(AnswerFields.ANSWER))[:30],
                         a.get(AnswerFields.RESPONSE_COUNT),
                         a.get(AnswerFields.RANK))

        # Sort by responseCount desc, then by answer text asc for stability
        correct.sort(
            key=lambda a: (
                -_to_int(a.get(AnswerFields.RESPONSE_COUNT)),
                str(a.get(AnswerFields.ANSWER) or "").lower()
            )
        )

        ranked = 0
        scored = 0
        for i, a in enumerate(correct):
            a[AnswerFields.RANK] = i + 1
            score = self.scoring_values[i] if i < len(self.scoring_values) else 0
            a[AnswerFields.SCORE] = score
            ranked += 1
            if score > 0:
                scored += 1
            logger.debug("Ranked answer '%s' - rank: %s, score: %s, responseCount: %s",
                         str(a.get(AnswerFields.ANSWER))[:30],
                         a.get(AnswerFields.RANK),
                         a.get(AnswerFields.SCORE),
                         a.get(AnswerFields.RESPONSE_COUNT))

        # Reset incorrect
        for a in incorrect:
            a[AnswerFields.RANK] = 0
            a[AnswerFields.SCORE] = 0
            logger.debug("Set incorrect answer '%s' to rank=0, score=0",
                         str(a.get(AnswerFields.ANSWER))[:30])

        logger.debug("Ranking complete: %d ranked, %d scored", ranked, scored)
        return correct + incorrect, ranked, scored



class QuestionProcessor:
    def __init__(self, answer_ranker: AnswerRanker):
        self.answer_ranker = answer_ranker

    def _should_process(self, q: Dict) -> Tuple[bool, Dict]:
        reason = {"skipped_mcq": False, "skipped_insufficient": False}
        if str(q.get(QuestionFields.QUESTION_TYPE, "")).lower() != "input":
            reason["skipped_mcq"] = True
            return False, reason
        answers = q.get(QuestionFields.ANSWERS) or []
        #correct_count = sum(1 for a in answers if _to_bool(a.get(AnswerFields.IS_CORRECT)))
        ##if correct_count < 3:
        #########################
        total = _total_responses(answers)
        if total < MIN_RESPONSES:
            reason["skipped_insufficient"] = True
            return False, reason
        return True, reason

    def process_question(self, q: Dict) -> Tuple[Dict, Dict]:
        qid = QuestionFormatter.get_question_id(q)
        answers = q.get(QuestionFields.ANSWERS) or []
        logger.debug("Processing ranking for Input question %s with %d answers", qid, len(answers))
        for i, a in enumerate(answers):
            logger.debug("Answer %d: '%s' - isCorrect: %s, responseCount: %s",
                         i, str(a.get(AnswerFields.ANSWER))[:30],
                         a.get(AnswerFields.IS_CORRECT),
                         a.get(AnswerFields.RESPONSE_COUNT))

        ok, reason = self._should_process(q)
        if not ok:
            return q, {"processed": False, **reason}

        ranked_answers, ranked_cnt, scored_cnt = self.answer_ranker.rank_answers(answers)
        q[QuestionFields.ANSWERS] = ranked_answers
        logger.debug("Input question %s: ranked %d answers, scored %d answers", qid, ranked_cnt, scored_cnt)
        return q, {"processed": True, "ranked_cnt": ranked_cnt, "scored_cnt": scored_cnt}

class RankingService:
    """Main service for handling answer ranking operations - Input questions only"""
    
    def __init__(self, db_handler):
        self.db = db_handler
        self.answer_ranker = AnswerRanker(Config.SCORING_VALUES)
        self.question_processor = QuestionProcessor(self.answer_ranker)
    
    def preview_details(self, questions: List[Dict], top_n: int = 5) -> List[Dict]:
        """
        Read-only preview:
        - Uses the same processing pipeline as writing, but does not persist.
        - Returns which questions are rankable, why skipped, and top clusters.
        """
        results: List[Dict] = []

        for q in questions:
            qtype = (q.get("questionType") or "").lower()
            answers = q.get("answers") or []
            qtext = q.get("questionText") or q.get("question") or q.get("text") or ""

             # ✅ Sum actual responses, not unique row
            total = _total_responses(answers)

            lvl = q.get("questionLevel") or q.get("level")
            cat = q.get("questionCategory") or q.get("category")

            # Mirror skip rules used in your pipeline
            if qtype == "mcq":
                results.append({
                    "questionId": q.get("_id"),
                    "questionType": qtype,
                    "questionLevel": lvl,         
                    "questionCategory": cat,
                    "text": qtext,
                    "responseCount": len(answers),
                    "rankable": False,
                    "skipReason": "mcq"
                })
                continue

            # Example threshold; match whatever your QuestionProcessor uses
            if total < MIN_RESPONSES:
                results.append({
                    "questionId": q.get("_id"),
                    "questionType": qtype,
                    "questionLevel": lvl,         
                    "questionCategory": cat,
                    "text": qtext,
                    "responseCount": total,
                    "rankable": False,
                    "skipReason": "insufficient"
                })
                continue

            # Reuse the real processing path, but don't write to DB.
            # process_question returns (processed_question, meta)
            processed_q, meta = self.question_processor.process_question(q)

            # Pull out the “ranked” view from processed_q
            proc_answers = processed_q.get("answers") or []

            # Keep only positive-ranked clusters/answers and sort by rank asc
            ranked = [a for a in proc_answers if int(a.get("rank", 0)) > 0]
            ranked.sort(key=lambda a: int(a.get("rank", 0)))

            top = ranked[:top_n]

            # Normalize the preview payload to a compact shape
            preview_clusters = [
                {
                    "value": a.get("normalized") or a.get("answer") or a.get("value"),
                    "original": a.get("answer"),
                    "count": a.get("responseCount") or a.get("count") or 0,
                    "rank": int(a.get("rank", 0)),
                    "score": int(a.get("score", 0)),
                    "isCorrect": bool(a.get("isCorrect", False))
                }
                for a in top
            ]

            results.append({
                "questionId": q.get("_id"),
                "questionType": qtype,
                "text": qtext,
                "questionLevel": lvl,         
                "questionCategory": cat,
                "responseCount": total,
                "rankable": True,
                "skipReason": None,
                "clusters": preview_clusters,
                # Optional: surface a few meta numbers the UI can show
                "debug": {
                    "ranked_cnt": int(meta.get("ranked_cnt", 0)),
                    "scored_cnt": int(meta.get("scored_cnt", 0)),
                }
            })

        return results

    def _fetch_questions(self) -> List[Dict]:
        """Fetch all questions from database"""
        try:
            return self.db.fetch_all_questions()
        except Exception as e:
            logger.error("Fetch error: %s", e)
            return []

    def process_all_questions(self) -> Dict:
        questions = self._fetch_questions()
        total = len(questions)
        stats = {
            "total_questions": total,
            "processed_questions": 0,
            "processed_count": 0,
            "updated_questions": 0,
            "updated_count": 0,
            "skipped_mcq": 0,
            "skipped_insufficient": 0,
            "validation_failed": 0,
            "skipped_count": 0,
            "failed_count": 0,
            "answers_ranked": 0,   # add for app.py
            "answers_scored": 0,   # optional aggregate
        }
        if not questions:
            return stats

        to_update: List[Dict] = []

        for q in questions:
            pq, res = self.question_processor.process_question(q)
            if res.get("processed"):
                if DataValidator.validate_question(pq):
                    to_update.append(pq)
                    stats["processed_questions"] += 1
                    stats["answers_ranked"] += int(res.get("ranked_cnt", 0))
                    stats["answers_scored"] += int(res.get("scored_cnt", 0))
                else:
                    stats["validation_failed"] += 1
            else:
                stats["skipped_mcq"] += int(res.get("skipped_mcq", False))
                stats["skipped_insufficient"] += int(res.get("skipped_insufficient", False))

        stats["processed_count"] = stats["processed_questions"]
        stats["skipped_count"] = stats["skipped_mcq"] + stats["skipped_insufficient"] + stats["validation_failed"]
        stats["failed_count"] = stats["validation_failed"]

        if to_update:
            res = self.db.bulk_update_questions(to_update)
            updated = res.get("updated") or res.get("updated_count", 0)
            stats["updated_questions"] = updated
            stats["updated_count"] = updated

        return stats
    
