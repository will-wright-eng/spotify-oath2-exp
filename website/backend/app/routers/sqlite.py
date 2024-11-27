from typing import Dict, List

from fastapi import Depends, APIRouter
from sqlmodel import Session, text

from app.core.database import get_session

router = APIRouter()


async def get_table_info(db: Session) -> List[Dict]:
    """Get information about all tables in the database"""
    query = text(
        """
        SELECT
            name as table_name,
            type as table_type
        FROM sqlite_master
        WHERE type IN ('table', 'view')
        AND name NOT LIKE 'sqlite_%'
    """
    )
    results = db.exec(query).all()
    return [{"table_name": row.table_name, "table_type": row.table_type} for row in results]


async def get_table_schema(db: Session, table_name: str) -> List[Dict]:
    """Get schema information for a specific table"""
    query = text(f"PRAGMA table_info('{table_name}')")
    results = db.exec(query).all()
    return [
        {"cid": row[0], "name": row[1], "type": row[2], "notnull": row[3], "dflt_value": row[4], "pk": row[5]}
        for row in results
    ]


@router.get("/db-info")
async def get_database_info(db: Session = Depends(get_session)) -> Dict:
    """
    Get information about the SQLite database structure.

    Returns:
    - Dictionary containing database tables, views, and their schemas
    """
    tables_and_views = await get_table_info(db)

    # Get schema for each table/view
    detailed_info = {}
    for item in tables_and_views:
        table_name = item["table_name"]
        detailed_info[table_name] = {"type": item["table_type"], "columns": await get_table_schema(db, table_name)}

    # Get SQLite version
    version_query = text("SELECT sqlite_version()")
    sqlite_version = db.exec(version_query).first()[0]

    return {
        "database_info": {
            "sqlite_version": sqlite_version,
            "total_tables": len([t for t in tables_and_views if t["table_type"] == "table"]),
            "total_views": len([t for t in tables_and_views if t["table_type"] == "view"]),
        },
        "tables_and_views": detailed_info,
    }
