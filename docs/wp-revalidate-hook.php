<?php
/**
 * Plugin Name: SMK CBM — Front-end Revalidate
 * Description: Memberi tahu front-end Next.js setiap kali post berubah, supaya
 *              perubahan tampil dalam hitungan detik, bukan menunggu 5 menit.
 * Version:     1.0.0
 *
 * PEMASANGAN
 * ----------
 * 1. Ubah dua konstanta di bawah.
 * 2. Upload file ini ke  wp-content/mu-plugins/smkcbm-revalidate.php
 *    (buat foldernya kalau belum ada). "mu" = must-use: aktif otomatis,
 *    tidak bisa dinonaktifkan tak sengaja, dan tidak hilang saat tema diganti.
 *
 * Kalau ping gagal, tidak ada yang rusak — front-end tetap menyegarkan diri
 * lewat timer 5 menit. Kegagalan dicatat di error log PHP.
 */

if (!defined('ABSPATH')) {
    exit;
}

/** Root front-end Next.js, tanpa slash di akhir. */
const SMKCBM_FRONTEND_URL = 'https://smkcbm.sch.id';

/** Harus sama persis dengan REVALIDATE_SECRET di environment front-end. */
const SMKCBM_REVALIDATE_SECRET = 'ganti-dengan-nilai-REVALIDATE_SECRET';

/**
 * Kirim ping ke front-end.
 */
function smkcbm_ping_revalidate($post, $status)
{
    $response = wp_remote_post(SMKCBM_FRONTEND_URL . '/api/revalidate', [
        // 5 detik sudah lebih dari cukup; endpoint-nya hanya menandai cache
        // basi, tidak me-render apa pun. Dibuat blocking supaya kegagalan
        // benar-benar tercatat di log, bukan hilang diam-diam.
        'timeout' => 5,
        'headers' => [
            'Content-Type'       => 'application/json',
            'X-Revalidate-Secret' => SMKCBM_REVALIDATE_SECRET,
        ],
        'body' => wp_json_encode([
            'slug'   => $post->post_name,
            'status' => $status,
            'id'     => $post->ID,
        ]),
    ]);

    if (is_wp_error($response)) {
        error_log('[smkcbm-revalidate] gagal: ' . $response->get_error_message());
        return;
    }

    $code = wp_remote_retrieve_response_code($response);
    if ($code !== 200) {
        // 401 = secret tidak cocok. 503 = REVALIDATE_SECRET belum diset di
        // front-end. 404 = build front-end belum memuat route /api/revalidate.
        error_log('[smkcbm-revalidate] front-end membalas HTTP ' . $code);
    }
}

/**
 * transition_post_status berjalan pada setiap penyimpanan post, termasuk saat
 * status tidak berubah (publish -> publish, yaitu pengeditan biasa).
 *
 * Syarat "$old atau $new adalah publish" mencakup semua hal yang terlihat
 * pengunjung — terbit, disunting, ditarik jadi draft, dibuang ke sampah —
 * sekaligus mengabaikan kerja internal seperti draft -> draft dan auto-draft.
 */
add_action('transition_post_status', function ($new_status, $old_status, $post) {
    if ($post->post_type !== 'post') {
        return;
    }
    if (wp_is_post_revision($post->ID) || wp_is_post_autosave($post->ID)) {
        return;
    }
    if ($new_status !== 'publish' && $old_status !== 'publish') {
        return;
    }

    smkcbm_ping_revalidate($post, $new_status);
}, 10, 3);

/**
 * Menghapus permanen post yang sudah di-trash tidak memicu transisi status,
 * jadi ditangani terpisah.
 */
add_action('before_delete_post', function ($post_id, $post) {
    if (!$post || $post->post_type !== 'post') {
        return;
    }
    smkcbm_ping_revalidate($post, 'deleted');
}, 10, 2);
