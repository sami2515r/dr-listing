<?php

require_once "../../includes/cors.php";
require_once "../../includes/admin_auth.php";
require_once "../../includes/response.php";
require_once "../../config/db.php";



/*
|--------------------------------------------------------------------------
| GET FORM DATA
|--------------------------------------------------------------------------
*/

$name = $_POST['name'] ?? '';
$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';
$phone = $_POST['phone'] ?? '';
$description = $_POST['description'] ?? '';
$qualification = $_POST['qualification'] ?? '';
$specialization = $_POST['specialization'] ?? '';
$consulting_fee = $_POST['consulting_fee'] ?? '';
$availability_status = $_POST['availability_status'] ?? '';
$profile_image = null;

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

    $profile_image =
        time() . "_" . uniqid() . "." . $fileExtension;

    $uploadPath =
        "../../uploads/doctors/" . $profile_image;

    if(!move_uploaded_file($file['tmp_name'], $uploadPath)) {

        error("Failed to upload image");
        exit;
    }
}
/*
|--------------------------------------------------------------------------
| VALIDATION
|--------------------------------------------------------------------------
*/

if(
    empty($name) ||
    empty($email) ||
    empty($password) ||
    empty($phone)
) {

    error("Name, email, password and phone are required");
    exit;
}

/*
|--------------------------------------------------------------------------
| CHECK EMAIL EXISTS
|--------------------------------------------------------------------------
*/

$checkQuery = "
SELECT id FROM doctors
WHERE email = ?
LIMIT 1
";

$checkStmt = $conn->prepare($checkQuery);

$checkStmt->execute([$email]);

$emailExists = $checkStmt->fetch(PDO::FETCH_ASSOC);

if($emailExists) {

    error("Email already exists");
    exit;
}

/*
|--------------------------------------------------------------------------
| HASH PASSWORD
|--------------------------------------------------------------------------
*/

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

/*
|--------------------------------------------------------------------------
| INSERT DOCTOR
|--------------------------------------------------------------------------
*/

$insertQuery = "
INSERT INTO doctors
(
    name,
    email,
    password,
phone,
profile_image,
description,
qualification,
    consulting_fee,
    availability_status,
    status,
    created_at
)
VALUES
(
    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW()
)
";

$insertStmt = $conn->prepare($insertQuery);

$isInserted = $insertStmt->execute([

    $name,
    $email,
    $hashedPassword,
$phone,
$profile_image,
$description,
$qualification,
    $consulting_fee,
    $availability_status,
    1
]);

/*
|--------------------------------------------------------------------------
| RESPONSE
|--------------------------------------------------------------------------
*/

if($isInserted) {

    $doctorId = $conn->lastInsertId();

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

    if($specializationData) {

        $mappingQuery = "
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

        $mappingStmt = $conn->prepare($mappingQuery);

        $mappingStmt->execute([

            $doctorId,
            $specializationData['id']
        ]);
    }

    success("Doctor created successfully");

} else {

    error("Doctor creation failed");
}