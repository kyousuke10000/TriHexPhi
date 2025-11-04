# Armory Catalog

TABLE class, rarity, role, owner, status, file.name
FROM "40_HARMONIA/Armory"
WHERE class
SORT rarity desc, file.name asc
