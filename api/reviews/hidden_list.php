<?php

require_once "../../includes/cors.php";
require_once "../../includes/admin_auth.php";
require_once "../../includes/response.php";
require_once "../../config/db.php";

$query = "
SELECT
    r.*,
    d.name AS doctor_name
FROM reviews r

LEFT JOIN doctors d
ON r.doctor_id = d.id

WHERE r.status = 0
AND r.is_approved = 1

ORDER BY r.id DESC
";

$stmt = $conn->prepare($query);

$stmt->execute();

$reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);

success("Hidden reviews fetched", $reviews);