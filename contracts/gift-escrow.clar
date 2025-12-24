;; Gift Escrow Contract for Stacks Holiday Gifts
;; Allows users to create STX gifts that can be claimed via secret link

;; Constants
(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_UNAUTHORIZED (err u100))
(define-constant ERR_GIFT_NOT_FOUND (err u101))
(define-constant ERR_ALREADY_CLAIMED (err u102))
(define-constant ERR_INVALID_SECRET (err u103))
(define-constant ERR_NOT_EXPIRED (err u104))
(define-constant ERR_ALREADY_REFUNDED (err u105))
(define-constant ERR_ZERO_AMOUNT (err u106))
(define-constant ERR_INSUFFICIENT_BALANCE (err u107))

;; Gift expiry: ~14 days in blocks (assuming ~10 min per block)
(define-constant EXPIRY_BLOCKS u2016)

;; Service fee: 0.5% (50 basis points)
(define-constant FEE_BPS u50)
(define-constant BPS_DENOMINATOR u10000)

;; Treasury address for fees
(define-data-var treasury principal CONTRACT_OWNER)

;; Gift counter
(define-data-var gift-counter uint u0)

;; Gift data structure
(define-map gifts
    uint
    {
        sender: principal,
        amount: uint,
        message: (string-utf8 280),
        secret-hash: (buff 32),
        created-at: uint,
        claimed: bool,
        refunded: bool,
        recipient: (optional principal),
    }
)

;; Map to track gifts by sender
(define-map gifts-by-sender
    principal
    (list 50 uint)
)

;; ============================================
;; Public Functions
;; ============================================

;; Create a new gift
;; Returns the gift ID
(define-public (create-gift
        (amount uint)
        (message (string-utf8 280))
        (secret-hash (buff 32))
    )
    (let (
            (gift-id (var-get gift-counter))
            (fee (/ (* amount FEE_BPS) BPS_DENOMINATOR))
            (gift-amount (- amount fee))
            (sender-gifts (default-to (list) (map-get? gifts-by-sender tx-sender)))
        )
        ;; Validations
        (asserts! (> amount u0) ERR_ZERO_AMOUNT)

        ;; Transfer gift amount to contract (sender pays)
        (try! (stx-transfer? gift-amount tx-sender (as-contract tx-sender)))

        ;; Transfer fee directly to treasury
        (if (> fee u0)
            (try! (stx-transfer? fee tx-sender (var-get treasury)))
            true
        )

        ;; Store gift
        (map-set gifts gift-id {
            sender: tx-sender,
            amount: gift-amount,
            message: message,
            secret-hash: secret-hash,
            created-at: block-height,
            claimed: false,
            refunded: false,
            recipient: none,
        })

        ;; Track sender's gifts
        (map-set gifts-by-sender tx-sender
            (unwrap-panic (as-max-len? (append sender-gifts gift-id) u50))
        )

        ;; Increment counter
        (var-set gift-counter (+ gift-id u1))

        ;; Return gift ID
        (ok gift-id)
    )
)

;; Claim a gift using the secret
(define-public (claim-gift
        (gift-id uint)
        (secret (buff 32))
    )
    (let (
            (gift (unwrap! (map-get? gifts gift-id) ERR_GIFT_NOT_FOUND))
            (computed-hash (sha256 secret))
            (claimer tx-sender)
        )
        ;; Validations
        (asserts! (not (get claimed gift)) ERR_ALREADY_CLAIMED)
        (asserts! (not (get refunded gift)) ERR_ALREADY_REFUNDED)
        (asserts! (is-eq computed-hash (get secret-hash gift)) ERR_INVALID_SECRET)

        ;; Transfer STX to claimer (from contract)
        (try! (as-contract (stx-transfer? (get amount gift) tx-sender claimer)))

        ;; Update gift status
        (map-set gifts gift-id
            (merge gift {
                claimed: true,
                recipient: (some claimer),
            })
        )

        (ok true)
    )
)

;; Refund an expired gift to sender
(define-public (refund-gift (gift-id uint))
    (let (
            (gift (unwrap! (map-get? gifts gift-id) ERR_GIFT_NOT_FOUND))
            (expiry-height (+ (get created-at gift) EXPIRY_BLOCKS))
        )
        ;; Validations
        (asserts! (is-eq tx-sender (get sender gift)) ERR_UNAUTHORIZED)
        (asserts! (not (get claimed gift)) ERR_ALREADY_CLAIMED)
        (asserts! (not (get refunded gift)) ERR_ALREADY_REFUNDED)
        (asserts! (>= block-height expiry-height) ERR_NOT_EXPIRED)

        ;; Transfer STX back to sender
        (try! (as-contract (stx-transfer? (get amount gift) tx-sender (get sender gift))))

        ;; Update gift status
        (map-set gifts gift-id (merge gift { refunded: true }))

        (ok true)
    )
)

;; ============================================
;; Read-Only Functions
;; ============================================

;; Get gift details
(define-read-only (get-gift (gift-id uint))
    (map-get? gifts gift-id)
)

;; Get gift count
(define-read-only (get-gift-count)
    (var-get gift-counter)
)

;; Get gifts by sender
(define-read-only (get-sender-gifts (sender principal))
    (default-to (list) (map-get? gifts-by-sender sender))
)

;; Check if gift is claimable
(define-read-only (is-claimable (gift-id uint))
    (match (map-get? gifts gift-id)
        gift (and (not (get claimed gift)) (not (get refunded gift)))
        false
    )
)

;; Check if gift is expired
(define-read-only (is-expired (gift-id uint))
    (match (map-get? gifts gift-id)
        gift (>= block-height (+ (get created-at gift) EXPIRY_BLOCKS))
        false
    )
)

;; Get expiry block for a gift
(define-read-only (get-expiry-block (gift-id uint))
    (match (map-get? gifts gift-id)
        gift (some (+ (get created-at gift) EXPIRY_BLOCKS))
        none
    )
)

;; Get treasury address
(define-read-only (get-treasury)
    (var-get treasury)
)

;; Get fee info
(define-read-only (get-fee-info)
    {
        fee-bps: FEE_BPS,
        denominator: BPS_DENOMINATOR,
    }
)

;; ============================================
;; Admin Functions
;; ============================================

;; Update treasury address
(define-public (set-treasury (new-treasury principal))
    (begin
        (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_UNAUTHORIZED)
        (var-set treasury new-treasury)
        (ok true)
    )
)
