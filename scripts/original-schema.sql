-- ============================================================================
-- PARTIE 1: CRÉATION DES TABLES (SANS TRIGGER)
-- ============================================================================
USE HoteliaSEM;
GO

-- 1️⃣ TABLE USERS
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='users' AND xtype='U')
BEGIN
    CREATE TABLE users (
        id INT IDENTITY(1,1) PRIMARY KEY,
        email NVARCHAR(120) NOT NULL UNIQUE,
        password_hash NVARCHAR(255) NOT NULL,
        full_name NVARCHAR(120) NOT NULL,
        phone NVARCHAR(20),
        avatar_url NVARCHAR(500),
        user_type NVARCHAR(20) NOT NULL DEFAULT 'client',
        is_active BIT NOT NULL DEFAULT 1,
        created_at DATETIME NOT NULL DEFAULT GETUTCDATE(),
        updated_at DATETIME NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT CK_user_type CHECK (user_type IN ('client', 'hotelier', 'admin'))
    );
    CREATE INDEX IX_users_email ON users(email);
    CREATE INDEX IX_users_user_type ON users(user_type);
    PRINT '✅ Table users créée';
END
GO

-- 2️⃣ TABLE HOTELS
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='hotels' AND xtype='U')
BEGIN
    CREATE TABLE hotels (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(200) NOT NULL,
        description NVARCHAR(MAX),
        address NVARCHAR(300) NOT NULL,
        city NVARCHAR(100) NOT NULL,
        country NVARCHAR(100) NOT NULL,
        latitude FLOAT,
        longitude FLOAT,
        phone NVARCHAR(20),
        email NVARCHAR(120),
        website NVARCHAR(200),
        rating FLOAT NOT NULL DEFAULT 0,
        owner_id INT NOT NULL,
        subscription_type NVARCHAR(20) NOT NULL DEFAULT 'standard',
        status NVARCHAR(20) NOT NULL DEFAULT 'pending',
        is_manually_geocoded BIT NOT NULL DEFAULT 0,
        geocoding_notes NVARCHAR(500),
        commission_rate FLOAT NOT NULL DEFAULT 0.15,
        created_at DATETIME NOT NULL DEFAULT GETUTCDATE(),
        updated_at DATETIME NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT FK_hotels_owner FOREIGN KEY (owner_id) REFERENCES users(id),
        CONSTRAINT CK_hotel_subscription CHECK (subscription_type IN ('standard', 'premium')),
        CONSTRAINT CK_hotel_status CHECK (status IN ('pending', 'approved', 'rejected'))
    );
    CREATE INDEX IX_hotels_owner_id ON hotels(owner_id);
    CREATE INDEX IX_hotels_city ON hotels(city);
    CREATE INDEX IX_hotels_status ON hotels(status);
    PRINT '✅ Table hotels créée';
END
GO

-- 3️⃣ TABLE ROOMS
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='rooms' AND xtype='U')
BEGIN
    CREATE TABLE rooms (
        id INT IDENTITY(1,1) PRIMARY KEY,
        hotel_id INT NOT NULL,
        room_number NVARCHAR(20) NOT NULL,
        room_type NVARCHAR(50),
        price_per_night FLOAT NOT NULL,
        max_guests INT NOT NULL DEFAULT 2,
        is_available BIT NOT NULL DEFAULT 1,
        features NVARCHAR(MAX),
        created_at DATETIME NOT NULL DEFAULT GETUTCDATE(),
        updated_at DATETIME NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT FK_rooms_hotel FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE,
        CONSTRAINT CK_room_price CHECK (price_per_night > 0),
        CONSTRAINT UQ_room_hotel_number UNIQUE (hotel_id, room_number)
    );
    CREATE INDEX IX_rooms_hotel_id ON rooms(hotel_id);
    CREATE INDEX IX_rooms_price ON rooms(price_per_night);
    PRINT '✅ Table rooms créée';
END
GO

-- 4️⃣ TABLE BOOKINGS
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='bookings' AND xtype='U')
BEGIN
    CREATE TABLE bookings (
        id INT IDENTITY(1,1) PRIMARY KEY,
        user_id INT NOT NULL,
        hotel_id INT NOT NULL,
        room_id INT NOT NULL,
        check_in_date DATETIME NOT NULL,
        check_out_date DATETIME NOT NULL,
        num_adults INT NOT NULL DEFAULT 1,
        num_children INT NOT NULL DEFAULT 0,
        total_price FLOAT NOT NULL,
        status NVARCHAR(20) NOT NULL DEFAULT 'confirmed',
        special_requests NVARCHAR(MAX),
        created_at DATETIME NOT NULL DEFAULT GETUTCDATE(),
        updated_at DATETIME NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT FK_bookings_user FOREIGN KEY (user_id) REFERENCES users(id),
        CONSTRAINT FK_bookings_hotel FOREIGN KEY (hotel_id) REFERENCES hotels(id),
        CONSTRAINT FK_bookings_room FOREIGN KEY (room_id) REFERENCES rooms(id),
        CONSTRAINT CK_booking_dates CHECK (check_out_date > check_in_date),
        CONSTRAINT CK_booking_status CHECK (status IN ('confirmed', 'cancelled', 'completed', 'no-show'))
    );
    CREATE INDEX IX_bookings_user_id ON bookings(user_id);
    CREATE INDEX IX_bookings_hotel_id ON bookings(hotel_id);
    CREATE INDEX IX_bookings_room_id ON bookings(room_id);
    CREATE INDEX IX_bookings_dates ON bookings(check_in_date, check_out_date);
    PRINT '✅ Table bookings créée';
END
GO

-- 5️⃣ TABLE TRANSACTIONS
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='transactions' AND xtype='U')
BEGIN
    CREATE TABLE transactions (
        id INT IDENTITY(1,1) PRIMARY KEY,
        booking_id INT UNIQUE,
        user_id INT NOT NULL,
        hotel_id INT NOT NULL,
        amount FLOAT NOT NULL,
        commission_amount FLOAT NOT NULL,
        net_amount FLOAT NOT NULL,
        payment_method NVARCHAR(50),
        stripe_transaction_id NVARCHAR(200),
        status NVARCHAR(20) NOT NULL DEFAULT 'pending',
        created_at DATETIME NOT NULL DEFAULT GETUTCDATE(),
        updated_at DATETIME NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT FK_transactions_booking FOREIGN KEY (booking_id) REFERENCES bookings(id),
        CONSTRAINT FK_transactions_user FOREIGN KEY (user_id) REFERENCES users(id),
        CONSTRAINT FK_transactions_hotel FOREIGN KEY (hotel_id) REFERENCES hotels(id),
        CONSTRAINT CK_transaction_status CHECK (status IN ('pending', 'completed', 'failed', 'refunded'))
    );
    CREATE INDEX IX_transactions_booking_id ON transactions(booking_id);
    CREATE INDEX IX_transactions_user_id ON transactions(user_id);
    CREATE INDEX IX_transactions_hotel_id ON transactions(hotel_id);
    PRINT '✅ Table transactions créée';
END
GO

-- 6️⃣ TABLE MEDIA (SANS TRIGGER POUR L'INSTANT)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='media' AND xtype='U')
BEGIN
    CREATE TABLE media (
        id INT IDENTITY(1,1) PRIMARY KEY,
        hotel_id INT NOT NULL,
        file_path NVARCHAR(500) NOT NULL,
        file_type NVARCHAR(20) NOT NULL DEFAULT 'image',
        is_primary BIT NOT NULL DEFAULT 0,
        uploaded_at DATETIME NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT FK_media_hotel FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE,
        CONSTRAINT CK_media_type CHECK (file_type IN ('image', 'video'))
    );
    CREATE INDEX IX_media_hotel_id ON media(hotel_id);
    PRINT '✅ Table media créée';
END
GO

-- 7️⃣ TABLE NOTIFICATIONS
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='notifications' AND xtype='U')
BEGIN
    CREATE TABLE notifications (
        id INT IDENTITY(1,1) PRIMARY KEY,
        user_id INT NOT NULL,
        type NVARCHAR(50) NOT NULL,
        title NVARCHAR(200) NOT NULL,
        message NVARCHAR(MAX),
        is_read BIT NOT NULL DEFAULT 0,
        created_at DATETIME NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT FK_notifications_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        CONSTRAINT CK_notification_type CHECK (type IN ('booking', 'payment', 'cancellation', 'reminder', 'system'))
    );
    CREATE INDEX IX_notifications_user_id ON notifications(user_id);
    PRINT '✅ Table notifications créée';
END
GO

-- 8️⃣ TABLE SUBSCRIPTIONS
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='subscriptions' AND xtype='U')
BEGIN
    CREATE TABLE subscriptions (
        id INT IDENTITY(1,1) PRIMARY KEY,
        hotel_id INT NOT NULL UNIQUE,
        subscription_type NVARCHAR(20) NOT NULL,
        status NVARCHAR(20) NOT NULL DEFAULT 'active',
        start_date DATETIME NOT NULL DEFAULT GETUTCDATE(),
        end_date DATETIME,
        renewal_date DATETIME,
        created_at DATETIME NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT FK_subscriptions_hotel FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE,
        CONSTRAINT CK_subscription_type CHECK (subscription_type IN ('standard', 'premium')),
        CONSTRAINT CK_subscription_status CHECK (status IN ('active', 'inactive', 'cancelled', 'expired'))
    );
    CREATE INDEX IX_subscriptions_hotel_id ON subscriptions(hotel_id);
    PRINT '✅ Table subscriptions créée';
END
GO

PRINT '🎯 PARTIE 1 TERMINÉE - Toutes les tables sont créées!';
GO