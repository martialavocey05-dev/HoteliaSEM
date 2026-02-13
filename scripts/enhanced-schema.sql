-- ============================================================================
-- HOTELIASEM - SCHEMA AMELIORE (Phase 2 - Final Optimise)
-- ============================================================================
-- Ameliorations apportees:
--   1. FLOAT -> DECIMAL(18,2) pour tous les montants financiers (XAF)
--   2. FLOAT -> DECIMAL(10,7)/(11,7) pour lat/lng (precision geodesique)
--   3. FLOAT -> DECIMAL(3,2) pour ratings avec CHECK BETWEEN 0 AND 5
--   4. FLOAT -> DECIMAL(5,4) pour commission_rate avec CHECK BETWEEN 0 AND 1
--   5. Colonnes calculees (num_nights) pour eviter les calculs redondants
--   6. Nouvelles tables: reviews, cancellations, audit_log
--   7. Index filtres pour les requetes les plus frequentes
--   8. Index composites pour la verification de disponibilite
--   9. Contraintes metier renforcees (coherence financiere, plages valides)
--  10. Colonnes supplementaires utiles (last_login, booking_ref, currency, etc.)
-- ============================================================================
USE HoteliaSEM;
GO

-- ============================================================================
-- 1. TABLE USERS (Amelioree)
-- ============================================================================
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='users' AND xtype='U')
BEGIN
    CREATE TABLE users (
        id              INT IDENTITY(1,1) PRIMARY KEY,
        email           NVARCHAR(120) NOT NULL UNIQUE,
        password_hash   NVARCHAR(255) NOT NULL,
        full_name       NVARCHAR(120) NOT NULL,
        phone           NVARCHAR(20),
        avatar_url      NVARCHAR(500),
        user_type       NVARCHAR(20) NOT NULL DEFAULT 'client',
        is_active       BIT NOT NULL DEFAULT 1,
        last_login_at   DATETIME,                          -- NOUVEAU: suivi derniere connexion
        created_at      DATETIME NOT NULL DEFAULT GETUTCDATE(),
        updated_at      DATETIME NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT CK_user_type CHECK (user_type IN ('client','hotelier','admin'))
    );
    CREATE INDEX IX_users_email     ON users(email);
    CREATE INDEX IX_users_user_type ON users(user_type);
    CREATE INDEX IX_users_active    ON users(is_active) WHERE is_active = 1;
    PRINT 'Table users creee avec ameliorations';
END
GO

-- ============================================================================
-- 2. TABLE HOTELS (Types DECIMAL corriges)
-- ============================================================================
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='hotels' AND xtype='U')
BEGIN
    CREATE TABLE hotels (
        id                   INT IDENTITY(1,1) PRIMARY KEY,
        name                 NVARCHAR(200) NOT NULL,
        description          NVARCHAR(MAX),
        address              NVARCHAR(300) NOT NULL,
        city                 NVARCHAR(100) NOT NULL,
        country              NVARCHAR(100) NOT NULL DEFAULT 'Cameroun',
        latitude             DECIMAL(10,7),                -- CORRIGE: precision geodesique 7 decimales
        longitude            DECIMAL(11,7),                -- CORRIGE: precision geodesique
        phone                NVARCHAR(20),
        email                NVARCHAR(120),
        website              NVARCHAR(200),
        rating               DECIMAL(3,2) NOT NULL DEFAULT 0,   -- CORRIGE: DECIMAL au lieu de FLOAT
        total_reviews        INT NOT NULL DEFAULT 0,            -- NOUVEAU: compteur de-normalise
        owner_id             INT NOT NULL,
        subscription_type    NVARCHAR(20) NOT NULL DEFAULT 'standard',
        status               NVARCHAR(20) NOT NULL DEFAULT 'pending',
        is_manually_geocoded BIT NOT NULL DEFAULT 0,
        geocoding_notes      NVARCHAR(500),
        commission_rate      DECIMAL(5,4) NOT NULL DEFAULT 0.1500,  -- CORRIGE: DECIMAL normalise
        created_at           DATETIME NOT NULL DEFAULT GETUTCDATE(),
        updated_at           DATETIME NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT FK_hotels_owner FOREIGN KEY (owner_id) REFERENCES users(id),
        CONSTRAINT CK_hotel_sub   CHECK (subscription_type IN ('standard','premium')),
        CONSTRAINT CK_hotel_stat  CHECK (status IN ('pending','approved','rejected')),
        CONSTRAINT CK_hotel_rate  CHECK (rating BETWEEN 0 AND 5),         -- NOUVEAU
        CONSTRAINT CK_hotel_comm  CHECK (commission_rate BETWEEN 0 AND 1) -- NOUVEAU
    );
    CREATE INDEX IX_hotels_owner  ON hotels(owner_id);
    CREATE INDEX IX_hotels_city   ON hotels(city);
    CREATE INDEX IX_hotels_status ON hotels(status);
    CREATE INDEX IX_hotels_rating ON hotels(rating DESC);                  -- NOUVEAU: tri par note
    CREATE INDEX IX_hotels_geo    ON hotels(latitude, longitude)           -- NOUVEAU: recherche geo
        WHERE latitude IS NOT NULL AND longitude IS NOT NULL;
    PRINT 'Table hotels creee avec types DECIMAL et index geo';
END
GO

-- ============================================================================
-- 3. TABLE ROOMS (DECIMAL pour prix + colonnes utiles)
-- ============================================================================
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='rooms' AND xtype='U')
BEGIN
    CREATE TABLE rooms (
        id              INT IDENTITY(1,1) PRIMARY KEY,
        hotel_id        INT NOT NULL,
        room_number     NVARCHAR(20) NOT NULL,
        room_type       NVARCHAR(50) NOT NULL DEFAULT 'standard',   -- CORRIGE: NOT NULL
        price_per_night DECIMAL(18,2) NOT NULL,                     -- CORRIGE: DECIMAL
        currency        NVARCHAR(3) NOT NULL DEFAULT 'XAF',         -- NOUVEAU: devise
        max_guests      INT NOT NULL DEFAULT 2,
        is_available    BIT NOT NULL DEFAULT 1,
        floor_number    INT,                                         -- NOUVEAU
        area_sqm        DECIMAL(6,2),                                -- NOUVEAU: surface
        features        NVARCHAR(MAX),
        created_at      DATETIME NOT NULL DEFAULT GETUTCDATE(),
        updated_at      DATETIME NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT FK_rooms_hotel  FOREIGN KEY (hotel_id)
            REFERENCES hotels(id) ON DELETE CASCADE,
        CONSTRAINT CK_room_price   CHECK (price_per_night > 0),
        CONSTRAINT CK_room_guests  CHECK (max_guests BETWEEN 1 AND 20),  -- NOUVEAU
        CONSTRAINT UQ_room_hotel   UNIQUE (hotel_id, room_number)
    );
    CREATE INDEX IX_rooms_hotel ON rooms(hotel_id);
    CREATE INDEX IX_rooms_price ON rooms(price_per_night);
    CREATE INDEX IX_rooms_avail ON rooms(hotel_id, is_available)    -- NOUVEAU: chambres dispo
        WHERE is_available = 1;
    PRINT 'Table rooms creee avec DECIMAL et index filtres';
END
GO

-- ============================================================================
-- 4. TABLE BOOKINGS (DECIMAL + colonne calculee + index composite)
-- ============================================================================
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='bookings' AND xtype='U')
BEGIN
    CREATE TABLE bookings (
        id                INT IDENTITY(1,1) PRIMARY KEY,
        booking_ref       NVARCHAR(20) NOT NULL UNIQUE,             -- NOUVEAU: reference lisible
        user_id           INT NOT NULL,
        hotel_id          INT NOT NULL,
        room_id           INT NOT NULL,
        check_in_date     DATE NOT NULL,                            -- CORRIGE: DATE au lieu de DATETIME
        check_out_date    DATE NOT NULL,                            -- CORRIGE: DATE
        num_nights        AS DATEDIFF(DAY, check_in_date, check_out_date) PERSISTED,  -- NOUVEAU: calcule
        num_adults        INT NOT NULL DEFAULT 1,
        num_children      INT NOT NULL DEFAULT 0,
        total_price       DECIMAL(18,2) NOT NULL,                   -- CORRIGE: DECIMAL
        status            NVARCHAR(20) NOT NULL DEFAULT 'confirmed',
        special_requests  NVARCHAR(MAX),
        created_at        DATETIME NOT NULL DEFAULT GETUTCDATE(),
        updated_at        DATETIME NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT FK_bookings_user  FOREIGN KEY (user_id)  REFERENCES users(id),
        CONSTRAINT FK_bookings_hotel FOREIGN KEY (hotel_id) REFERENCES hotels(id),
        CONSTRAINT FK_bookings_room  FOREIGN KEY (room_id)  REFERENCES rooms(id),
        CONSTRAINT CK_booking_dates  CHECK (check_out_date > check_in_date),
        CONSTRAINT CK_booking_stat   CHECK (status IN ('confirmed','cancelled','completed','no-show')),
        CONSTRAINT CK_booking_guests CHECK (num_adults >= 1)         -- NOUVEAU
    );
    CREATE INDEX IX_bookings_user  ON bookings(user_id);
    CREATE INDEX IX_bookings_hotel ON bookings(hotel_id);
    CREATE INDEX IX_bookings_room  ON bookings(room_id);
    CREATE INDEX IX_bookings_dates ON bookings(check_in_date, check_out_date);
    -- NOUVEAU: Index composite pour verification rapide de disponibilite
    CREATE INDEX IX_bookings_avail ON bookings(room_id, check_in_date, check_out_date)
        WHERE status IN ('confirmed','completed');
    PRINT 'Table bookings creee avec colonne calculee et index disponibilite';
END
GO

-- ============================================================================
-- 5. TABLE TRANSACTIONS (DECIMAL + coherence financiere)
-- ============================================================================
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='transactions' AND xtype='U')
BEGIN
    CREATE TABLE transactions (
        id                    INT IDENTITY(1,1) PRIMARY KEY,
        transaction_ref       NVARCHAR(30) NOT NULL UNIQUE,          -- NOUVEAU
        booking_id            INT NOT NULL UNIQUE,                    -- CORRIGE: NOT NULL
        user_id               INT NOT NULL,
        hotel_id              INT NOT NULL,
        amount                DECIMAL(18,2) NOT NULL,                 -- CORRIGE: DECIMAL
        commission_amount     DECIMAL(18,2) NOT NULL,                 -- CORRIGE: DECIMAL
        net_amount            DECIMAL(18,2) NOT NULL,                 -- CORRIGE: DECIMAL
        currency              NVARCHAR(3) NOT NULL DEFAULT 'XAF',     -- NOUVEAU
        payment_method        NVARCHAR(50) NOT NULL DEFAULT 'stripe', -- CORRIGE: NOT NULL
        stripe_payment_intent NVARCHAR(200),                          -- RENOMME: plus explicite
        stripe_charge_id      NVARCHAR(200),                          -- NOUVEAU: pour remboursements
        status                NVARCHAR(20) NOT NULL DEFAULT 'pending',
        paid_at               DATETIME,                               -- NOUVEAU: horodatage paiement
        created_at            DATETIME NOT NULL DEFAULT GETUTCDATE(),
        updated_at            DATETIME NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT FK_trans_booking FOREIGN KEY (booking_id) REFERENCES bookings(id),
        CONSTRAINT FK_trans_user    FOREIGN KEY (user_id)    REFERENCES users(id),
        CONSTRAINT FK_trans_hotel   FOREIGN KEY (hotel_id)   REFERENCES hotels(id),
        CONSTRAINT CK_trans_stat    CHECK (status IN ('pending','completed','failed','refunded')),
        -- NOUVEAU: garantir la coherence financiere au niveau DB
        CONSTRAINT CK_trans_amounts CHECK (net_amount = amount - commission_amount),
        CONSTRAINT CK_trans_pos     CHECK (amount > 0 AND commission_amount >= 0)
    );
    CREATE INDEX IX_trans_booking ON transactions(booking_id);
    CREATE INDEX IX_trans_user    ON transactions(user_id);
    CREATE INDEX IX_trans_hotel   ON transactions(hotel_id);
    CREATE INDEX IX_trans_status  ON transactions(status);           -- NOUVEAU
    PRINT 'Table transactions creee avec contraintes financieres';
END
GO

-- ============================================================================
-- 6. TABLE MEDIA (Amelioree: support 3D, accessibilite, tri)
-- ============================================================================
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='media' AND xtype='U')
BEGIN
    CREATE TABLE media (
        id          INT IDENTITY(1,1) PRIMARY KEY,
        hotel_id    INT NOT NULL,
        room_id     INT,                                        -- NOUVEAU: media par chambre
        file_path   NVARCHAR(500) NOT NULL,
        file_type   NVARCHAR(20) NOT NULL DEFAULT 'image',
        file_size   INT,                                        -- NOUVEAU: taille en octets
        alt_text    NVARCHAR(200),                              -- NOUVEAU: accessibilite
        sort_order  INT NOT NULL DEFAULT 0,                     -- NOUVEAU: ordre d'affichage
        is_primary  BIT NOT NULL DEFAULT 0,
        uploaded_at DATETIME NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT FK_media_hotel FOREIGN KEY (hotel_id)
            REFERENCES hotels(id) ON DELETE CASCADE,
        CONSTRAINT FK_media_room  FOREIGN KEY (room_id)
            REFERENCES rooms(id),
        CONSTRAINT CK_media_type  CHECK (file_type IN ('image','video','3d_model'))  -- CORRIGE: ajout 3d_model pour .glb
    );
    CREATE INDEX IX_media_hotel ON media(hotel_id);
    CREATE INDEX IX_media_room  ON media(room_id) WHERE room_id IS NOT NULL;
    PRINT 'Table media creee avec support 3D et accessibilite';
END
GO

-- ============================================================================
-- 7. TABLE NOTIFICATIONS (Amelioree: canal, suivi lecture)
-- ============================================================================
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='notifications' AND xtype='U')
BEGIN
    CREATE TABLE notifications (
        id          INT IDENTITY(1,1) PRIMARY KEY,
        user_id     INT NOT NULL,
        type        NVARCHAR(50) NOT NULL,
        channel     NVARCHAR(20) NOT NULL DEFAULT 'in_app',    -- NOUVEAU: sms, email, in_app
        title       NVARCHAR(200) NOT NULL,
        message     NVARCHAR(MAX),
        is_read     BIT NOT NULL DEFAULT 0,
        read_at     DATETIME,                                   -- NOUVEAU: horodatage lecture
        created_at  DATETIME NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT FK_notif_user FOREIGN KEY (user_id)
            REFERENCES users(id) ON DELETE CASCADE,
        CONSTRAINT CK_notif_type CHECK (type IN (
            'booking','payment','cancellation','reminder','system','review'
        )),
        CONSTRAINT CK_notif_chan CHECK (channel IN ('sms','email','in_app'))
    );
    CREATE INDEX IX_notif_user   ON notifications(user_id);
    CREATE INDEX IX_notif_unread ON notifications(user_id, is_read)
        WHERE is_read = 0;
    PRINT 'Table notifications creee avec canal tri-canal';
END
GO

-- ============================================================================
-- 8. TABLE SUBSCRIPTIONS (Amelioree: Stripe integration)
-- ============================================================================
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='subscriptions' AND xtype='U')
BEGIN
    CREATE TABLE subscriptions (
        id                INT IDENTITY(1,1) PRIMARY KEY,
        hotel_id          INT NOT NULL UNIQUE,
        subscription_type NVARCHAR(20) NOT NULL,
        status            NVARCHAR(20) NOT NULL DEFAULT 'active',
        start_date        DATETIME NOT NULL DEFAULT GETUTCDATE(),
        end_date          DATETIME,
        renewal_date      DATETIME,
        stripe_sub_id     NVARCHAR(200),                        -- NOUVEAU: ID Stripe
        created_at        DATETIME NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT FK_sub_hotel  FOREIGN KEY (hotel_id)
            REFERENCES hotels(id) ON DELETE CASCADE,
        CONSTRAINT CK_sub_type   CHECK (subscription_type IN ('standard','premium')),
        CONSTRAINT CK_sub_stat   CHECK (status IN ('active','inactive','cancelled','expired')),
        CONSTRAINT CK_sub_dates  CHECK (end_date IS NULL OR end_date >= start_date)
    );
    CREATE INDEX IX_sub_hotel  ON subscriptions(hotel_id);
    CREATE INDEX IX_sub_active ON subscriptions(status) WHERE status = 'active';
    PRINT 'Table subscriptions creee avec integration Stripe';
END
GO

-- ============================================================================
-- 9. NOUVELLE TABLE: REVIEWS (Avis clients verifies)
-- ============================================================================
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='reviews' AND xtype='U')
BEGIN
    CREATE TABLE reviews (
        id          INT IDENTITY(1,1) PRIMARY KEY,
        user_id     INT NOT NULL,
        hotel_id    INT NOT NULL,
        booking_id  INT NOT NULL,
        rating      DECIMAL(3,2) NOT NULL,
        title       NVARCHAR(200),
        comment     NVARCHAR(MAX),
        is_verified BIT NOT NULL DEFAULT 0,
        created_at  DATETIME NOT NULL DEFAULT GETUTCDATE(),
        updated_at  DATETIME NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT FK_rev_user    FOREIGN KEY (user_id)    REFERENCES users(id),
        CONSTRAINT FK_rev_hotel   FOREIGN KEY (hotel_id)   REFERENCES hotels(id),
        CONSTRAINT FK_rev_booking FOREIGN KEY (booking_id) REFERENCES bookings(id),
        CONSTRAINT CK_rev_rating  CHECK (rating BETWEEN 1 AND 5),
        CONSTRAINT UQ_rev_booking UNIQUE (user_id, booking_id)
    );
    CREATE INDEX IX_rev_hotel  ON reviews(hotel_id);
    CREATE INDEX IX_rev_user   ON reviews(user_id);
    CREATE INDEX IX_rev_rating ON reviews(hotel_id, rating DESC);
    PRINT 'Table reviews creee';
END
GO

-- ============================================================================
-- 10. NOUVELLE TABLE: CANCELLATIONS (Logique remboursement 24h)
-- ============================================================================
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='cancellations' AND xtype='U')
BEGIN
    CREATE TABLE cancellations (
        id               INT IDENTITY(1,1) PRIMARY KEY,
        booking_id       INT NOT NULL UNIQUE,
        cancelled_by     INT NOT NULL,
        reason           NVARCHAR(500),
        cancel_type      NVARCHAR(20) NOT NULL,
        refund_amount    DECIMAL(18,2) NOT NULL DEFAULT 0,
        commission_kept  DECIMAL(18,2) NOT NULL DEFAULT 0,
        refund_status    NVARCHAR(20) NOT NULL DEFAULT 'pending',
        stripe_refund_id NVARCHAR(200),
        cancelled_at     DATETIME NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT FK_cancel_booking FOREIGN KEY (booking_id) REFERENCES bookings(id),
        CONSTRAINT FK_cancel_user    FOREIGN KEY (cancelled_by) REFERENCES users(id),
        CONSTRAINT CK_cancel_type    CHECK (cancel_type IN ('full_refund','commission_retained')),
        CONSTRAINT CK_cancel_refund  CHECK (refund_status IN ('pending','processed','failed'))
    );
    CREATE INDEX IX_cancel_booking ON cancellations(booking_id);
    PRINT 'Table cancellations creee (logique 24h)';
END
GO

-- ============================================================================
-- 11. NOUVELLE TABLE: AUDIT_LOG (Tracabilite complete)
-- ============================================================================
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='audit_log' AND xtype='U')
BEGIN
    CREATE TABLE audit_log (
        id          BIGINT IDENTITY(1,1) PRIMARY KEY,
        user_id     INT,
        action      NVARCHAR(50) NOT NULL,
        entity_type NVARCHAR(50) NOT NULL,
        entity_id   INT,
        old_values  NVARCHAR(MAX),
        new_values  NVARCHAR(MAX),
        ip_address  NVARCHAR(45),
        user_agent  NVARCHAR(500),
        created_at  DATETIME NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT FK_audit_user FOREIGN KEY (user_id) REFERENCES users(id)
    );
    CREATE INDEX IX_audit_user   ON audit_log(user_id);
    CREATE INDEX IX_audit_entity ON audit_log(entity_type, entity_id);
    CREATE INDEX IX_audit_date   ON audit_log(created_at DESC);
    PRINT 'Table audit_log creee';
END
GO

-- ============================================================================
PRINT 'SCHEMA HOTELIASEM AMELIORE - 11 TABLES CREEES AVEC SUCCES';
PRINT 'Ameliorations: DECIMAL financier, 3 nouvelles tables, index composites';
PRINT 'et filtres, contraintes metier renforcees, support 3D et tri-canal.';
GO
