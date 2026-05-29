<?php

require_once "../../includes/cors.php";
require_once "../../includes/response.php";
require_once "../../config/db.php";

$hospital_id = $_POST['hospital_id'] ?? '';

if (empty($hospital_id)) {
    error("Hospital ID is required");
    exit;
}

$conn->beginTransaction();

try {
    $stmt = $conn->prepare("
        UPDATE hospitals
        SET status = 1, updated_at = NOW()
        WHERE id = ?
    ");

    $stmt->execute([$hospital_id]);

    $doctorStmt = $conn->prepare("
        SELECT created_by_doctor_id
        FROM hospitals
        WHERE id = ?
    ");

    $doctorStmt->execute([$hospital_id]);
    $hospital = $doctorStmt->fetch(PDO::FETCH_ASSOC);

    if ($hospital && !empty($hospital['created_by_doctor_id'])) {
        $doctor_id = $hospital['created_by_doctor_id'];

        $checkStmt = $conn->prepare("
            SELECT id
            FROM hospital_doctors
            WHERE doctor_id = ?
            AND hospital_id = ?
        ");

        $checkStmt->execute([$doctor_id, $hospital_id]);

        if ($checkStmt->rowCount() === 0) {
            $insertStmt = $conn->prepare("
                INSERT INTO hospital_doctors
                (doctor_id, hospital_id, status)
                VALUES (?, ?, 1)
            ");

            $insertStmt->execute([$doctor_id, $hospital_id]);
        }
    }

    $conn->commit();

    success("Hospital approved and assigned to doctor successfully");

} catch (Exception $e) {
    $conn->rollBack();
    error("Hospital approval failed");
}