let selectedReviewId = null;
async function loadReviews() {
  const table = document.getElementById('reviewsTableBody');
  const countBadge = document.getElementById('pendingReviewsCount');

  table.innerHTML = `
    <tr>
      <td colspan="7" class="text-center">
        Loading reviews...
      </td>
    </tr>
  `;

  try {
const response = await fetch(`${API_BASE}/reviews/admin_list.php`, {
  credentials: 'include'
});

    const result = await response.json();

    if (result.status === false) {
      table.innerHTML = `
        <tr>
          <td colspan="7" class="text-center text-danger">
            ${result.message || 'Unable to load reviews'}
          </td>
        </tr>
      `;
      return;
    }

    const reviews = result.data || [];

    const pendingReviews = reviews.filter((review) => {
      return Number(review.is_approved) === 0;
    });

    countBadge.innerText = `${pendingReviews.length} Pending`;

    const topPendingReviews = document.getElementById('topPendingReviews');
    if (topPendingReviews) {
      topPendingReviews.innerText = pendingReviews.length;
    }

    if (reviews.length === 0) {
      table.innerHTML = `
        <tr>
          <td colspan="7" class="text-center">
            No reviews found.
          </td>
        </tr>
      `;
      return;
    }

    table.innerHTML = '';

    reviews.forEach((review) => {
      const approved = Number(review.is_approved) === 1;

      const statusBadge = approved
        ? `<span class="badge badge-success">Approved</span>`
        : `<span class="badge badge-warning">Pending</span>`;

      table.innerHTML += `
        <tr>
          <td>
            <strong>${review.patient_name || 'Patient'}</strong><br>
            <small class="text-muted">${review.patient_email || ''}</small>
          </td>

          <td>${review.doctor_name || '-'}</td>

          <td>⭐ ${review.rating || 0}</td>

          <td>${review.review_title || '-'}</td>

          <td>${review.review_text || '-'}</td>

          <td>${statusBadge}</td>

<td>

  ${
    !approved
      ? `
        <button
          class="btn btn-success btn-sm mr-1"
          onclick="approveReview(${review.id})"
        >
          Approve
        </button>

        <button
          class="btn btn-danger btn-sm"
          onclick="deleteReview(${review.id}, false)"
        >
          Reject
        </button>
      `
      : `
        <button
          class="btn btn-danger btn-sm"
          onclick="deleteReview(${review.id}, true)"
        >
          Hide
        </button>
      `
  }

</td>
        </tr>
      `;
    });

  } catch (error) {
    console.log(error);

    table.innerHTML = `
      <tr>
        <td colspan="7" class="text-center text-danger">
          Failed to load reviews.
        </td>
      </tr>
    `;
  }
}

async function approveReview(id) {
  const formData = new FormData();
  formData.append('review_id', id);

  const response = await fetch(`${API_BASE}/reviews/approve.php`, {
    method: 'POST',
    body: formData,
    credentials: 'include'
  });

  const result = await response.json();

  showToast(result.message, result.status === true ? 'success' : 'error');

  if (result.status === true) {
    loadReviews();
  }
}

loadReviews();
function deleteReview(id, approved = false) {

  selectedReviewId = id;

  window.selectedReviewApproved = approved;

  const modalTitle =
    document.getElementById('hideReviewModalTitle');

  const modalText =
    document.getElementById('hideReviewModalText');

  const confirmBtn =
    document.getElementById('confirmHideReviewBtn');

  if(approved) {

    modalTitle.innerText = 'Hide Review';

    modalText.innerText =
      'Are you sure you want to hide this review?';

    confirmBtn.innerText = 'Hide Review';

  } else {

    modalTitle.innerText = 'Reject Review';

    modalText.innerText =
      'Are you sure you want to reject this review?';

    confirmBtn.innerText = 'Reject Review';
  }

  $('#hideReviewModal').modal('show');
}

async function loadHiddenReviews() {

  const table =
    document.getElementById('hiddenReviewsTableBody');

  const response = await fetch(
    `${API_BASE}/reviews/hidden_list.php`,
    {
      credentials: 'include'
    }
  );

  const result = await response.json();

  const reviews = result.data || [];

  table.innerHTML = '';

  if(reviews.length === 0) {

    table.innerHTML = `
      <tr>
        <td colspan="4">
          No hidden reviews
        </td>
      </tr>
    `;

    return;
  }

  reviews.forEach((review) => {

    table.innerHTML += `
      <tr>

        <td>${review.patient_name}</td>

        <td>${review.doctor_name}</td>

        <td>⭐ ${review.rating}</td>

        <td>
          <button
            class="btn btn-success btn-sm"
            onclick="restoreReview(${review.id})"
          >
            Restore
          </button>
        </td>

      </tr>
    `;
  });
}
async function restoreReview(id) {

  const formData = new FormData();

  formData.append('review_id', id);

  const response = await fetch(
    `${API_BASE}/reviews/restore.php`,
    {
      method: 'POST',
      body: formData,
      credentials: 'include'
    }
  );

  const result = await response.json();

  showToast(
    result.message,
    result.status === true
      ? 'success'
      : 'error'
  );

  if(result.status === true) {

    loadReviews();
    loadHiddenReviews();
  }
}
loadHiddenReviews();

document
  .getElementById('confirmHideReviewBtn')
  .addEventListener('click', async () => {

    if(!selectedReviewId) return;

    const formData = new FormData();
    formData.append('review_id', selectedReviewId);

    formData.append(
  'is_approved',
  window.selectedReviewApproved ? 1 : 0
);

    const response = await fetch(`${API_BASE}/reviews/delete.php`, {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });

    const result = await response.json();

    $('#hideReviewModal').modal('hide');

    showToast(result.message, result.status === true ? 'success' : 'error');

    if(result.status === true) {
      selectedReviewId = null;
      loadReviews();
      loadHiddenReviews();
    }
  });