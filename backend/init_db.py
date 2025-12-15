from app.data.models import Base
from app.data.db import engine
print("Creating all tables...")
Base.metadata.create_all(bind=engine)
print("Tables created.")
