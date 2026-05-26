<?php

require_once "../../includes/cors.php";
require_once "../../includes/response.php";
require_once "../../config/db.php";

$query = "
SELECT COUNT(*) AS total
FROM hospital_doctors
WHERE status = 1
";

$stmt = $conn->prepare($query);
$stmt->execute();

$result = $stmt->fetch(PDO::FETCH_ASSOC);

success("Doctor hospital count fetched successfully", [
    "total" => (int)$result['total']
]);