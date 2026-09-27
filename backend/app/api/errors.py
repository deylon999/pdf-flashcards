from fastapi import Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

MESSAGES = {
    "missing": "Обязательное поле",
    "string_too_short": "Поле не может быть пустым",
    "string_too_long": "Не длиннее {max_length} символов",
    "string_type": "Должно быть строкой",
    "bool_parsing": "Должно быть true или false",
    "bool_type": "Должно быть true или false",
    "int_parsing": "Должно быть целым числом",
    "json_invalid": "Некорректный JSON",
    "model_attributes_type": "Ожидается JSON-объект",
}


async def validation_error_handler(request: Request, exc: RequestValidationError):
    errors = []
    for err in exc.errors():
        if err["type"] in MESSAGES:
            message = MESSAGES[err["type"]].format(**err.get("ctx", {}))
        else:
            message = err["msg"]
        errors.append({"field": err["loc"][-1], "message": message})
    return JSONResponse(status_code=422, content={"detail": errors})
