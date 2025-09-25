from fastapi import FastAPI
from sqlmodel import SQLModel, Field, Session, create_engine, select
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
engine = create_engine("sqlite:///db.sqlite3")

# ==================
# CORS
# ==================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================
# MODELS
# ==================
class Product(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    price: int

class ProductCreate(BaseModel):
    name: str
    price: int

class CartItem(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    product_id: int
    quantity: int = 1

SQLModel.metadata.create_all(engine)

# ==================
# PRODUCTS
# ==================
@app.get("/products")
def get_products():
    with Session(engine) as session:
        return session.exec(select(Product)).all()

@app.post("/products")
def add_product(product: ProductCreate):
    with Session(engine) as session:
        new_product = Product(name=product.name, price=product.price)
        session.add(new_product)
        session.commit()
        session.refresh(new_product)
        return new_product

# ==================
# CART
# ==================
@app.get("/cart")
def get_cart():
    with Session(engine) as session:
        items = session.exec(select(CartItem)).all()
        cart = []
        for item in items:
            product = session.get(Product, item.product_id)
            if product:
                cart.append({
                    "id": item.id,
                    "product_id": item.product_id,
                    "name": product.name,
                    "price": product.price,
                    "quantity": item.quantity,
                })
        return cart

@app.post("/cart/{product_id}")
def add_to_cart(product_id: int):
    with Session(engine) as session:
        product = session.get(Product, product_id)
        if not product:
            return {"error": "Product not found"}

        stmt = select(CartItem).where(CartItem.product_id == product_id)
        cart_item = session.exec(stmt).first()

        if cart_item:
            cart_item.quantity += 1
        else:
            cart_item = CartItem(product_id=product_id, quantity=1)
            session.add(cart_item)

        session.commit()
        session.refresh(cart_item)
        return cart_item

@app.delete("/cart/{product_id}")
def remove_from_cart(product_id: int):
    with Session(engine) as session:
        stmt = select(CartItem).where(CartItem.product_id == product_id)
        cart_item = session.exec(stmt).first()
        if not cart_item:
            return {"error": "Item not in cart"}

        session.delete(cart_item)
        session.commit()
        return {"message": "Item removed"}
