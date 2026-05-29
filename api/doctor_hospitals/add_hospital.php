<?php

require_once "../../includes/cors.php";
require_once "../../includes/response.php";
require_once "../../config/db.php";

$doctor_id = $_POST['doctor_id'] ?? '';
$name = $_POST['name'] ?? '';
$hospital_type = $_POST['hospital_type'] ?? '';
$phone = $_POST['phone'] ?? '';
$description = $_POST['description'] ?? '';

$address1 = $_POST['addresses_line1'] ?? '';
$address2 = $_POST['addresses_line2'] ?? '';
$city = $_POST['city'] ?? '';
$state = $_POST['state'] ?? '';
$country = $_POST['country'] ?? '';
$pincode = $_POST['pincode'] ?? '';

if ($doctor_id == '' || $name == '' || $hospital_type == '' || $phone == '' || $address1 == '' || $city == '' || $state == '' || $country == '' || $pincode == '') {
    error("Required fields are missing");
}
$checkStmt = $conn->prepare("
SELECT id
FROM hospitals
WHERE created_by_doctor_id = ?
AND name = ?
AND phone = ?
AND status IN (0, 1)
LIMIT 1
");

$checkStmt->execute([$doctor_id, $name, $phone]);

if ($checkStmt->rowCount() > 0) {
    error("You already added this hospital request");
    exit;
}
$conn->beginTransaction();

try {
    $query = "INSERT INTO hospitals
    (created_by_doctor_id, name, hospital_type, phone, description, status)
    VALUES
    (:doctor_id, :name, :hospital_type, :phone, :description, 0)";

    $stmt = $conn->prepare($query);
    $stmt->execute([
        ':doctor_id' => $doctor_id,
        ':name' => $name,
        ':hospital_type' => $hospital_type,
        ':phone' => $phone,
        ':description' => $description
    ]);

    $hospital_id = $conn->lastInsertId();

    $addressQuery = "INSERT INTO hospital_addresses
    (hospital_id, addresses_line1, addresses_line2, city, state, country, pincode)
    VALUES
    (:hospital_id, :address1, :address2, :city, :state, :country, :pincode)";

    $addressStmt = $conn->prepare($addressQuery);
    $addressStmt->execute([
        ':hospital_id' => $hospital_id,
        ':address1' => $address1,
        ':address2' => $address2,
        ':city' => $city,
        ':state' => $state,
        ':country' => $country,
        ':pincode' => $pincode
    ]);

    $conn->commit();

    success("Hospital request sent to admin");

} catch (Exception $e) {
    $conn->rollBack();
    error("Hospital request failed");
}