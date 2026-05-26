<?php

require_once "../../includes/cors.php";
// require_once "../../includes/doctor_auth.php";
require_once "../../includes/response.php";
require_once "../../config/db.php";

$id = $_POST['id'] ?? '';
$name = $_POST['name'] ?? '';
$email = $_POST['email'] ?? '';
$phone = $_POST['phone'] ?? '';
$profile_image = $_POST['profile_image'] ?? '';
$description = $_POST['description'] ?? '';
$qualification = $_POST['qualification'] ?? '';
$consulting_fee = $_POST['consulting_fee'] ?? '';
$availability_status = $_POST['availability_status'] ?? '';
$specialization = $_POST['specialization'] ?? '';

if(empty($id)) {
    error("Doctor ID is required");
    exit;
}

if(empty($name) || empty($email) || empty($phone) || empty($qualification) || empty($specialization)) {
    error("Name, email, phone, qualification and specialization are required");
    exit;
}

$checkQuery = "
SELECT id, profile_image
FROM doctors
WHERE id = ?
LIMIT 1
";

$checkStmt = $conn->prepare($checkQuery);
$checkStmt->execute([$id]);

$doctor = $checkStmt->fetch(PDO::FETCH_ASSOC);

if(!$doctor) {
    error("Doctor not found");
    exit;
}

$emailCheckQuery = "
SELECT id
FROM doctors
WHERE email = ?
AND id != ?
LIMIT 1
";

$emailCheckStmt = $conn->prepare($emailCheckQuery);
$emailCheckStmt->execute([$email, $id]);

$emailExists = $emailCheckStmt->fetch(PDO::FETCH_ASSOC);

if($emailExists) {
    error("Email already used by another doctor");
    exit;
}
/*
|--------------------------------------------------------------------------
| HANDLE PROFILE IMAGE
|--------------------------------------------------------------------------
*/

if(isset($_FILES['profile_image']) && $_FILES['profile_image']['error'] === 0) {

    $file = $_FILES['profile_image'];

    $allowedExtensions = ["jpg", "jpeg", "png", "webp"];
    $fileExtension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

    if(!in_array($fileExtension, $allowedExtensions)) {
        error("Invalid image format");
        exit;
    }

    if($file['size'] > 2 * 1024 * 1024) {
        error("Image size should be less than 2MB");
        exit;
    }

    $profile_image = time() . "_" . uniqid() . "." . $fileExtension;

    $uploadPath = "../../uploads/doctors/" . $profile_image;

    if(!move_uploaded_file($file['tmp_name'], $uploadPath)) {
        error("Failed to upload image");
        exit;
    }

} else {

    $profile_image = $doctor['profile_image'];
}

/*
|--------------------------------------------------------------------------
| UPDATE DOCTOR BASIC DETAILS
|--------------------------------------------------------------------------
*/

$updateQuery = "
UPDATE doctors
SET
    name = ?,
    email = ?,
    phone = ?,
    profile_image = ?,
    description = ?,
    qualification = ?,
    consulting_fee = ?,
    availability_status = ?,
    updated_at = NOW()
WHERE id = ?
";

$updateStmt = $conn->prepare($updateQuery);

$isUpdated = $updateStmt->execute([
    $name,
    $email,
    $phone,
    $profile_image,
    $description,
    $qualification,
    $consulting_fee,
    $availability_status,
    $id
]);

if(!$isUpdated) {
    error("Update failed");
    exit;
}

/*
|--------------------------------------------------------------------------
| UPDATE SPECIALIZATION
|--------------------------------------------------------------------------
*/

$specializationQuery = "
SELECT id
FROM specialization_masters
WHERE name = ?
AND status = 1
LIMIT 1
";

$specializationStmt = $conn->prepare($specializationQuery);
$specializationStmt->execute([$specialization]);

$specializationData = $specializationStmt->fetch(PDO::FETCH_ASSOC);

if(!$specializationData) {
    error("Invalid specialization");
    exit;
}

$inactiveOldQuery = "
UPDATE doctor_specializations
SET status = 0,
    updated_at = NOW()
WHERE doctor_id = ?
";

$inactiveOldStmt = $conn->prepare($inactiveOldQuery);
$inactiveOldStmt->execute([$id]);

$checkSpecializationQuery = "
SELECT id
FROM doctor_specializations
WHERE doctor_id = ?
AND specialization_id = ?
LIMIT 1
";

$checkSpecializationStmt = $conn->prepare($checkSpecializationQuery);
$checkSpecializationStmt->execute([
    $id,
    $specializationData['id']
]);

$existingSpecialization = $checkSpecializationStmt->fetch(PDO::FETCH_ASSOC);

if($existingSpecialization) {

    $activateQuery = "
    UPDATE doctor_specializations
    SET status = 1,
        updated_at = NOW()
    WHERE id = ?
    ";

    $activateStmt = $conn->prepare($activateQuery);
    $activateStmt->execute([$existingSpecialization['id']]);

} else {

    $insertQuery = "
    INSERT INTO doctor_specializations
    (
        doctor_id,
        specialization_id,
        status,
        created_at
    )
    VALUES
    (
        ?, ?, 1, NOW()
    )
    ";

    $insertStmt = $conn->prepare($insertQuery);
    $insertStmt->execute([
        $id,
        $specializationData['id']
    ]);
}

success("Doctor updated successfully");