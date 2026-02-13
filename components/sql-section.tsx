"use client"

import { useState } from "react"
import {
  Database,
  Table2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Copy,
  Check,
} from "lucide-react"

const improvements = [
  {
    category: "Types de Donnees",
    icon: Database,
    items: [
      {
        original: "FLOAT pour price_per_night, total_price, amount",
        improved: "DECIMAL(18,2) pour precision monetaire XAF",
        reason: "FLOAT cause des erreurs d'arrondi inacceptables en finance.",
      },
      {
        original: "FLOAT pour rating",
        improved: "DECIMAL(3,2) avec CHECK (rating BETWEEN 0 AND 5)",
        reason: "Garantit une plage valide et une precision de notation.",
      },
      {
        original: "FLOAT pour latitude/longitude",
        improved: "DECIMAL(10,7) / DECIMAL(11,7) pour geocodage precis",
        reason: "Precision geodesique appropriee (7 decimales ~ 1.1cm).",
      },
      {
        original: "FLOAT pour commission_rate",
        improved: "DECIMAL(5,4) avec CHECK (BETWEEN 0 AND 1)",
        reason: "Stockage normalise du taux en pourcentage decimal.",
      },
    ],
  },
  {
    category: "Nouvelles Tables",
    icon: Table2,
    items: [
      {
        original: "Table reviews absente",
        improved: "Ajout table reviews (user_id, hotel_id, rating, comment)",
        reason: "Indispensable pour les avis clients et la notation des hotels.",
      },
      {
        original: "Table audit_log absente",
        improved: "Ajout table audit_log (user_id, action, entity, details)",
        reason: "Tracabilite complete des actions pour securite et conformite.",
      },
      {
        original: "Table cancellations absente",
        improved:
          "Ajout table cancellations (booking_id, reason, refund_amount, refund_status)",
        reason: "Logique 24h d'annulation/remboursement structuree.",
      },
    ],
  },
  {
    category: "Index & Contraintes",
    icon: CheckCircle2,
    items: [
      {
        original: "Pas d'index composite sur bookings(room_id, check_in, check_out)",
        improved: "Index composite pour verification rapide de disponibilite",
        reason: "Performance des requetes de disponibilite en temps reel.",
      },
      {
        original: "Pas de CONSTRAINT sur coherence amount/commission/net",
        improved:
          "CHECK (net_amount = amount - commission_amount)",
        reason: "Integrite financiere assuree au niveau base de donnees.",
      },
      {
        original: "Pas de contrainte NOT NULL sur booking_id dans transactions",
        improved: "booking_id INT NOT NULL UNIQUE",
        reason: "Chaque transaction doit etre liee a une reservation.",
      },
    ],
  },
]

const enhancedSQL = `-- ============================================================================
-- HOTELIASEM - SCHEMA AMELIORE (Phase 2 - Final Optimise)
-- Ameliorations: Types DECIMAL, nouvelles tables, index composites,
-- contraintes metier renforcees, table audit et reviews
-- ============================================================================
USE HoteliaSEM;
GO

-- 1. TABLE USERS (Amelioree)
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
        last_login_at   DATETIME,                          -- NOUVEAU
        created_at      DATETIME NOT NULL DEFAULT GETUTCDATE(),
        updated_at      DATETIME NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT CK_user_type CHECK (user_type IN ('client','hotelier','admin'))
    );
    CREATE INDEX IX_users_email     ON users(email);
    CREATE INDEX IX_users_user_type ON users(user_type);
    CREATE INDEX IX_users_active    ON users(is_active) WHERE is_active = 1;  -- NOUVEAU: index filtre
END
GO

-- 2. TABLE HOTELS (Types corriges)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='hotels' AND xtype='U')
BEGIN
    CREATE TABLE hotels (
        id                   INT IDENTITY(1,1) PRIMARY KEY,
        name                 NVARCHAR(200) NOT NULL,
        description          NVARCHAR(MAX),
        address              NVARCHAR(300) NOT NULL,
        city                 NVARCHAR(100) NOT NULL,
        country              NVARCHAR(100) NOT NULL DEFAULT 'Cameroun',
        latitude             DECIMAL(10,7),                -- CORRIGE: precision geo
        longitude            DECIMAL(11,7),                -- CORRIGE: precision geo
        phone                NVARCHAR(20),
        email                NVARCHAR(120),
        website              NVARCHAR(200),
        rating               DECIMAL(3,2) NOT NULL DEFAULT 0,  -- CORRIGE: DECIMAL
        total_reviews        INT NOT NULL DEFAULT 0,           -- NOUVEAU
        owner_id             INT NOT NULL,
        subscription_type    NVARCHAR(20) NOT NULL DEFAULT 'standard',
        status               NVARCHAR(20) NOT NULL DEFAULT 'pending',
        is_manually_geocoded BIT NOT NULL DEFAULT 0,
        geocoding_notes      NVARCHAR(500),
        commission_rate      DECIMAL(5,4) NOT NULL DEFAULT 0.1500,  -- CORRIGE
        created_at           DATETIME NOT NULL DEFAULT GETUTCDATE(),
        updated_at           DATETIME NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT FK_hotels_owner FOREIGN KEY (owner_id) REFERENCES users(id),
        CONSTRAINT CK_hotel_sub   CHECK (subscription_type IN ('standard','premium')),
        CONSTRAINT CK_hotel_stat  CHECK (status IN ('pending','approved','rejected')),
        CONSTRAINT CK_hotel_rate  CHECK (rating BETWEEN 0 AND 5),        -- NOUVEAU
        CONSTRAINT CK_hotel_comm  CHECK (commission_rate BETWEEN 0 AND 1) -- NOUVEAU
    );
    CREATE INDEX IX_hotels_owner  ON hotels(owner_id);
    CREATE INDEX IX_hotels_city   ON hotels(city);
    CREATE INDEX IX_hotels_status ON hotels(status);
    CREATE INDEX IX_hotels_rating ON hotels(rating DESC);       -- NOUVEAU
    CREATE INDEX IX_hotels_geo    ON hotels(latitude, longitude) -- NOUVEAU
        WHERE latitude IS NOT NULL AND longitude IS NOT NULL;
END
GO

-- 3. TABLE ROOMS (DECIMAL pour prix)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='rooms' AND xtype='U')
BEGIN
    CREATE TABLE rooms (
        id              INT IDENTITY(1,1) PRIMARY KEY,
        hotel_id        INT NOT NULL,
        room_number     NVARCHAR(20) NOT NULL,
        room_type       NVARCHAR(50) NOT NULL DEFAULT 'standard',  -- CORRIGE: NOT NULL
        price_per_night DECIMAL(18,2) NOT NULL,                    -- CORRIGE: DECIMAL
        currency        NVARCHAR(3) NOT NULL DEFAULT 'XAF',        -- NOUVEAU
        max_guests      INT NOT NULL DEFAULT 2,
        is_available    BIT NOT NULL DEFAULT 1,
        floor_number    INT,                                        -- NOUVEAU
        area_sqm        DECIMAL(6,2),                               -- NOUVEAU
        features        NVARCHAR(MAX),
        created_at      DATETIME NOT NULL DEFAULT GETUTCDATE(),
        updated_at      DATETIME NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT FK_rooms_hotel  FOREIGN KEY (hotel_id)
            REFERENCES hotels(id) ON DELETE CASCADE,
        CONSTRAINT CK_room_price   CHECK (price_per_night > 0),
        CONSTRAINT CK_room_guests  CHECK (max_guests BETWEEN 1 AND 20), -- NOUVEAU
        CONSTRAINT UQ_room_hotel   UNIQUE (hotel_id, room_number)
    );
    CREATE INDEX IX_rooms_hotel ON rooms(hotel_id);
    CREATE INDEX IX_rooms_price ON rooms(price_per_night);
    CREATE INDEX IX_rooms_avail ON rooms(hotel_id, is_available)  -- NOUVEAU
        WHERE is_available = 1;
END
GO

-- 4. TABLE BOOKINGS (DECIMAL + index composite disponibilite)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='bookings' AND xtype='U')
BEGIN
    CREATE TABLE bookings (
        id                INT IDENTITY(1,1) PRIMARY KEY,
        booking_ref       NVARCHAR(20) NOT NULL UNIQUE,         -- NOUVEAU: ref lisible
        user_id           INT NOT NULL,
        hotel_id          INT NOT NULL,
        room_id           INT NOT NULL,
        check_in_date     DATE NOT NULL,                        -- CORRIGE: DATE au lieu de DATETIME
        check_out_date    DATE NOT NULL,                        -- CORRIGE: DATE
        num_nights        AS DATEDIFF(DAY, check_in_date, check_out_date) PERSISTED, -- NOUVEAU: colonne calculee
        num_adults        INT NOT NULL DEFAULT 1,
        num_children      INT NOT NULL DEFAULT 0,
        total_price       DECIMAL(18,2) NOT NULL,               -- CORRIGE: DECIMAL
        status            NVARCHAR(20) NOT NULL DEFAULT 'confirmed',
        special_requests  NVARCHAR(MAX),
        created_at        DATETIME NOT NULL DEFAULT GETUTCDATE(),
        updated_at        DATETIME NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT FK_bookings_user  FOREIGN KEY (user_id)  REFERENCES users(id),
        CONSTRAINT FK_bookings_hotel FOREIGN KEY (hotel_id) REFERENCES hotels(id),
        CONSTRAINT FK_bookings_room  FOREIGN KEY (room_id)  REFERENCES rooms(id),
        CONSTRAINT CK_booking_dates  CHECK (check_out_date > check_in_date),
        CONSTRAINT CK_booking_stat   CHECK (status IN ('confirmed','cancelled','completed','no-show')),
        CONSTRAINT CK_booking_guests CHECK (num_adults >= 1)    -- NOUVEAU
    );
    CREATE INDEX IX_bookings_user  ON bookings(user_id);
    CREATE INDEX IX_bookings_hotel ON bookings(hotel_id);
    CREATE INDEX IX_bookings_room  ON bookings(room_id);
    CREATE INDEX IX_bookings_dates ON bookings(check_in_date, check_out_date);
    CREATE INDEX IX_bookings_avail ON bookings(room_id, check_in_date, check_out_date) -- NOUVEAU
        WHERE status IN ('confirmed','completed');
END
GO

-- 5. TABLE TRANSACTIONS (DECIMAL + coherence financiere)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='transactions' AND xtype='U')
BEGIN
    CREATE TABLE transactions (
        id                    INT IDENTITY(1,1) PRIMARY KEY,
        transaction_ref       NVARCHAR(30) NOT NULL UNIQUE,        -- NOUVEAU
        booking_id            INT NOT NULL UNIQUE,                  -- CORRIGE: NOT NULL
        user_id               INT NOT NULL,
        hotel_id              INT NOT NULL,
        amount                DECIMAL(18,2) NOT NULL,               -- CORRIGE
        commission_amount     DECIMAL(18,2) NOT NULL,               -- CORRIGE
        net_amount            DECIMAL(18,2) NOT NULL,               -- CORRIGE
        currency              NVARCHAR(3) NOT NULL DEFAULT 'XAF',   -- NOUVEAU
        payment_method        NVARCHAR(50) NOT NULL DEFAULT 'stripe', -- CORRIGE
        stripe_payment_intent NVARCHAR(200),                         -- RENOMME
        stripe_charge_id      NVARCHAR(200),                         -- NOUVEAU
        status                NVARCHAR(20) NOT NULL DEFAULT 'pending',
        paid_at               DATETIME,                              -- NOUVEAU
        created_at            DATETIME NOT NULL DEFAULT GETUTCDATE(),
        updated_at            DATETIME NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT FK_trans_booking FOREIGN KEY (booking_id) REFERENCES bookings(id),
        CONSTRAINT FK_trans_user    FOREIGN KEY (user_id)    REFERENCES users(id),
        CONSTRAINT FK_trans_hotel   FOREIGN KEY (hotel_id)   REFERENCES hotels(id),
        CONSTRAINT CK_trans_stat    CHECK (status IN ('pending','completed','failed','refunded')),
        CONSTRAINT CK_trans_amounts CHECK (net_amount = amount - commission_amount), -- NOUVEAU
        CONSTRAINT CK_trans_pos     CHECK (amount > 0 AND commission_amount >= 0)    -- NOUVEAU
    );
    CREATE INDEX IX_trans_booking ON transactions(booking_id);
    CREATE INDEX IX_trans_user    ON transactions(user_id);
    CREATE INDEX IX_trans_hotel   ON transactions(hotel_id);
    CREATE INDEX IX_trans_status  ON transactions(status);     -- NOUVEAU
END
GO

-- 6. TABLE MEDIA (Inchangee, bonne structure)
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
        sort_order  INT NOT NULL DEFAULT 0,                     -- NOUVEAU: ordre affichage
        is_primary  BIT NOT NULL DEFAULT 0,
        uploaded_at DATETIME NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT FK_media_hotel FOREIGN KEY (hotel_id)
            REFERENCES hotels(id) ON DELETE CASCADE,
        CONSTRAINT FK_media_room  FOREIGN KEY (room_id)         -- NOUVEAU
            REFERENCES rooms(id),
        CONSTRAINT CK_media_type  CHECK (file_type IN ('image','video','3d_model'))  -- CORRIGE: ajout 3d_model
    );
    CREATE INDEX IX_media_hotel ON media(hotel_id);
    CREATE INDEX IX_media_room  ON media(room_id) WHERE room_id IS NOT NULL;  -- NOUVEAU
END
GO

-- 7. TABLE NOTIFICATIONS (Amelioree)
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
        read_at     DATETIME,                                   -- NOUVEAU
        created_at  DATETIME NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT FK_notif_user FOREIGN KEY (user_id)
            REFERENCES users(id) ON DELETE CASCADE,
        CONSTRAINT CK_notif_type CHECK (type IN (
            'booking','payment','cancellation','reminder','system','review'
        )),
        CONSTRAINT CK_notif_chan CHECK (channel IN ('sms','email','in_app'))  -- NOUVEAU
    );
    CREATE INDEX IX_notif_user   ON notifications(user_id);
    CREATE INDEX IX_notif_unread ON notifications(user_id, is_read)  -- NOUVEAU
        WHERE is_read = 0;
END
GO

-- 8. TABLE SUBSCRIPTIONS (Inchangee, bonne structure)
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
        stripe_sub_id     NVARCHAR(200),                        -- NOUVEAU
        created_at        DATETIME NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT FK_sub_hotel  FOREIGN KEY (hotel_id)
            REFERENCES hotels(id) ON DELETE CASCADE,
        CONSTRAINT CK_sub_type   CHECK (subscription_type IN ('standard','premium')),
        CONSTRAINT CK_sub_stat   CHECK (status IN ('active','inactive','cancelled','expired')),
        CONSTRAINT CK_sub_dates  CHECK (end_date IS NULL OR end_date >= start_date) -- NOUVEAU
    );
    CREATE INDEX IX_sub_hotel  ON subscriptions(hotel_id);
    CREATE INDEX IX_sub_active ON subscriptions(status) WHERE status = 'active';  -- NOUVEAU
END
GO

-- ============================================================================
-- 9. NOUVELLE TABLE: REVIEWS (Avis clients)
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
        CONSTRAINT UQ_rev_booking UNIQUE (user_id, booking_id) -- Un avis par reservation
    );
    CREATE INDEX IX_rev_hotel  ON reviews(hotel_id);
    CREATE INDEX IX_rev_user   ON reviews(user_id);
    CREATE INDEX IX_rev_rating ON reviews(hotel_id, rating DESC);
END
GO

-- ============================================================================
-- 10. NOUVELLE TABLE: CANCELLATIONS (Logique 24h)
-- ============================================================================
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='cancellations' AND xtype='U')
BEGIN
    CREATE TABLE cancellations (
        id               INT IDENTITY(1,1) PRIMARY KEY,
        booking_id       INT NOT NULL UNIQUE,
        cancelled_by     INT NOT NULL,
        reason           NVARCHAR(500),
        cancel_type      NVARCHAR(20) NOT NULL,  -- 'full_refund' ou 'commission_retained'
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
END
GO

-- ============================================================================
-- 11. NOUVELLE TABLE: AUDIT_LOG (Tracabilite)
-- ============================================================================
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='audit_log' AND xtype='U')
BEGIN
    CREATE TABLE audit_log (
        id          BIGINT IDENTITY(1,1) PRIMARY KEY,
        user_id     INT,
        action      NVARCHAR(50) NOT NULL,
        entity_type NVARCHAR(50) NOT NULL,
        entity_id   INT,
        old_values  NVARCHAR(MAX),  -- JSON des anciennes valeurs
        new_values  NVARCHAR(MAX),  -- JSON des nouvelles valeurs
        ip_address  NVARCHAR(45),
        user_agent  NVARCHAR(500),
        created_at  DATETIME NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT FK_audit_user FOREIGN KEY (user_id) REFERENCES users(id)
    );
    CREATE INDEX IX_audit_user   ON audit_log(user_id);
    CREATE INDEX IX_audit_entity ON audit_log(entity_type, entity_id);
    CREATE INDEX IX_audit_date   ON audit_log(created_at DESC);
END
GO

PRINT 'SCHEMA HOTELIASEM AMELIORE - 11 TABLES CREEES AVEC SUCCES';
GO`

export function SQLSection() {
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<"improvements" | "sql">("improvements")

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(enhancedSQL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
    }
  }

  return (
    <section
      id="sql"
      className="relative py-24"
      role="region"
      aria-label="Schema SQL ameliore"
    >
      <div className="absolute inset-0 animate-deep-sea-pulse opacity-30" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-16 text-center">
          <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-[0.2em] text-hsem-gold">
            Base de Donnees
          </span>
          <h2 className="mb-4 font-serif text-3xl font-bold text-hsem-alabaster md:text-5xl text-balance">
            Schema SQL Ameliore
          </h2>
          <p className="mx-auto max-w-2xl text-hsem-silver/70 text-pretty">
            Analyse et ameliorations du script SQL original pour des performances optimales,
            une integrite financiere et une tracabilite complete.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex justify-center gap-3" role="tablist">
          <button
            role="tab"
            aria-selected={activeTab === "improvements"}
            onClick={() => setActiveTab("improvements")}
            className={`rounded-full px-6 py-2.5 text-sm font-medium transition-all ${
              activeTab === "improvements"
                ? "bg-hsem-gold text-hsem-navy"
                : "border border-hsem-silver/20 text-hsem-silver/70 hover:border-hsem-gold/40"
            }`}
          >
            Ameliorations
          </button>
          <button
            role="tab"
            aria-selected={activeTab === "sql"}
            onClick={() => setActiveTab("sql")}
            className={`rounded-full px-6 py-2.5 text-sm font-medium transition-all ${
              activeTab === "sql"
                ? "bg-hsem-gold text-hsem-navy"
                : "border border-hsem-silver/20 text-hsem-silver/70 hover:border-hsem-gold/40"
            }`}
          >
            Script SQL Complet
          </button>
        </div>

        {/* Improvements Tab */}
        {activeTab === "improvements" && (
          <div className="flex flex-col gap-8">
            {improvements.map((cat, i) => (
              <div
                key={cat.category}
                className="glass-card rounded-2xl p-6 md:p-8 animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="mb-6 flex items-center gap-3">
                  <cat.icon className="h-6 w-6 text-hsem-gold" />
                  <h3 className="font-serif text-xl font-bold text-hsem-alabaster">
                    {cat.category}
                  </h3>
                </div>
                <div className="flex flex-col gap-4">
                  {cat.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-hsem-silver/8 bg-hsem-navy/30 p-4"
                    >
                      <div className="mb-2 flex flex-col gap-2 md:flex-row md:items-center">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 flex-shrink-0 text-amber-400" />
                          <code className="text-xs text-hsem-silver/60 line-through">
                            {item.original}
                          </code>
                        </div>
                        <ArrowRight className="hidden h-4 w-4 text-hsem-gold md:block" />
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-400" />
                          <code className="text-xs font-semibold text-hsem-gold">
                            {item.improved}
                          </code>
                        </div>
                      </div>
                      <p className="pl-6 text-xs text-hsem-silver/50">{item.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SQL Tab */}
        {activeTab === "sql" && (
          <div className="glass-card relative rounded-2xl p-1">
            <div className="flex items-center justify-between rounded-t-xl bg-hsem-navy/60 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-hsem-gold" />
                <span className="text-xs font-medium text-hsem-silver">
                  HoteliaSEM_Schema_Ameliore.sql
                </span>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 rounded-md bg-hsem-gold/10 px-3 py-1.5 text-xs font-medium text-hsem-gold transition-colors hover:bg-hsem-gold/20"
                aria-label="Copier le script SQL"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    Copie !
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copier
                  </>
                )}
              </button>
            </div>
            <pre className="max-h-[600px] overflow-auto rounded-b-xl bg-[#001020] p-4 text-xs leading-relaxed">
              <code className="text-hsem-silver/80">{enhancedSQL}</code>
            </pre>
          </div>
        )}

        {/* Summary stats */}
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { value: "11", label: "Tables Optimisees" },
            { value: "3", label: "Nouvelles Tables" },
            { value: "15+", label: "Nouveaux Index" },
            { value: "20+", label: "Contraintes CHECK" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="glass-card flex flex-col items-center rounded-2xl p-5 animate-fade-in-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <span className="font-serif text-3xl font-bold text-hsem-gold">
                {stat.value}
              </span>
              <span className="text-xs text-hsem-silver/60">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
