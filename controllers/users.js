function dataify(limit, offset, totalItemCount, items) {
  return {
    frame: {
      limit: limit || -1,
      offset: offset || -1,
      total: totalItemCount || -1
    },
    results: items
  }
}

exports.index = function(req, res, next) {
  var users = [
    { id: 1, firstName: 'Fred', lastName: 'Jones', username: 'freddy' },
    { id: 2, firstName: 'Steve', lastName: 'Melbourne', username: 'yoda' }
  ];

  res.status(200).send(dataify(null, null, users.length, users));
};
