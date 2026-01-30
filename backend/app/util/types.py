from enum import Enum

class JWTTokenKey(Enum):
    ID = 'id'
    EXPIRY = 'expiry'
    TOKEN_TYPE = 'token_type'
    PRODUCT_NAME = 'product_name'


class Algorithm(Enum):
    HS256 = 'HS256'
