<?php

require_once "../../includes/cors.php";
require_once "../../includes/admin_auth.php";
require_once "../../includes/response.php";
require_once "../../config/db.php";

$id = $_POST['id'] ?? '';
$status = $_POST['status'] ?? '';

if(empty($id)) {

    error("Doctor ID required");
    exit;
}

$query = "
UPDATE doctors
SET
    status = ?,
    updated_at = NOW()
WHERE id = ?
";

$stmt = $conn->prepare($query);

$isUpdated = $stmt->execute([

    $status,
    $id
]);

if($isUpdated) {

    success("Doctor status updated");

} else {

    error("Update failed");
}