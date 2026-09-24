"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import AppShell from "@/components/layout/AppShell";

import {
  Bell,
  CloudRain,
  Bug,
  Droplets,
  Sprout,
  AlertTriangle,
  CheckCircle2,
  Info,
  Check,
  Trash2,
  Clock,
} from "lucide-react";

/* =========================================================
   TYPES
   ========================================================= */

type AlertType =
  | "Weather"
  | "Disease"
  | "Irrigation"
  | "Crop";

type AlertSeverity =
  | "Critical"
  | "Warning"
  | "Info";

type AlertFilter =
  | "All"
  | "Critical"
  | "Warning"
  | "Info";

type FarmAlert = {
  id: number;
  type: AlertType;
  severity: AlertSeverity;
  titleKey: string;
  messageKey: string;
  timeKey: string;
  unread: boolean;
};

/* =========================================================
   INITIAL ALERT DATA
   ========================================================= */

const initialAlerts: FarmAlert[] = [
  {
    id: 1,
    type: "Weather",
    severity: "Warning",
    titleKey: "alerts.rainExpected",
    messageKey: "alerts.reviewIrrigationWindow",
    timeKey: "alerts.time20Min",
    unread: true,
  },

  {
    id: 2,
    type: "Disease",
    severity: "Critical",
    titleKey: "alerts.diseaseRiskIncreased",
    messageKey: "alerts.humidityDiseaseRiskLong",
    timeKey: "alerts.time1Hour",
    unread: true,
  },

  {
    id: 3,
    type: "Irrigation",
    severity: "Info",
    titleKey: "alerts.irrigationReview",
    messageKey: "alerts.moderateIrrigationLong",
    timeKey: "alerts.time3Hours",
    unread: true,
  },

  {
    id: 4,
    type: "Crop",
    severity: "Info",
    titleKey: "alerts.cropGrowthUpdate",
    messageKey: "alerts.wheatGrowth",
    timeKey: "common.yesterday",
    unread: false,
  },

  {
    id: 5,
    type: "Weather",
    severity: "Warning",
    titleKey: "alerts.humidityIncreasing",
    messageKey: "alerts.monitorAfterRain",
    timeKey: "common.yesterday",
    unread: false,
  },

  {
    id: 6,
    type: "Crop",
    severity: "Info",
    titleKey: "alerts.fieldInspection",
    messageKey: "alerts.routineInspection",
    timeKey: "alerts.time2Days",
    unread: false,
  },
];

/* =========================================================
   FILTERS
   ========================================================= */

const filters: AlertFilter[] = [
  "All",
  "Critical",
  "Warning",
  "Info",
];

/* =========================================================
   PAGE
   ========================================================= */

export default function AlertsPage() {
  const { t } = useTranslation();
  const [alerts, setAlerts] =
    useState<FarmAlert[]>(initialAlerts);

  const [filter, setFilter] =
    useState<AlertFilter>("All");

  /* =======================================================
     FILTER COUNTS
     ======================================================= */

  const filterCounts = useMemo(() => {
    return {
      All: alerts.length,

      Critical: alerts.filter(
        (alert) =>
          alert.severity === "Critical"
      ).length,

      Warning: alerts.filter(
        (alert) =>
          alert.severity === "Warning"
      ).length,

      Info: alerts.filter(
        (alert) =>
          alert.severity === "Info"
      ).length,
    };
  }, [alerts]);

  /* =======================================================
     FILTERED ALERTS
     ======================================================= */

  const filteredAlerts = useMemo(() => {
    if (filter === "All") {
      return alerts;
    }

    return alerts.filter(
      (alert) =>
        alert.severity === filter
    );
  }, [alerts, filter]);

  /* =======================================================
     UNREAD COUNT
     ======================================================= */

  const unreadCount = useMemo(() => {
    return alerts.filter(
      (alert) => alert.unread
    ).length;
  }, [alerts]);

  /* =======================================================
     CRITICAL COUNT
     ======================================================= */

  const criticalCount = useMemo(() => {
    return alerts.filter(
      (alert) =>
        alert.severity === "Critical"
    ).length;
  }, [alerts]);

  /* =======================================================
     READ COUNT
     ======================================================= */

  const readCount = useMemo(() => {
    return alerts.filter(
      (alert) => !alert.unread
    ).length;
  }, [alerts]);

  /* =======================================================
     MARK SINGLE ALERT READ
     ======================================================= */

  function markAsRead(id: number) {
    setAlerts((current) =>
      current.map((alert) =>
        alert.id === id
          ? {
              ...alert,
              unread: false,
            }
          : alert
      )
    );
  }

  /* =======================================================
     MARK ALL READ
     ======================================================= */

  function markAllAsRead() {
    setAlerts((current) =>
      current.map((alert) => ({
        ...alert,
        unread: false,
      }))
    );
  }

  /* =======================================================
     CLEAR READ ALERTS
     ======================================================= */

  function clearReadAlerts() {
    setAlerts((current) =>
      current.filter(
        (alert) => alert.unread
      )
    );

    /*
      If the currently selected filter becomes empty,
      automatically return to All.
    */
    setFilter("All");
  }

  /* =======================================================
     FILTER HANDLER
     ======================================================= */

  function handleFilterChange(
    selectedFilter: AlertFilter
  ) {
    setFilter(selectedFilter);
  }

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <AppShell>
      {/* =====================================================
          HEADER
          ===================================================== */}

      <section className="feature-header feature-reveal feature-reveal-1"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: "20px",
          marginBottom: "22px",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "7px",
            }}
          >
            <div
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: "#facc15",
                boxShadow:
                  "0 0 12px rgba(250,204,21,0.8)",
              }}
            />

            <span
              style={{
                color: "#fde68a",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "1px",
              }}
            >
              FARM MONITORING
            </span>
          </div>

          <h1
            style={{
              margin: 0,
              color: "#ffffff",
              fontSize: "28px",
              fontWeight: 800,
              letterSpacing: "-0.7px",
            }}
          >
              {t("alerts.title")}
          </h1>

          <p
            style={{
              margin: "6px 0 0",
              color: "#64748b",
              fontSize: "13px",
            }}
          >
            {t("alerts.subtitle")}
          </p>
        </div>

        {/* UNREAD BADGE */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "9px 13px",
            borderRadius: "10px",
            background:
              "rgba(250,204,21,0.06)",
            border:
              "1px solid rgba(250,204,21,0.15)",
            color: "#fde68a",
            fontSize: "10px",
            fontWeight: 700,
          }}
        >
          <Bell size={14} />

          {unreadCount} {t("alerts.unread")}
        </div>
      </section>

      {/* =====================================================
          ALERT OVERVIEW
          ===================================================== */}

      <section className="alerts-summary feature-reveal feature-reveal-2"
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(3, 1fr)",
          gap: "12px",
          marginBottom: "18px",
        }}
      >
        <AlertSummary
          icon={<Bell size={17} />}
          value={String(unreadCount)}
          label={t("alerts.unreadAlerts")}
          color="#facc15"
        />

        <AlertSummary
          icon={<AlertTriangle size={17} />}
          value={String(criticalCount)}
          label={t("alerts.criticalAlerts")}
          color="#fb7185"
        />

        <AlertSummary
          icon={<CheckCircle2 size={17} />}
          value={String(readCount)}
          label={t("alerts.readAlerts")}
          color="#4ade80"
        />
      </section>

      {/* =====================================================
          ACTION BAR
          ===================================================== */}

      <section className="alerts-toolbar feature-reveal feature-reveal-3 glass-card"
        style={{
          padding: "14px",
          marginBottom: "15px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "15px",
          flexWrap: "wrap",
        }}
      >
        {/* FILTERS */}

        <div
          style={{
            display: "flex",
            gap: "7px",
            flexWrap: "wrap",
          }}
        >
          {filters.map((item) => {
            const active =
              filter === item;

            const count =
              filterCounts[item];

            return (
              <button
                key={item}
                type="button"
                onClick={() =>
                  handleFilterChange(item)
                }
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "8px 12px",
                  borderRadius: "999px",
                  border: active
                    ? "1px solid rgba(96,165,250,0.45)"
                    : "1px solid rgba(99,102,241,0.12)",
                  background: active
                    ? "linear-gradient(135deg, rgba(59,130,246,0.20), rgba(139,92,246,0.16))"
                    : "rgba(8,17,43,0.55)",
                  color: active
                    ? "#dbeafe"
                    : "#64748b",
                  fontSize: "9px",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition:
                    "all 160ms ease",
                  boxShadow: active
                    ? "0 0 18px rgba(59,130,246,0.12)"
                    : "none",
                }}
              >
                <span>{t(`alerts.${item.toLowerCase()}`)}</span>

                <span
                  style={{
                    minWidth: "18px",
                    height: "18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 5px",
                    borderRadius: "999px",
                    background: active
                      ? "rgba(255,255,255,0.10)"
                      : "rgba(100,116,139,0.10)",
                    color: active
                      ? "#ffffff"
                      : "#64748b",
                    fontSize: "8px",
                    fontWeight: 800,
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ACTIONS */}

        <div
          style={{
            display: "flex",
            gap: "7px",
          }}
        >
          <button
            type="button"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: "8px 10px",
              borderRadius: "8px",
              border:
                "1px solid rgba(74,222,128,0.14)",
              background:
                "rgba(74,222,128,0.05)",
              color: "#86efac",
              fontSize: "8px",
              fontWeight: 700,
              cursor:
                unreadCount === 0
                  ? "not-allowed"
                  : "pointer",
              opacity:
                unreadCount === 0
                  ? 0.45
                  : 1,
            }}
          >
            <Check size={11} />
            {t("alerts.markAllRead")}
          </button>

          <button
            type="button"
            onClick={clearReadAlerts}
            disabled={readCount === 0}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: "8px 10px",
              borderRadius: "8px",
              border:
                "1px solid rgba(251,113,133,0.14)",
              background:
                "rgba(251,113,133,0.05)",
              color: "#fda4af",
              fontSize: "8px",
              fontWeight: 700,
              cursor:
                readCount === 0
                  ? "not-allowed"
                  : "pointer",
              opacity:
                readCount === 0
                  ? 0.45
                  : 1,
            }}
          >
            <Trash2 size={11} />
            {t("alerts.clearRead")}
          </button>
        </div>
      </section>

      {/* =====================================================
          ALERT LIST
          ===================================================== */}

      <section className="alerts-list feature-reveal feature-reveal-4">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "12px",
          }}
        >
          <div>
            <h3
              style={{
                margin: 0,
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: 750,
              }}
            >
              {t("alerts.recentAlerts")}
            </h3>

            <p
              style={{
                margin: "4px 0 0",
                color: "#64748b",
                fontSize: "9px",
              }}
            >
              {t("alerts.shownCount", { count: filteredAlerts.length, filter: filter === "All" ? t("alerts.all") : t(`alerts.${filter.toLowerCase()}`) })}
            </p>
          </div>
        </div>

        {filteredAlerts.length === 0 ? (
          <EmptyState filter={filter} />
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "9px",
            }}
          >
            {filteredAlerts.map(
              (alert) => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  onRead={() =>
                    markAsRead(alert.id)
                  }
                />
              )
            )}
          </div>
        )}
      </section>

      {/* =====================================================
          FARM MONITORING INFO
          ===================================================== */}

      <section className="alerts-info feature-reveal feature-reveal-5"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginTop: "18px",
          padding: "15px 18px",
          borderRadius: "14px",
          background:
            "rgba(96,165,250,0.045)",
          border:
            "1px solid rgba(96,165,250,0.12)",
        }}
      >
        <div
          style={{
            width: "35px",
            height: "35px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "9px",
            background:
              "rgba(96,165,250,0.09)",
            color: "#60a5fa",
            flexShrink: 0,
          }}
        >
          <Info size={17} />
        </div>

        <div>
          <div
            style={{
              color: "#e2e8f0",
              fontSize: "10px",
              fontWeight: 700,
            }}
          >
            {t("alerts.smartMonitoring")}
          </div>

          <div
            style={{
              color: "#64748b",
              fontSize: "9px",
              marginTop: "3px",
              lineHeight: 1.6,
            }}
          >
            {t("alerts.monitoringDescription")}
          </div>
        </div>
      </section>
    </AppShell>
  );
}

/* =========================================================
   ALERT CARD
   ========================================================= */

function AlertCard({
  alert,
  onRead,
}: {
  alert: FarmAlert;
  onRead: () => void;
}) {
  const { t } = useTranslation();
  const config = getAlertConfig(
    alert.type,
    alert.severity
  );

  return (
    <div
      className="glass-card alert-card"
      style={{
        padding: "16px",
        border: alert.unread
          ? `1px solid ${config.color}28`
          : "1px solid rgba(99,102,241,0.10)",
        position: "relative",
        transition:
          "transform 160ms ease, border-color 160ms ease",
      }}
    >
      {/* UNREAD INDICATOR */}

      {alert.unread && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: "18px",
            bottom: "18px",
            width: "3px",
            borderRadius:
              "0 4px 4px 0",
            background:
              config.color,
            boxShadow:
              `0 0 12px ${config.color}`,
          }}
        />
      )}

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "12px",
        }}
      >
        {/* ICON */}

        <div
          style={{
            width: "42px",
            height: "42px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "11px",
            background:
              `${config.color}12`,
            border:
              `1px solid ${config.color}20`,
            color: config.color,
            flexShrink: 0,
          }}
        >
          {config.icon}
        </div>

        {/* CONTENT */}

        <div
          style={{
            flex: 1,
            minWidth: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              flexWrap: "wrap",
            }}
          >
            <h4
              style={{
                margin: 0,
                color: alert.unread
                  ? "#ffffff"
                  : "#cbd5e1",
                fontSize: "12px",
                fontWeight: 750,
              }}
            >
              {t(alert.titleKey)}
            </h4>

            <span
              style={{
                padding: "3px 6px",
                borderRadius: "999px",
                background:
                  `${config.color}10`,
                color:
                  config.color,
                fontSize: "7px",
                fontWeight: 700,
              }}
            >
              {t(`alerts.${alert.severity.toLowerCase()}`)}
            </span>
          </div>

          <p
            style={{
              margin: "6px 0 0",
              color: "#64748b",
              fontSize: "9px",
              lineHeight: 1.6,
              maxWidth: "700px",
            }}
          >
            {t(alert.messageKey)}
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginTop: "9px",
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                color: "#475569",
                fontSize: "8px",
              }}
            >
              <Clock size={10} />
              {t(alert.timeKey)}
            </span>

            <span
              style={{
                color: "#475569",
                fontSize: "8px",
              }}
            >
              {t(`alerts.${alert.type.toLowerCase()}`)}
            </span>
          </div>
        </div>

        {/* ACTION */}

        {alert.unread && (
          <button
            type="button"
            onClick={onRead}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: "7px 9px",
              borderRadius: "8px",
              border:
                "1px solid rgba(74,222,128,0.13)",
              background:
                "rgba(74,222,128,0.05)",
              color: "#86efac",
              fontSize: "8px",
              fontWeight: 700,
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <Check size={11} />
            {t("alerts.read")}
          </button>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   ALERT CONFIG
   ========================================================= */

function getAlertConfig(
  type: AlertType,
  severity: AlertSeverity
) {
  /*
    Critical severity always gets the strongest
    disease/critical visual treatment.
  */

  if (severity === "Critical") {
    return {
      color: "#fb7185",
      icon: <Bug size={20} />,
    };
  }

  if (type === "Weather") {
    return {
      color: "#60a5fa",
      icon: <CloudRain size={20} />,
    };
  }

  if (type === "Irrigation") {
    return {
      color: "#38bdf8",
      icon: <Droplets size={20} />,
    };
  }

  if (type === "Crop") {
    return {
      color: "#4ade80",
      icon: <Sprout size={20} />,
    };
  }

  return {
    color: "#facc15",
    icon: <AlertTriangle size={20} />,
  };
}

/* =========================================================
   SUMMARY CARD
   ========================================================= */

function AlertSummary({
  icon,
  value,
  label,
  color,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  color: string;
}) {
  return (
    <div
      className="glass-card alert-summary-card"
      style={{
        padding: "15px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "7px",
          color,
        }}
      >
        {icon}

        <span
          style={{
            color: "#64748b",
            fontSize: "9px",
          }}
        >
          {label}
        </span>
      </div>

      <div
        style={{
          marginTop: "7px",
          color: "#ffffff",
          fontSize: "19px",
          fontWeight: 800,
        }}
      >
        {value}
      </div>
    </div>
  );
}

/* =========================================================
   EMPTY STATE
   ========================================================= */

function EmptyState({
  filter,
}: {
  filter: AlertFilter;
}) {
  const { t } = useTranslation();
  return (
    <div
      className="glass-card alert-empty-card"
      style={{
        padding: "45px 20px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: "50px",
          height: "50px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          background:
            "rgba(74,222,128,0.08)",
          color: "#4ade80",
        }}
      >
        <CheckCircle2 size={24} />
      </div>

      <h3
        style={{
          margin: "13px 0 0",
          color: "#ffffff",
          fontSize: "14px",
          fontWeight: 750,
        }}
      >
        {t("alerts.noFilteredAlerts", {
          filter: filter !== "All" ? t(`alerts.${filter.toLowerCase()}`) : "",
        })}
      </h3>

      <p
        style={{
          margin: "5px 0 0",
          color: "#64748b",
          fontSize: "9px",
        }}
      >
        {t("alerts.noFilteredAlertsDescription")}
      </p>
    </div>
  );
}