from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = "sqlite:///./dealmind.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


def update_database():
    """
    Add new DealMind intelligence columns
    to an existing SQLite database if needed.
    """

    with engine.connect() as connection:

        columns = connection.execute(
            text("PRAGMA table_info(deals)")
        ).fetchall()

        existing_columns = {
            column[1]
            for column in columns
        }

        if "source_text" not in existing_columns:
            connection.execute(
                text(
                    "ALTER TABLE deals ADD COLUMN source_text TEXT"
                )
            )

        if "intelligence_json" not in existing_columns:
            connection.execute(
                text(
                    "ALTER TABLE deals ADD COLUMN intelligence_json TEXT"
                )
            )

        connection.commit()