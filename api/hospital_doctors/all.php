<?php

require_once "../../includes/cors.php";
require_once "../../includes/admin_auth.php";
require_once "../../includes/response.php";
require_once "../../config/db.php";

$query = "
SELECT
    hd.id,
    hd.doctor_id,
    hd.hospital_id,

    d.name AS doctor_name,
    h.name AS hospital_name

FROM hospital_doctors hd

INNER JOIN doctors d
ON hd.doctor_id = d.id

INNER JOIN hospitals h
ON hd.hospital_id = h.id

WHERE
    hd.status = 1
AND
    d.status = 1
AND
    h.status = 1

ORDER BY d.name ASC, h.name ASC
";

$stmt = $conn->prepare($query);

$stmt->execute();

$mappings = $stmt->fetchAll(PDO::FETCH_ASSOC);

success("Doctor hospital mappings fetched successfully", $mappings);