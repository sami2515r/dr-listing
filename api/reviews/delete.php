<?php

require_once "../../includes/cors.php";
require_once "../../includes/admin_auth.php";
require_once "../../includes/response.php";
require_once "../../config/db.php";

$review_id = $_POST['review_id'] ?? '';
$is_approved = $_POST['is_approved'] ?? 0;

if(empty($review_id)) {
    error("Review ID is required");
    exit;
}

$query = "
UPDATE reviews
SET
    status = 0,
    updated_at = NOW()
WHERE id = ?
";

$stmt = $conn->prepare($query);

$isDeleted = $stmt->execute([$review_id]);

if($isDeleted) {
    if($is_approved == 1) {

    success("Review hidden successfully");

} else {

    success("Review rejected successfully");
}
} else {
    error("Review hide failed");
}