const qs = require("qs");
const JsonApi = require("jsonapi-serializer").Serializer;
const { clean } = require("../functions/clean");
module.exports = (http, type, data, req, res, next) => {
  try {
    data = data ? data : {};
    let uri = process.env.APP_BASE_URL;
    let path = req.path;
    let baseUrl = req.baseUrl;
    let query = req.query;
    let resultCount = null;
    let meta = null;
    let method = req.method;
    let { size = 10, page = 1 } = query;
    page = +page;
    if (data.rows) {
      resultCount = data.count;
      data = data.rows;
    }
    data = JSON.parse(JSON.stringify(data));
    let dataSerializer = new JsonApi(type, {
      attributes:
        data instanceof Array && data.length > 0 ? Object.keys(data[0] || {}) : Object.keys(data),
      keyForAttribute: "camelCase",
    });
    var links = {
      self: `${uri}${baseUrl}${path}${query !== null ? "?" + qs.stringify(query) : ""}`,
    };
    if (data instanceof Array) {
      delete query.page;
      delete query.size;
      let totalPages = Math.ceil(resultCount / size);
      meta = { totalPages, resultCount, page, size };
      links = clean({
        self: `${uri}${baseUrl}${path}?${qs.stringify({
          ...query,
          page: page,
          size: size,
        })}`,
        next:
          page < totalPages
            ? `${uri}${baseUrl}${path}?${qs.stringify({
                ...query,
                page: page + 1,
                size: size,
              })}`
            : null,
        prev:
          page > 1
            ? `${uri}${baseUrl}${path}?${qs.stringify({
                ...query,
                page: page - 1,
                size: size,
              })}`
            : null,
        first: `${uri}${baseUrl}${path}?${qs.stringify({
          ...query,
          page: 1,
          size: size,
        })}`,
        last: `${uri}${baseUrl}${path}?${qs.stringify({
          ...query,
          page: totalPages,
          size: size,
        })}`,
      });
    }
    // data = dataSerializer.serialize(data);
    // data = data.data;
    res
      .status(http.statusCode || 200)
      .json(clean({ message: http.message, links, data, meta, method }));
  } catch (error) {
    next(error);
  }
};
