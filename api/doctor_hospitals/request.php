<?php

require_once "../../includes/cors.php";
require_once "../../includes/response.php";
require_once "../../config/db.php";

$doctor_id = $_POST['doctor_id'] ?? '';
$hospital_id = $_POST['hospital_id'] ?? '';

if (empty($doctor_id) || empty($hospital_id)) {
    error("Doctor ID and Hospital ID are required");
    exit;
}

$check = $conn->prepare("
SELECT id, status
FROM hospital_doctors
WHERE doctor_id = ? AND hospital_id = ?
LIMIT 1
");
$check->execute([$doctor_id, $hospital_id]);
$existing = $check->fetch(PDO::FETCH_ASSOC);

if ($existing) {
    if ((int)$existing['status'] === 1) {
        error("Already approved for this hospital");
        exit;
    }

    if ((int)$existing['status'] === 0) {
        error("Request already pending");
        exit;
    }

    $stmt = $conn->prepare("
    UPDATE hospital_doctors
    SET status = 0, updated_at = NOW()
    WHERE id = ?
    ");
    $stmt->execute([$existing['id']]);

    success("Request sent again successfully");
    exit;
}

$stmt = $conn->prepare("
INSERT INTO hospital_doctors
(doctor_id, hospital_id, status, created_at)
VALUES (?, ?, 0, NOW())
");

$stmt->execute([$doctor_id, $hospital_id]);

success("Hospital request sent to admin");