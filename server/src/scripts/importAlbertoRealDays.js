const pool = require("../config/database");
const { calculateDailySettlement } = require("../utils/dailySettlement");

const REAL_DAYS = [
  {
    date: "2026-10-01",
    startKm: 511922,
    endKm: 512167,
    fuel: 29.01,
    cash: [8.98, 6.38, 4.98, 5.61, 8.17, 6.57, 6.97, 9.55, 7.84, 10.2, 30.05],
    card: [4.63, 10.63, 19.43, 10, 6.73, 7.83, 5.33, 8.28, 7.03, 7.58, 10.17, 11.55, 22, 9.05, 7.84, 10.6, 9.85, 9.2],
  },
  {
    date: "2026-10-02",
    startKm: 512167,
    endKm: 512883,
    fuel: 74,
    cash: [6.13],
    card: [4.61, 50, 10.83, 513, 19.12, 15.72],
  },
  {
    date: "2026-10-04",
    startKm: 513632,
    endKm: 513947,
    fuel: 34.01,
    ownerAdjustment: 5,
    ownerAdjustmentBreakdown: [
      { company: "Mati - Aviación General", amount: 5, paymentType: "cash" },
    ],
    cash: [11.72, 5.61, 9.24, 14.1, 9.7, 7.84, 7.84, 8.25, { amount: 28, commission: 5, commissionCompanyName: "Petit - AGP", note: "Petit - AGP" }],
    card: [
      23.07, 6.17, 6.62, 7.12, 5.72,
      { amount: 22, note: "Av. Gral." },
      99, 6.4, 11.19, 12.35,
      { amount: 22, note: "Av. Gral." },
      8.25, 15.95, 10.95, 11.3,
    ],
  },
  {
    date: "2026-10-07",
    startKm: 515119,
    endKm: 515408,
    fuel: 30.01,
    cash: [6.23, 5.61, 8.55, 8.25, 17.1],
    card: [
      47.38,
      { amount: 22, note: "Av. Gral." },
      { amount: 22, note: "Av. Gral." },
      { amount: 20, note: "Estepa - Av. Gral." },
      10,
      { amount: 23, note: "Av. Gral." },
      4.61, 8.77,
      { amount: 40, note: "Av. Gral." },
      14.15, 15.6, 8.5, 27.92,
      { amount: 23, note: "Well - AGP" },
    ],
  },
  {
    date: "2026-10-08",
    startKm: 515597,
    endKm: 515866,
    fuel: 28.01,
    ownerAdjustment: 5,
    ownerAdjustmentBreakdown: [
      { company: "Mati - Aviación General", amount: 5, paymentType: "cash" },
    ],
    cash: [5.18, 5.33, 15.8, 10.55, 13.2, 25.65],
    card: [
      7.33,
      { amount: 23.19, note: "Miramar - AGP" },
      4.61, 5.43, 4.63, 5.63, 7.38, 7,
      { amount: 40, note: "Av. Gral." },
      { amount: 22, note: "Av. Gral." },
      { amount: 22, note: "Av. Gral." },
      10.92, 14.8, 25.05, 30.93,
    ],
  },
  {
    date: "2026-10-09",
    startKm: 516031,
    endKm: 516296,
    fuel: 31.01,
    cash: [4.93, 10.33, 6.33, 8.34, 8.44, 45, 9.32, 10.97, 8.63],
    card: [
      25, 5.73,
      { amount: 22.04, note: "M... - AGP" },
      7.28, 10.98,
      { amount: 22, note: "Av. Gral." },
      6.88, 11.13,
      { amount: 22, note: "Av. Gral." },
      8.18, 12.37, 9.42, 12.27, 8.63,
      { amount: 22, note: "AGP" },
    ],
  },
  {
    date: "2026-10-10",
    startKm: 516449,
    endKm: 516751,
    fuel: 33.01,
    cash: [35.72, 70.23, 27.47, 36.39, 8.63, 14.11],
    card: [
      { amount: 25, note: "AGP" },
      23.06, 34.19, 29.92, 13.42, 15.72,
      { amount: 23, note: "Petit - AGP" },
    ],
  },
  {
    date: "2026-10-11",
    startKm: 517019,
    endKm: 517328,
    fuel: 33.01,
    cash: [8.87, 10.52, 7.52, 17.27, 12.27, 6.44, 13.27, 8.43],
    card: [
      32.09,
      { amount: 100, note: "Av. Gral." },
      6.4, 13.24, 11.84, 9.87, 8.63, 10.97, 13.97, 10.57,
      { amount: 28.85, note: "Miramar - AGP" },
    ],
  },
  {
    date: "2026-10-14",
    startKm: 518303,
    endKm: 518621,
    fuel: 36,
    ownerAdjustment: 10,
    ownerAdjustmentBreakdown: [
      { company: "Aviación General", amount: 10, paymentType: "cash" },
    ],
    cash: [
      { amount: 90, note: "Av. Gral." },
      16.4, 10, 17.45,
    ],
    card: [12.28, 7.18, { amount: 10, note: "Abonado" }, 13.33, 18.83, 9.37, 37.94, 16.77, 14.2, 7.84, 17.7, 7.84],
  },
  {
    date: "2026-10-15",
    startKm: 518826,
    endKm: 519183,
    fuel: 40.01,
    cash: [110.9, 25.33, 25.29, 8.25],
    card: [53.3, 23.92, 25.44, 25.87, 26.27, 8.95],
  },
  {
    date: "2026-10-16",
    startKm: 519372,
    endKm: 519658,
    fuel: 33,
    cash: [8.13, 8.23, 28.38, 4.63, 17.94, 8.63, { amount: 31, commission: 5, commissionCompanyName: "Petit - AGP", note: "Petit - AGP" }],
    card: [
      { amount: 22, note: "Av. Gral." },
      { amount: 35, note: "Av. Gral." },
      8.53,
      { amount: 22, note: "Av. Gral." },
      5.63,
      { amount: 25, note: "AGP" },
      11, 16.62, 10.07, 10.52, 13.62, 12.42, 22.72, 29.57,
    ],
  },
  {
    date: "2026-10-17",
    startKm: 519903,
    endKm: 520153,
    fuel: 30,
    cash: [8.22, 7.12, 9.77, 10.14],
    card: [
      7.17,
      { amount: 23, note: "Well - AGP" },
      { amount: 23, note: "Well - AGP" },
      11.97, 7.67, 5.61,
      { amount: 22, note: "Av. Gral." },
      8.84, 9.02, 21.97, 19.02, 13.92, 11.32, 9.12, 53.17, 8.63, 29.07, 29.14,
    ],
  },
  {
    date: "2026-10-18",
    startKm: 520382,
    endKm: 520765,
    fuel: 38.01,
    ownerAdjustment: 5,
    ownerAdjustmentBreakdown: [
      { company: "Mati - Aviación General", amount: 5, paymentType: "cash" },
    ],
    cash: [5.61, 9.72, 6.52, 18.24, 8.49, 8.39, 11.02, 7.84],
    card: [
      { amount: 109, note: "María - Estepona" },
      { amount: 35, note: "Av. Gral." },
      { amount: 23, note: "Well - AGP" },
      5.67,
      { amount: 23, note: "Well - AGP" },
      { amount: 22, note: "Av. Gral." },
      12.25,
      11.4,
      { amount: 25, note: "Pago - asistencia" },
      8.8,
    ],
  },
];

const amountOf = (value) => Number(
  typeof value === "object" && value !== null ? value.amount : value
);

const commissionOf = (value) => Number(
  typeof value === "object" && value !== null ? value.commission || 0 : 0
);

const cents = (values) => values.reduce(
  (total, value) => total + Math.round((amountOf(value) - commissionOf(value)) * 100),
  0
);

const normalizeTrip = (value, paymentType) => ({
  amount: amountOf(value),
  paymentType,
  commission: commissionOf(value),
  commissionCompanyName: typeof value === "object" && value !== null
    ? value.commissionCompanyName || null
    : null,
  note: typeof value === "object" && value !== null ? value.note || null : null,
});

const syncTripCommissions = async (connection, workDayId, day) => {
  const commissionedTrips = interleaveTrips(day).filter((trip) => trip.commission > 0);
  for (const trip of commissionedTrips) {
    const netAmount = Number((trip.amount - trip.commission).toFixed(2));
    const [rows] = await connection.query(
      `SELECT id FROM trips
       WHERE work_day_id = ? AND payment_type = ?
         AND (amount = ? OR amount = ?)
         AND note LIKE ?
       ORDER BY id
       LIMIT 1
       FOR UPDATE`,
      [workDayId, trip.paymentType, netAmount, trip.amount, `${trip.note}%`]
    );
    if (rows.length !== 1) {
      throw new Error(`No se encontró el viaje con comisión del ${day.date}`);
    }
    await connection.query(
      `UPDATE trips
       SET amount = ?, commission = ?, commission_company_name = ?,
           commission_company_amount = ?, updated_at = updated_at
       WHERE id = ?`,
      [trip.amount, trip.commission, trip.commissionCompanyName, trip.commission, rows[0].id]
    );
  }
};

const interleaveTrips = ({ cash, card }) => {
  const trips = [];
  const maxLength = Math.max(cash.length, card.length);
  for (let index = 0; index < maxLength; index += 1) {
    if (index < cash.length) trips.push(normalizeTrip(cash[index], "cash"));
    if (index < card.length) trips.push(normalizeTrip(card[index], "card"));
  }
  return trips;
};

const pad = (value) => String(value).padStart(2, "0");

const buildTripTimes = (date, count) => {
  const start = new Date(`${date}T16:00:00Z`);
  const intervalMinutes = 720 / (count + 1);
  return Array.from({ length: count }, (_, index) => {
    const moment = new Date(start.getTime() + intervalMinutes * (index + 1) * 60000);
    return `${moment.getUTCFullYear()}-${pad(moment.getUTCMonth() + 1)}-${pad(moment.getUTCDate())} ${pad(moment.getUTCHours())}:${pad(moment.getUTCMinutes())}:00`;
  });
};

const validateDays = () => {
  const expected = {
    "2026-10-01": { cash: 10530, card: 17773, total: 28303 },
    "2026-10-02": { cash: 613, card: 61328, total: 61941 },
    "2026-10-04": { cash: 9730, card: 26809, total: 36539 },
    "2026-10-07": { cash: 4574, card: 28693, total: 33267 },
    "2026-10-08": { cash: 7571, card: 23090, total: 30661 },
    "2026-10-09": { cash: 11229, card: 20591, total: 31820 },
    "2026-10-10": { cash: 19255, card: 16431, total: 35686 },
    "2026-10-11": { cash: 8459, card: 24643, total: 33102 },
    "2026-10-14": { cash: 13385, card: 17328, total: 30713 },
    "2026-10-15": { cash: 16977, card: 16375, total: 33352 },
    "2026-10-16": { cash: 10194, card: 24470, total: 34664 },
    "2026-10-17": { cash: 3525, card: 31364, total: 34889 },
    "2026-10-18": { cash: 7583, card: 27512, total: 35095 },
  };
  for (const day of REAL_DAYS) {
    const cash = cents(day.cash);
    const card = cents(day.card);
    if (cash !== expected[day.date].cash || card !== expected[day.date].card || cash + card !== expected[day.date].total) {
      throw new Error(`Los importes del ${day.date} no coinciden con la libreta`);
    }
    const breakdownTotal = (day.ownerAdjustmentBreakdown || []).reduce(
      (total, item) => total + Math.round(Number(item.amount) * 100),
      0
    );
    if (breakdownTotal !== Math.round(Number(day.ownerAdjustment || 0) * 100)) {
      throw new Error(`El desglose externo del ${day.date} no coincide con la libreta`);
    }
  }
};

const importDay = async (connection, scope, day) => {
  const [existing] = await connection.query(
    `SELECT id FROM work_days
     WHERE organization_id = ? AND driver_user_id = ? AND date = ?
     FOR UPDATE`,
    [scope.organizationId, scope.userId, day.date]
  );
  if (existing.length > 0) {
    const workDayId = Number(existing[0].id);
    await syncTripCommissions(connection, workDayId, day);
    const cashAmount = cents(day.cash) / 100;
    const cardAmount = cents(day.card) / 100;
    const snapshot = calculateDailySettlement({
      netRevenue: cashAmount + cardAmount,
      cashRetained: cashAmount,
      fuelCost: day.fuel,
      socialSecurity: scope.socialSecurity,
      ownerAdjustment: day.ownerAdjustment || 0,
      driverShareBasisPoints: scope.driverShareBasisPoints,
    });
    const [updateResult] = await connection.query(
      `UPDATE daily_settlement_snapshots
       SET net_revenue = ?, cash_retained = ?, fuel_cost = ?, social_security = ?,
           driver_share_basis_points = ?, distributable_base = ?, driver_share = ?,
           owner_share = ?, reimbursable_fuel = ?, driver_entitlement = ?,
           owner_adjustment = ?, owner_adjustment_breakdown = ?,
           balance = ?, balance_direction = ?
       WHERE work_day_id = ? AND organization_id = ? AND driver_user_id = ?`,
      [
        snapshot.netRevenue, snapshot.cashRetained, snapshot.fuelCost,
        snapshot.socialSecurity, scope.driverShareBasisPoints,
        snapshot.distributableBase, snapshot.driverShare, snapshot.ownerShare,
        snapshot.reimbursableFuel, snapshot.driverEntitlement,
        snapshot.ownerAdjustment,
        JSON.stringify(day.ownerAdjustmentBreakdown || []),
        snapshot.balance, snapshot.balanceDirection,
        workDayId, scope.organizationId, scope.userId,
      ]
    );
    if (updateResult.affectedRows !== 1) {
      throw new Error(`No se encontró la liquidación importada del ${day.date}`);
    }
    return {
      date: day.date,
      status: "synchronized",
      workDayId,
      cash: cashAmount,
      card: cardAmount,
      balance: snapshot.balance,
    };
  }

  const [workDayResult] = await connection.query(
    `INSERT INTO work_days (
       date, start_km, end_km, fuel_own, fuel_jose, status,
       organization_id, driver_user_id, vehicle_id
     ) VALUES (?, ?, ?, ?, 0, 'CLOSED', ?, ?, ?)`,
    [day.date, day.startKm, day.endKm, day.fuel, scope.organizationId, scope.userId, scope.vehicleId]
  );
  const workDayId = Number(workDayResult.insertId);
  const trips = interleaveTrips(day);
  const times = buildTripTimes(day.date, trips.length);

  for (let index = 0; index < trips.length; index += 1) {
    const trip = trips[index];
    await connection.query(
      `INSERT INTO trips (
         work_day_id, amount, payment_type, commission,
         commission_company_name, commission_company_amount,
         tip, note, created_at, updated_at
       ) VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?, ?)`,
      [
        workDayId,
        trip.amount,
        trip.paymentType,
        trip.commission,
        trip.commissionCompanyName,
        trip.commission > 0 ? trip.commission : null,
        trip.note
          ? `${trip.note} · Hora aproximada distribuida desde libreta`
          : "Hora aproximada distribuida desde libreta",
        times[index],
        times[index],
      ]
    );
  }

  const cashAmount = cents(day.cash) / 100;
  const cardAmount = cents(day.card) / 100;
  const snapshot = calculateDailySettlement({
    netRevenue: cashAmount + cardAmount,
    cashRetained: cashAmount,
    fuelCost: day.fuel,
    socialSecurity: scope.socialSecurity,
    ownerAdjustment: day.ownerAdjustment || 0,
    driverShareBasisPoints: scope.driverShareBasisPoints,
  });
  await connection.query(
    `INSERT INTO daily_settlement_snapshots (
       work_day_id, organization_id, driver_user_id,
       net_revenue, cash_retained, fuel_cost, social_security,
       driver_share_basis_points, distributable_base, driver_share,
       owner_share, reimbursable_fuel, driver_entitlement,
       owner_adjustment, owner_adjustment_breakdown, balance, balance_direction
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      workDayId, scope.organizationId, scope.userId,
      snapshot.netRevenue, snapshot.cashRetained, snapshot.fuelCost,
      snapshot.socialSecurity, scope.driverShareBasisPoints,
      snapshot.distributableBase, snapshot.driverShare, snapshot.ownerShare,
      snapshot.reimbursableFuel, snapshot.driverEntitlement,
      snapshot.ownerAdjustment,
      JSON.stringify(day.ownerAdjustmentBreakdown || []),
      snapshot.balance, snapshot.balanceDirection,
    ]
  );

  return {
    date: day.date,
    status: "created",
    workDayId,
    tripCount: trips.length,
    cash: cashAmount,
    card: cardAmount,
    balance: snapshot.balance,
  };
};

const run = async () => {
  validateDays();
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [rows] = await connection.query(
      `SELECT o.id AS organizationId, u.id AS userId, v.id AS vehicleId,
              om.daily_social_security AS socialSecurity,
              om.driver_share_basis_points AS driverShareBasisPoints
       FROM organizations o
       JOIN organization_memberships om ON om.organization_id = o.id AND om.status = 'ACTIVE'
       JOIN users u ON u.id = om.user_id AND u.username = 'alberto.caparotta'
       JOIN vehicles v ON v.organization_id = o.id AND v.status = 'ACTIVE'
       WHERE o.slug = 'lic1315'
       ORDER BY v.id
       LIMIT 1
       FOR UPDATE`
    );
    if (rows.length !== 1) throw new Error("No se encontró el perfil activo de Alberto en Lic1315");
    const scope = {
      ...rows[0],
      organizationId: Number(rows[0].organizationId),
      userId: Number(rows[0].userId),
      vehicleId: Number(rows[0].vehicleId),
      socialSecurity: Number(rows[0].socialSecurity),
      driverShareBasisPoints: Number(rows[0].driverShareBasisPoints),
    };
    if (scope.socialSecurity !== 35 || scope.driverShareBasisPoints !== 5000) {
      throw new Error("El perfil de Alberto no tiene configurados 35 € y reparto 50/50");
    }
    const results = [];
    for (const day of REAL_DAYS) results.push(await importDay(connection, scope, day));
    await connection.commit();
    results.forEach((result) => console.log(JSON.stringify(result)));
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
    await pool.end();
  }
};

if (require.main === module) {
  run().catch((error) => {
    console.error(`No se pudieron importar las jornadas de Alberto: ${error.message}`);
    process.exit(1);
  });
}

module.exports = { REAL_DAYS, buildTripTimes, interleaveTrips, validateDays };
