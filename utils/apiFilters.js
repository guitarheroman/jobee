class APIFilters {
  // url params: query is collection name, queryString are params
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // copy the url string
    const queryCopy = { ...this.queryString };

    // create array to store keyword
    const removeFields = ["sort", "fields", "q", "limit", "page"];
    removeFields.forEach(item => delete queryCopy[item]); // remove sort from url
    console.log(removeFields);

    // salary advanced filter using less than, lte,gt,gte
    let queryString = JSON.stringify(queryCopy);
    queryString = queryString.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    console.log(queryString);
    this.query = this.query.find(JSON.parse(queryString));
    return this;
  }

  // sort method
  sort() {
    // if url has sort in it
    if (this.queryString.sort) {
      // sort using multiple values i.e salary and jobType
      const sortBy = this.queryString.sort.split(",").join(" ");
      // this.query = this.query.sort(this.queryString.sort);
      console.log(sortBy);
      this.query = this.query.sort(sortBy);
    }
    // if empty sort by latest jobs
    else {
      this.query = this.query.sort("-postingDate");
    }
    return this;
  }

  // limit: get fields only ie title, description:
  limitFields() {
    if (this.queryString.fields) {
      // take 'fields' from url:/api/v1/jobs?fields=title,salary, area
      const fields = this.queryString.fields.split(",").join(" "); // split at ,, and add space to match document field value
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v"); // remove __v added by mongodb if no fields entered
    }
    return this;
  }

  // search function
  searchByQuery() {
    if (this.queryString.url) {
      // take 'q' from url:
      const url = this.queryString.q.split("-").join(" "); // split at /, and add space to match document field value
      console.log(url);
      this.query = this.query.find({$text: { $search: "\"" + qu + "\"" }});
    }
    return this;
  }

  // pagination
  pagination(){
    const page = parseInt(this.queryString.page, 10) || 1; // default page 1 if empty
    const limit = parseInt(this.queryString.limit, 10) || 10; // default limit10 if empty
    const skipResults = (page - 1) * limit; // i.e page 4 = (4 - 1) * 10 = 30.

    this.query = this.query.skip(skipResults).limit(limit); // skip first 30 results
    return this;
  }
}
module.exports = APIFilters;
