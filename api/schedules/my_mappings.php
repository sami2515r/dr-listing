<?php

require_once "../../includes/cors.php";
require_once "../../includes/doctor_auth.php";
require_once "../../includes/response.php";
require_once "../../config/db.php";

$doctor_id = $_SESSION['doctor_id'];

$query = "
SELECT
    hd.id,
    hd.hospital_id,
    h.name AS hospital_name
FROM hospital_doctors hd
INNER JOIN hospitals h
ON hd.hospital_id = h.id
WHERE hd.doctor_id = ?
AND hd.status = 1
AND h.status = 1
ORDER BY h.name ASC
";

$stmt = $conn->prepare($query);
$stmt->execute([$doctor_id]);

$mappings = $stmt->fetchAll(PDO::FETCH_ASSOC);

success("Doctor hospital mappings fetched successfully", $mappings);