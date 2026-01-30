from enum import Enum

class JWTTokenKey(Enum):
    ID = 'id'
    EXPIRY = 'expiry'
    TOKEN_TYPE = 'token_type'
    PRODUCT_NAME = 'product_name'


class Algorithm(Enum):
    HS256 = 'HS256'


class InteractionStatus(Enum):
    PENDING = 'Pending'
    COMPLETED = 'Completed'
    FAILED = 'Failed'

    @staticmethod
    def get_all_status():
        return [role.value for role in InteractionStatus]