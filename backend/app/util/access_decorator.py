from typing import Callable, Optional
import functools

from sqlalchemy.future import select

from app.db.models import Notes, Versions
from app.util.response import CustomResponse

ACCESS_DENIED_ERROR = "User does not have access"
NOTE_NOT_FOUND_ERROR = "Note not found"
VERSION_NOT_FOUND_ERROR = "Version not found"


def verify_note_access():
    """
    Decorator to verify access to a note and optionally its version.
    Attaches 'note' and 'version' (if applicable) to request.scope.
    """
    def decorator(func: Callable):
        @functools.wraps(func)
        async def wrapper(*args, **kwargs):
            db = kwargs.get('db')
            current_user = kwargs.get('current_user', {})
            request = kwargs.get('request', None)
            
            note_id = kwargs.get('note_id')
            version_id = kwargs.get('version_id')
            user_id = current_user.get('id')

            if not db or not user_id:
                return CustomResponse(
                    general_message="Missing database session or user information"
                ).get_failure_response()

            if note_id:
                note_query = select(Notes).filter(Notes.id == note_id)
                note_result = await db.execute(note_query)
                note = note_result.scalars().first()
                
                if not note:
                    return CustomResponse(general_message=NOTE_NOT_FOUND_ERROR).get_failure_response()
                
                if note.created_by != user_id:
                    return CustomResponse(general_message=ACCESS_DENIED_ERROR).get_failure_response()
                
                if request:
                    request.scope["note"] = note

            if version_id:
                version_query = select(Versions).filter(Versions.id == version_id)
                if note_id:
                    version_query = version_query.filter(Versions.note_id == note_id)
                
                version_result = await db.execute(version_query)
                version = version_result.scalars().first()

                if not version:
                    return CustomResponse(general_message=VERSION_NOT_FOUND_ERROR).get_failure_response()
                
                if not note_id:
                    parent_note = await db.scalar(select(Notes).filter(Notes.id == version.note_id))
                    if not parent_note or parent_note.created_by != user_id:
                        return CustomResponse(general_message=ACCESS_DENIED_ERROR).get_failure_response()
                    if request:
                        request.scope["note"] = parent_note

                if request:
                    request.scope["version"] = version

            return await func(*args, **kwargs)

        return wrapper

    return decorator