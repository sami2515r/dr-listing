<?php

require_once "../../includes/cors.php";
require_once "../../includes/response.php";
require_once "../../config/db.php";

$hospital_id = $_POST['hospital_id'] ?? '';

if (empty($hospital_id)) {
    error("Hospital ID is required");
    exit;
}

$stmt = $conn->prepare("
    UPDATE hospitals
    SET status = 2, updated_at = NOW()
    WHERE id = ?
");

$stmt->execute([$hospital_id]);

success("Hospital rejected successfully");