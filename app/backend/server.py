from fastapi import FastAPI, APIRouter, HTTPException, status
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, date
import bcrypt


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    success: bool
    message: str
    username: Optional[str] = None

# Kategori Model
class Kategori(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id_kategori: str = Field(default_factory=lambda: str(uuid.uuid4()))
    nama_kategori: str
    deskripsi: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class KategoriCreate(BaseModel):
    nama_kategori: str
    deskripsi: str

class KategoriUpdate(BaseModel):
    nama_kategori: Optional[str] = None
    deskripsi: Optional[str] = None

# Supplier Model (updated to match ERD)
class Supplier(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id_supplier: str = Field(default_factory=lambda: str(uuid.uuid4()))
    namaSupplier: str
    email: str
    no_telp: str
    notes: str = ""
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class SupplierCreate(BaseModel):
    namaSupplier: str
    email: str
    no_telp: str
    notes: str = ""

class SupplierUpdate(BaseModel):
    namaSupplier: Optional[str] = None
    email: Optional[str] = None
    no_telp: Optional[str] = None
    notes: Optional[str] = None

# Produk Model
class Produk(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id_produk: str = Field(default_factory=lambda: str(uuid.uuid4()))
    id_kategori: str
    id_supplier: str
    kode_produk: str
    merk: str
    model: str
    ukuran: str
    harga: float
    jumlah_stok: int
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ProdukCreate(BaseModel):
    id_kategori: str
    id_supplier: str
    kode_produk: str
    merk: str
    model: str
    ukuran: str
    harga: float
    jumlah_stok: int

class ProdukUpdate(BaseModel):
    id_kategori: Optional[str] = None
    id_supplier: Optional[str] = None
    kode_produk: Optional[str] = None
    merk: Optional[str] = None
    model: Optional[str] = None
    ukuran: Optional[str] = None
    harga: Optional[float] = None
    jumlah_stok: Optional[int] = None

# Inventory Model (updated to match ERD)
class Inventory(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id_inventory: str = Field(default_factory=lambda: str(uuid.uuid4()))
    id_produk: str
    tipe_jeans: str
    ukuran: str
    quantitas: int
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class InventoryCreate(BaseModel):
    id_produk: str
    tipe_jeans: str
    ukuran: str
    quantitas: int

class InventoryUpdate(BaseModel):
    id_produk: Optional[str] = None
    tipe_jeans: Optional[str] = None
    ukuran: Optional[str] = None
    quantitas: Optional[int] = None

class StockTransaction(BaseModel):
    inventory_id: str
    quantity: int
    transaction_type: str

class DashboardStats(BaseModel):
    total_stock: int
    received_today: int
    shipped_today: int
    low_stock_items: int

class Transaction(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    inventory_id: str
    quantity: int
    transaction_type: str
    transaction_date: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# Routes
@api_router.get("/")
async def root():
    return {"message": "Jeans Inventory Management API"}

@api_router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    if request.username == "admin" and request.password == "admin123":
        return LoginResponse(success=True, message="Login successful", username=request.username)
    else:
        raise HTTPException(status_code=401, detail="Invalid credentials")

# Kategori endpoints
@api_router.get("/kategori", response_model=List[Kategori])
async def get_kategori():
    categories = await db.kategori.find({}, {"_id": 0}).to_list(1000)
    for cat in categories:
        if isinstance(cat['created_at'], str):
            cat['created_at'] = datetime.fromisoformat(cat['created_at'])
    return categories

@api_router.post("/kategori", response_model=Kategori)
async def create_kategori(kategori_input: KategoriCreate):
    kategori_dict = kategori_input.model_dump()
    kategori_obj = Kategori(**kategori_dict)
    doc = kategori_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.kategori.insert_one(doc)
    return kategori_obj

@api_router.put("/kategori/{kategori_id}", response_model=Kategori)
async def update_kategori(kategori_id: str, kategori_update: KategoriUpdate):
    update_data = {k: v for k, v in kategori_update.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    result = await db.kategori.update_one(
        {"id_kategori": kategori_id},
        {"$set": update_data}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Kategori not found")
    
    kategori = await db.kategori.find_one({"id_kategori": kategori_id}, {"_id": 0})
    if isinstance(kategori['created_at'], str):
        kategori['created_at'] = datetime.fromisoformat(kategori['created_at'])
    return kategori

# Supplier endpoints
@api_router.get("/suppliers", response_model=List[Supplier])
async def get_suppliers():
    suppliers = await db.suppliers.find({}, {"_id": 0}).to_list(1000)
    for supplier in suppliers:
        if isinstance(supplier['created_at'], str):
            supplier['created_at'] = datetime.fromisoformat(supplier['created_at'])
    return suppliers

@api_router.post("/suppliers", response_model=Supplier)
async def create_supplier(supplier_input: SupplierCreate):
    supplier_dict = supplier_input.model_dump()
    supplier_obj = Supplier(**supplier_dict)
    doc = supplier_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.suppliers.insert_one(doc)
    return supplier_obj

@api_router.get("/suppliers/{supplier_id}", response_model=Supplier)
async def get_supplier(supplier_id: str):
    supplier = await db.suppliers.find_one({"id_supplier": supplier_id}, {"_id": 0})
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")
    if isinstance(supplier['created_at'], str):
        supplier['created_at'] = datetime.fromisoformat(supplier['created_at'])
    return supplier

@api_router.put("/suppliers/{supplier_id}", response_model=Supplier)
async def update_supplier(supplier_id: str, supplier_update: SupplierUpdate):
    update_data = {k: v for k, v in supplier_update.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    result = await db.suppliers.update_one(
        {"id_supplier": supplier_id},
        {"$set": update_data}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Supplier not found")
    
    supplier = await db.suppliers.find_one({"id_supplier": supplier_id}, {"_id": 0})
    if isinstance(supplier['created_at'], str):
        supplier['created_at'] = datetime.fromisoformat(supplier['created_at'])
    return supplier

# Produk endpoints
@api_router.get("/produk", response_model=List[Produk])
async def get_produk(search: Optional[str] = None):
    query = {}
    if search:
        query = {
            "$or": [
                {"kode_produk": {"$regex": search, "$options": "i"}},
                {"merk": {"$regex": search, "$options": "i"}},
                {"model": {"$regex": search, "$options": "i"}}
            ]
        }
    produk = await db.produk.find(query, {"_id": 0}).to_list(1000)
    for item in produk:
        if isinstance(item['created_at'], str):
            item['created_at'] = datetime.fromisoformat(item['created_at'])
        if isinstance(item['updated_at'], str):
            item['updated_at'] = datetime.fromisoformat(item['updated_at'])
    return produk

@api_router.post("/produk", response_model=Produk)
async def create_produk(produk_input: ProdukCreate):
    produk_dict = produk_input.model_dump()
    produk_obj = Produk(**produk_dict)
    doc = produk_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    await db.produk.insert_one(doc)
    return produk_obj

@api_router.get("/produk/{produk_id}", response_model=Produk)
async def get_produk_item(produk_id: str):
    item = await db.produk.find_one({"id_produk": produk_id}, {"_id": 0})
    if not item:
        raise HTTPException(status_code=404, detail="Produk not found")
    if isinstance(item['created_at'], str):
        item['created_at'] = datetime.fromisoformat(item['created_at'])
    if isinstance(item['updated_at'], str):
        item['updated_at'] = datetime.fromisoformat(item['updated_at'])
    return item

@api_router.put("/produk/{produk_id}", response_model=Produk)
async def update_produk(produk_id: str, produk_update: ProdukUpdate):
    update_data = {k: v for k, v in produk_update.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    update_data['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    result = await db.produk.update_one(
        {"id_produk": produk_id},
        {"$set": update_data}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Produk not found")
    
    item = await db.produk.find_one({"id_produk": produk_id}, {"_id": 0})
    if isinstance(item['created_at'], str):
        item['created_at'] = datetime.fromisoformat(item['created_at'])
    if isinstance(item['updated_at'], str):
        item['updated_at'] = datetime.fromisoformat(item['updated_at'])
    return item

@api_router.delete("/produk/{produk_id}")
async def delete_produk(produk_id: str):
    result = await db.produk.delete_one({"id_produk": produk_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Produk not found")
    return {"message": "Produk deleted successfully"}

# Inventory endpoints
@api_router.get("/inventory", response_model=List[Inventory])
async def get_inventory(search: Optional[str] = None):
    query = {}
    if search:
        query = {
            "$or": [
                {"tipe_jeans": {"$regex": search, "$options": "i"}},
                {"ukuran": {"$regex": search, "$options": "i"}}
            ]
        }
    inventory = await db.inventory.find(query, {"_id": 0}).to_list(1000)
    for item in inventory:
        if isinstance(item['created_at'], str):
            item['created_at'] = datetime.fromisoformat(item['created_at'])
        if isinstance(item['updated_at'], str):
            item['updated_at'] = datetime.fromisoformat(item['updated_at'])
    return inventory

@api_router.post("/inventory", response_model=Inventory)
async def create_inventory(inventory_input: InventoryCreate):
    inventory_dict = inventory_input.model_dump()
    inventory_obj = Inventory(**inventory_dict)
    doc = inventory_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    await db.inventory.insert_one(doc)
    return inventory_obj

@api_router.get("/inventory/{inventory_id}", response_model=Inventory)
async def get_inventory_item(inventory_id: str):
    item = await db.inventory.find_one({"id_inventory": inventory_id}, {"_id": 0})
    if not item:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    if isinstance(item['created_at'], str):
        item['created_at'] = datetime.fromisoformat(item['created_at'])
    if isinstance(item['updated_at'], str):
        item['updated_at'] = datetime.fromisoformat(item['updated_at'])
    return item

@api_router.put("/inventory/{inventory_id}", response_model=Inventory)
async def update_inventory(inventory_id: str, inventory_update: InventoryUpdate):
    update_data = {k: v for k, v in inventory_update.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    update_data['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    result = await db.inventory.update_one(
        {"id_inventory": inventory_id},
        {"$set": update_data}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    
    item = await db.inventory.find_one({"id_inventory": inventory_id}, {"_id": 0})
    if isinstance(item['created_at'], str):
        item['created_at'] = datetime.fromisoformat(item['created_at'])
    if isinstance(item['updated_at'], str):
        item['updated_at'] = datetime.fromisoformat(item['updated_at'])
    return item

@api_router.delete("/inventory/{inventory_id}")
async def delete_inventory(inventory_id: str):
    result = await db.inventory.delete_one({"id_inventory": inventory_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    return {"message": "Inventory item deleted successfully"}

@api_router.post("/inventory/receive")
async def receive_stock(transaction: StockTransaction):
    item = await db.inventory.find_one({"id_inventory": transaction.inventory_id})
    if not item:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    
    new_quantity = item['quantitas'] + transaction.quantity
    await db.inventory.update_one(
        {"id_inventory": transaction.inventory_id},
        {"$set": {"quantitas": new_quantity, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    trans_obj = Transaction(
        inventory_id=transaction.inventory_id,
        quantity=transaction.quantity,
        transaction_type="receive"
    )
    trans_doc = trans_obj.model_dump()
    trans_doc['transaction_date'] = trans_doc['transaction_date'].isoformat()
    await db.transactions.insert_one(trans_doc)
    
    return {"message": "Stock received successfully", "new_quantity": new_quantity}

@api_router.post("/inventory/ship")
async def ship_stock(transaction: StockTransaction):
    item = await db.inventory.find_one({"id_inventory": transaction.inventory_id})
    if not item:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    
    if item['quantitas'] < transaction.quantity:
        raise HTTPException(status_code=400, detail="Insufficient stock")
    
    new_quantity = item['quantitas'] - transaction.quantity
    await db.inventory.update_one(
        {"id_inventory": transaction.inventory_id},
        {"$set": {"quantitas": new_quantity, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    trans_obj = Transaction(
        inventory_id=transaction.inventory_id,
        quantity=transaction.quantity,
        transaction_type="ship"
    )
    trans_doc = trans_obj.model_dump()
    trans_doc['transaction_date'] = trans_doc['transaction_date'].isoformat()
    await db.transactions.insert_one(trans_doc)
    
    return {"message": "Stock shipped successfully", "new_quantity": new_quantity}

@api_router.get("/dashboard/stats", response_model=DashboardStats)
async def get_dashboard_stats():
    inventory_items = await db.inventory.find({}, {"_id": 0}).to_list(1000)
    total_stock = sum(item['quantitas'] for item in inventory_items)
    
    today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    today_start_iso = today_start.isoformat()
    transactions = await db.transactions.find({}, {"_id": 0}).to_list(10000)
    
    received_today = 0
    shipped_today = 0
    for trans in transactions:
        trans_date_str = trans['transaction_date']
        trans_date = datetime.fromisoformat(trans_date_str)
        if trans_date >= today_start:
            if trans['transaction_type'] == 'receive':
                received_today += trans['quantity']
            elif trans['transaction_type'] == 'ship':
                shipped_today += trans['quantity']
    
    low_stock_items = sum(1 for item in inventory_items if item['quantitas'] < 10)
    
    return DashboardStats(
        total_stock=total_stock,
        received_today=received_today,
        shipped_today=shipped_today,
        low_stock_items=low_stock_items
    )

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()