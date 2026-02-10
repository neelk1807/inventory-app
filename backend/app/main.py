from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base

from app.models import User, Category, Product , StockMovement 
from app.models.order import Order, OrderItem
from app.routes import category_router, product_router, auth_router , stock , stats , order

app = FastAPI()

# CORS must be added BEFORE routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)

app.include_router(auth_router)
app.include_router(category_router)
app.include_router(product_router)
app.include_router(stock.router)
app.include_router(stats.router)
app.include_router(order.router)

@app.get("/")
def root():
    return {"message": "Inventory API with auth"}
