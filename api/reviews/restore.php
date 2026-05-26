<?php

require_once "../../includes/cors.php";
require_once "../../includes/admin_auth.php";
require_once "../../includes/response.php";
require_once "../../config/db.php";

$review_id = $_POST['review_id'] ?? '';

if(empty($review_id)) {
    error("Review ID required");
    exit;
}

$query = "
UPDATE reviews
SET
    status = 1,
    updated_at = NOW()
WHERE id = ?
";

$stmt = $conn->prepare($query);

$isUpdated = $stmt->execute([$review_id]);

if($isUpdated) {
    success("Review restored successfully");
} else {
    error("Restore failed");
}