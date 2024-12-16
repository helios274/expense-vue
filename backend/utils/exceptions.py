from drf_standardized_errors.formatter import ExceptionFormatter
from drf_standardized_errors.types import ErrorResponse
import traceback
from django.conf import settings


class CustomExceptionFormatter(ExceptionFormatter):
    def format_error_response(self, error_response: ErrorResponse):
        error = error_response.errors[0]
        formatted_error = {
            "type": error_response.type,
            "code": error.code,
            "message": error.detail,
        }

        # Add debugging details if in development
        if settings.DEBUG:
            formatted_error["traceback"] = traceback.format_exc()

        return formatted_error
