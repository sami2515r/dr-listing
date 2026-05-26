<?php

require_once "../../includes/cors.php";
require_once "../../includes/response.php";
require_once "../../config/db.php";

$request_id = $_POST['request_id'] ?? '';

if (empty($request_id)) {
    error("Request ID is required");
    exit;
}

$stmt = $conn->prepare("
UPDATE hospital_doctors
SET status = 1, updated_at = NOW()
WHERE id = ?
");

$stmt->execute([$request_id]);

success("Hospital request approved successfully");