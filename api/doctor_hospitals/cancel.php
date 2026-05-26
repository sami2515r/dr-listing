<?php

require_once "../../includes/cors.php";
require_once "../../includes/response.php";
require_once "../../config/db.php";

$request_id = $_POST['request_id'] ?? '';
$doctor_id = $_POST['doctor_id'] ?? '';

if (empty($request_id) || empty($doctor_id)) {
    error("Request ID and Doctor ID are required");
    exit;
}

$query = "
DELETE FROM hospital_doctors
WHERE id = ?
AND doctor_id = ?
AND status = 0
";

$stmt = $conn->prepare($query);
$stmt->execute([$request_id, $doctor_id]);

success("Hospital request cancelled successfully");