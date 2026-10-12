from datetime import datetime, timedelta, timezone
import os
import secrets

from fastapi import (
    FastAPI, 
    HTTPException, 
    Header,
    Depends
)

app = FastAPI(
    title="ChocoManía Backend API",
    description="API de catálogo y órdenes enrutada por API gateway /api/products y /api/orders"
)

INTERNAL_GATEWAY_SECRET = os.getenv(
    "INTERNAL_GATEWAY_SECRET"
)

if not INTERNAL_GATEWAY_SECRET:
    raise RuntimeError(
        "INTERNAL_GATEWAY_SECRET no está configurado"
    )

def verify_gateway(
        x_gateway_secret: str = Header(default="")
):
    valid = secrets.compare_digest(
        x_gateway_secret,
        INTERNAL_GATEWAY_SECRET
    )
    if not valid:
        raise HTTPException(
            status_code=403,
            detail="Solicitud no autorizada"
        )



@app.get(
        "/health",
        dependencies=[Depends(verify_gateway)]
        )
def health(
    x_authenticated_client: str | None = Header(
        default=None
    )
):
    return {
        "authenticated_client": x_authenticated_client,
        "status": "OK",
        "service": "ChocoMania API"
    }

@app.get(
        "/productos",
        dependencies=[Depends(verify_gateway)]
        )
def productos(
    x_authenticated_client: str | None = Header(default=None),
    x_authenticated_user: str | None = Header(default=None),
    x_authenticated_roles: str | None = Header(default=None)
):
    return {
        "identify": {
            "client_id": x_authenticated_client,
            "username": x_authenticated_user,
            "roles": x_authenticated_roles
        },

        "productos": [
            {"id": 1, "nombre": "Caja de Bombones Surtidos", "precio": 15000},
            {"id": 2, "nombre": "Barra Chocolate Lindt Excellence 70% Cacao", "precio": 6890},
            {"id": 1, "nombre": "Bombones Ferrerro Rocher 8 Unidades", "precio": 8990},
            {"id": 1, "nombre": "Trencito 150g", "precio": 3290}
        ]
    }

@app.get(
        "/pedidos",
        dependencies=[Depends(verify_gateway)]
        )
def pedidos(
    x_authenticated_client: str | None = Header(default=None),
    x_authenticated_user: str | None = Header(default=None),
    x_authenticated_roles: str | None = Header(default=None)
    ):

    return {
        "identity": {
            "client_id": x_authenticated_client,
            "username": x_authenticated_user,
            "roles": x_authenticated_roles
        },

        "pedidos": [
            {"id": 1001, "status": "pagado"},
            {"id": 1002, "status": "pendiente"}
        ]
    }