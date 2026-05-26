<?php

require_once "../../includes/cors.php";
require_once "../../includes/response.php";
require_once "../../config/db.php";

$query = "
SELECT
    id,
    name
FROM specialization_masters
WHERE status = 1
ORDER BY name ASC
";

$stmt = $conn->prepare($query);
$stmt->execute();

$specializations = $stmt->fetchAll(PDO::FETCH_ASSOC);

success("Specializations fetched successfully", $specializations);