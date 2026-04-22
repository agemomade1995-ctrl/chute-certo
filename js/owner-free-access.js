(function () {
    const OWNER_FREE_IDENTIFIERS = new Set([
        'agemomade1995@gmail.com',
        'agemomade@gmail.com',
        '258863993367',
        '258843993367'
    ]);

    function normalizeIdentifier(value) {
        if (!value) return '';
        return String(value)
            .trim()
            .toLowerCase()
            .replace(/[\s+\-()]/g, '');
    }

    function isOwnerFreeIdentifier(value) {
        const normalized = normalizeIdentifier(value);
        if (!normalized) return false;
        return OWNER_FREE_IDENTIFIERS.has(normalized);
    }

    function getIdentifierFromContext() {
        const params = new URLSearchParams(window.location.search);
        const queryCandidates = [
            params.get('owner_id'),
            params.get('identifier'),
            params.get('email'),
            params.get('phone')
        ];

        for (const candidate of queryCandidates) {
            if (isOwnerFreeIdentifier(candidate)) {
                return normalizeIdentifier(candidate);
            }
        }

        const storageCandidates = [
            localStorage.getItem('userEmail'),
            localStorage.getItem('userPhone'),
            localStorage.getItem('auth_email'),
            localStorage.getItem('auth_phone'),
            sessionStorage.getItem('userEmail'),
            sessionStorage.getItem('userPhone')
        ];

        for (const candidate of storageCandidates) {
            if (isOwnerFreeIdentifier(candidate)) {
                return normalizeIdentifier(candidate);
            }
        }

        return '';
    }

    function applyOwnerFreeAccess(ownerId) {
        const registerLinks = document.querySelectorAll('a[href="/register"]');
        registerLinks.forEach((link) => {
            link.href = `/register?owner_free=1&owner_id=${encodeURIComponent(ownerId)}`;
            if (link.textContent && link.textContent.toLowerCase().includes('assinar')) {
                link.textContent = 'Acesso Gratuito (Proprietário)';
            }
        });

        const paymentInfo = document.querySelector('.text-mpesa');
        if (paymentInfo) {
            const note = document.createElement('div');
            note.className = 'small text-success fw-bold mt-2';
            note.textContent = 'Acesso proprietário gratuito ativo para conta autorizada.';
            paymentInfo.parentNode.appendChild(note);
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        const ownerId = getIdentifierFromContext();
        if (!ownerId) return;

        applyOwnerFreeAccess(ownerId);
    });
})();
