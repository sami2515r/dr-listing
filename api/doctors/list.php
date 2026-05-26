<?php

require_once "../../includes/cors.php";
require_once "../../includes/response.php";
require_once "../../config/db.php";

$query = "
SELECT
    d.id,
    d.name,
    d.email,
    d.phone,
    d.profile_image,
    d.description,
    d.qualification,
    d.consulting_fee,
    d.availability_status,

    COALESCE(
        GROUP_CONCAT(DISTINCT sm.name ORDER BY sm.name SEPARATOR ', '),
        'General Physician'
    ) AS specialization_name,

    COALESCE(
        GROUP_CONCAT(DISTINCT sm.name ORDER BY sm.name SEPARATOR ' '),
        'General Physician'
    ) AS specialization_search,

    GROUP_CONCAT(DISTINCT h.name ORDER BY h.name SEPARATOR ', ') AS hospital_names,
    GROUP_CONCAT(DISTINCT ha.city ORDER BY ha.city SEPARATOR ', ') AS city,
    GROUP_CONCAT(DISTINCT ha.state ORDER BY ha.state SEPARATOR ', ') AS state,
    GROUP_CONCAT(DISTINCT ha.country ORDER BY ha.country SEPARATOR ', ') AS country,
    GROUP_CONCAT(DISTINCT ha.pincode ORDER BY ha.pincode SEPARATOR ', ') AS pincode,

    TRIM(CONCAT_WS(' ',
        GROUP_CONCAT(DISTINCT h.name SEPARATOR ' '),
        GROUP_CONCAT(DISTINCT ha.addresses_line1 SEPARATOR ' '),
        GROUP_CONCAT(DISTINCT ha.addresses_line2 SEPARATOR ' '),
        GROUP_CONCAT(DISTINCT ha.city SEPARATOR ' '),
        GROUP_CONCAT(DISTINCT ha.state SEPARATOR ' '),
        GROUP_CONCAT(DISTINCT ha.country SEPARATOR ' '),
        GROUP_CONCAT(DISTINCT ha.pincode SEPARATOR ' ')
    )) AS location_search,

    COALESCE(rs.average_rating, 0) AS average_rating,
    COALESCE(rs.total_reviews, 0) AS total_reviews

FROM doctors d

LEFT JOIN doctor_specializations ds
    ON ds.doctor_id = d.id
    AND ds.status = 1

LEFT JOIN specialization_masters sm
    ON sm.id = ds.specialization_id
    AND sm.status = 1

LEFT JOIN hospital_doctors hd
    ON hd.doctor_id = d.id
    AND hd.status = 1

LEFT JOIN hospitals h
    ON h.id = hd.hospital_id
    AND h.status = 1

LEFT JOIN hospital_addresses ha
    ON ha.hospital_id = h.id
    AND ha.status = 1

LEFT JOIN (
    SELECT doctor_id, AVG(rating) AS average_rating, COUNT(id) AS total_reviews
    FROM reviews
    WHERE is_approved = 1 AND status = 1
    GROUP BY doctor_id
) rs ON rs.doctor_id = d.id

WHERE d.status = 1

GROUP BY d.id

ORDER BY average_rating DESC, total_reviews DESC, d.id DESC
";

$stmt = $conn->prepare($query);
$stmt->execute();

$doctors = $stmt->fetchAll(PDO::FETCH_ASSOC);

foreach ($doctors as &$doctor) {
    $doctor['profile_image_url'] = !empty($doctor['profile_image'])
        ? "http://localhost/dr_listing/uploads/doctors/" . $doctor['profile_image']
        : null;
}

success("Doctors fetched successfully", $doctors);