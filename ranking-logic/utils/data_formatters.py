from typing import Dict, List
from constants import QuestionFields, AnswerFields, Defaults


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


def _def(name: str, fallback):
    try:
        return getattr(Defaults, name)
    except Exception:
        return fallback


class AnswerFormatter:
    """Utility class for formatting answer data"""

    @staticmethod
    def format_for_api(answer: Dict) -> Dict:
        """
        Format answer for API submission WITHOUT overwriting existing
        rank / score if already computed.
        """
        # Work on a shallow copy
        a = dict(answer)

        # Ensure essentials (only set defaults if missing)
        a.setdefault(AnswerFields.ANSWER, _def("ANSWER_TEXT", ""))
        a.setdefault(AnswerFields.IS_CORRECT, _def("IS_CORRECT", False))
        a.setdefault(AnswerFields.RESPONSE_COUNT, _def("RESPONSE_COUNT", 0))
        a.setdefault(AnswerFields.RANK, _def("RANK", 0))
        a.setdefault(AnswerFields.SCORE, _def("SCORE", 0))

        # Copy id forms
        if AnswerFields.ID in a and AnswerFields.ANSWER_ID not in a:
            a[AnswerFields.ANSWER_ID] = a[AnswerFields.ID]

        return {
            AnswerFields.ANSWER: a.get(AnswerFields.ANSWER),
            AnswerFields.IS_CORRECT: _to_bool(a.get(AnswerFields.IS_CORRECT)),
            AnswerFields.RESPONSE_COUNT: _to_int(a.get(AnswerFields.RESPONSE_COUNT)),
            AnswerFields.RANK: _to_int(a.get(AnswerFields.RANK)),
            AnswerFields.SCORE: _to_int(a.get(AnswerFields.SCORE)),
            AnswerFields.ANSWER_ID: a.get(AnswerFields.ANSWER_ID) or a.get(AnswerFields.ID, ""),
        }


class QuestionFormatter:
    """Utility class for formatting question data"""

    @staticmethod
    def get_question_id(question: Dict) -> str:
        """
        Single authoritative method (remove duplicate definitions).
        """
        return (question.get(QuestionFields.QUESTION_ID)
                or question.get(QuestionFields.ID)
                or "")

    @staticmethod
    def ensure_compatibility(question: Dict) -> Dict:
        """
        Normalize question/answers to expected shapes and types.
        Preserves existing rank/score; fills missing fields with defaults.
        """
        q = dict(question)

        # Normalize ID
        if q.get(QuestionFields.ID) and not q.get(QuestionFields.QUESTION_ID):
            q[QuestionFields.QUESTION_ID] = q[QuestionFields.ID]

        # Safe counters with defaults
        q[QuestionFields.TIMES_SKIPPED] = _to_int(q.get(QuestionFields.TIMES_SKIPPED, _def("TIMES_SKIPPED", 0)))
        q[QuestionFields.TIMES_ANSWERED] = _to_int(q.get(QuestionFields.TIMES_ANSWERED, _def("TIMES_ANSWERED", 0)))

        # Normalize answers
        answers = q.get(QuestionFields.ANSWERS) or []
        norm_answers: List[Dict] = []
        for a in answers:
            aa = dict(a)
            if aa.get(AnswerFields.ID) and not aa.get(AnswerFields.ANSWER_ID):
                aa[AnswerFields.ANSWER_ID] = aa[AnswerFields.ID]
            aa.setdefault(AnswerFields.ANSWER, _def("ANSWER_TEXT", ""))
            aa[AnswerFields.IS_CORRECT] = _to_bool(aa.get(AnswerFields.IS_CORRECT, _def("IS_CORRECT", False)))
            aa[AnswerFields.RESPONSE_COUNT] = _to_int(aa.get(AnswerFields.RESPONSE_COUNT, _def("RESPONSE_COUNT", 0)))
            aa[AnswerFields.RANK] = _to_int(aa.get(AnswerFields.RANK, _def("RANK", 0)))
            aa[AnswerFields.SCORE] = _to_int(aa.get(AnswerFields.SCORE, _def("SCORE", 0)))
            norm_answers.append(aa)
        q[QuestionFields.ANSWERS] = norm_answers

        return q

    @staticmethod
    def format_for_api(question: Dict) -> Dict:
        q = dict(question)
        answers = [AnswerFormatter.format_for_api(a) for a in q.get(QuestionFields.ANSWERS, []) or []]
        return {
            QuestionFields.QUESTION_ID: q.get(QuestionFields.QUESTION_ID) or q.get(QuestionFields.ID),
            QuestionFields.QUESTION_TYPE: q.get(QuestionFields.QUESTION_TYPE),
            QuestionFields.QUESTION: q.get(QuestionFields.QUESTION),
            # REQUIRED by backend
            QuestionFields.QUESTION_CATEGORY: q.get(QuestionFields.QUESTION_CATEGORY),
            QuestionFields.QUESTION_LEVEL: q.get(QuestionFields.QUESTION_LEVEL),
            # Safe counters
            QuestionFields.TIMES_SKIPPED: _to_int(q.get(QuestionFields.TIMES_SKIPPED, _def("TIMES_SKIPPED", 0))),
            QuestionFields.TIMES_ANSWERED: _to_int(q.get(QuestionFields.TIMES_ANSWERED, _def("TIMES_ANSWERED", 0))),
            QuestionFields.ANSWERS: answers,
        }


class DataValidator:
    @staticmethod
    def validate_answer(answer: Dict, question_id: str, answer_index: int) -> bool:
        return (
            isinstance(answer.get(AnswerFields.ANSWER), str) and
            isinstance(answer.get(AnswerFields.IS_CORRECT), bool) and
            isinstance(answer.get(AnswerFields.RESPONSE_COUNT), int) and
            isinstance(answer.get(AnswerFields.RANK), int) and
            isinstance(answer.get(AnswerFields.SCORE), int)
        )

    @staticmethod
    def validate_question(question: Dict) -> bool:
        qid = QuestionFormatter.get_question_id(question)
        if not qid:
            return False
        if not question.get(QuestionFields.QUESTION_CATEGORY):
            return False
        if not question.get(QuestionFields.QUESTION_LEVEL):
            return False
        answers = question.get(QuestionFields.ANSWERS) or []
        if not isinstance(answers, list) or not answers:
            return False
        for i, a in enumerate(answers):
            if not DataValidator.validate_answer(a, qid, i):
                return False
        return True