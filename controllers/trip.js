import fs from 'fs';
import path from 'path';

export const getTrips = (req, res, next) => {
  const allowedDestinations = [
    "ATL", "PEK", "LAX", "DXB", "HND", "ORD", "LHR", "PVG", "CDG", "DFW",
    "AMS", "FRA", "IST", "CAN", "JFK", "SIN", "DEN", "ICN", "BKK", "SFO",
    "LAS", "CLT", "MIA", "KUL", "SEA", "MUC", "EWR", "MAD", "HKG", "MCO",
    "PHX", "IAH", "SYD", "MEL", "GRU", "YYZ", "LGW", "BCN", "MAN", "BOM",
    "DEL", "ZRH", "SVO", "DME", "JNB", "ARN", "OSL", "CPH", "HEL", "VIE"
  ];

  if (!allowedDestinations.includes(req.params.origin) || !allowedDestinations.includes(req.params.destination)) {
    const error = new Error('Invalid origin or destination.');
    error.statusCode = 422;
    throw error;
  }

  try {
    res.status(200).json({
      message: 'Fetched trips successfully.',
      trips: []
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
