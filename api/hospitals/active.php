<?php

require_once "../../includes/cors.php";
require_once "../../includes/response.php";
require_once "../../config/db.php";

$query = "
SELECT
    h.id,
    h.name,
    h.hospital_type,
    h.phone,
    ha.city,
    ha.state
FROM hospitals h
LEFT JOIN hospital_addresses ha ON ha.hospital_id = h.id
WHERE h.status = 1
ORDER BY h.name ASC
";

$stmt = $conn->prepare($query);
$stmt->execute();

success("Active hospitals fetched successfully", $stmt->fetchAll(PDO::FETCH_ASSOC));