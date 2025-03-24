async function fetchTrips(origin, destination) {
    const response = await fetch(
      `${process.env.BIZAWAY_API_HOST}/default/trips?` + new URLSearchParams({
        origin: origin,
        destination: destination,
      }).toString(),
      { method: 'GET', headers: { 'x-api-key': process.env.BIZAWAY_API_KEY } 
    });
    const data = await response.json();
    return data;
};

export const getTrips = (req, res, next) => {
  const allowedDestinations = [
    "ATL", "PEK", "LAX", "DXB", "HND", "ORD", "LHR", "PVG", "CDG", "DFW",
    "AMS", "FRA", "IST", "CAN", "JFK", "SIN", "DEN", "ICN", "BKK", "SFO",
    "LAS", "CLT", "MIA", "KUL", "SEA", "MUC", "EWR", "MAD", "HKG", "MCO",
    "PHX", "IAH", "SYD", "MEL", "GRU", "YYZ", "LGW", "BCN", "MAN", "BOM",
    "DEL", "ZRH", "SVO", "DME", "JNB", "ARN", "OSL", "CPH", "HEL", "VIE"
  ];

  if (!allowedDestinations.includes(req.query.origin) || !allowedDestinations.includes(req.query.destination)) {
    const error = new Error('Invalid origin or destination.');
    error.statusCode = 422;
    throw error;
  }

  const allowedSorting = ['fastest', 'cheapest'];

  if (!allowedSorting.includes(req.query.sort_by)) {
    const error = new Error('Invalid sort_by.');
    error.statusCode = 422;
    throw error;
  }

  fetchTrips(req.query.origin, req.query.destination)
    .then(data => {
      let trips = [];
      if (req.query.sort_by === 'fastest') {
        trips = data.sort((a,b) => a.duration - b.duration);
      } else {
        trips = data.sort((a,b) => a.cost - b.cost);
      }

      res.status(200).json({
        message: 'Fetched trips successfully.',
        trips: trips
      });
  })
  .catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
};
