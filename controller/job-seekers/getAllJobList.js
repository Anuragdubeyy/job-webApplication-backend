// const job = require("../../model/job");

// const getAllJobs = async (req, res) => {
//     // Advanced filtering, sorting, pagination
//     let query;
  
//     // Copy req.query
//     const reqQuery = { ...req.query };
  
//     // Fields to exclude
//     const removeFields = ['select', 'sort', 'page', 'limit'];
  
//     // Loop over removeFields and delete them from reqQuery
//     removeFields.forEach(param => delete reqQuery[param]);
  
//     // Create query string
//     let queryStr = JSON.stringify(reqQuery);
  
//     // Create operators ($gt, $gte, etc)
//     queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
  
//     // Finding resource
//     query = job.find(JSON.parse(queryStr)).populate({
//       path: 'employer',
//       select: 'name company'
//     });
  
//     // Select Fields
//     if (req.query.select) {
//       const fields = req.query.select.split(',').join(' ');
//       query = query.select(fields);
//     }
  
//     // Sort
//     if (req.query.sort) {
//       const sortBy = req.query.sort.split(',').join(' ');
//       query = query.sort(sortBy);
//     } else {
//       query = query.sort('-createdAt');
//     }
  
//     // Pagination
//     const page = parseInt(req.query.page, 10) || 1;
//     const limit = parseInt(req.query.limit, 10) || 25;
//     const startIndex = (page - 1) * limit;
//     const endIndex = page * limit;
//     const total = await Job.countDocuments();
  
//     query = query.skip(startIndex).limit(limit);
  
//     // Executing query
//     const jobs = await query;
  
//     // Pagination result
//     const pagination = {};
  
//     if (endIndex < total) {
//       pagination.next = {
//         page: page + 1,
//         limit
//       };
//     }
  
//     if (startIndex > 0) {
//       pagination.prev = {
//         page: page - 1,
//         limit
//       };
//     }
  
//     res.status(200).json({
//       success: true,
//       count: jobs.length,
//       pagination,
//       data: jobs
//     });
//   };
  
//   module.exports = {getAllJobs};
const job = require("../../model/job");

const getAllJobs = async (req, res, next) => {
  try {
    // Advanced filtering, sorting, pagination
    let query;

    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding resource
    query = job.find(JSON.parse(queryStr)).populate({
      path: 'employer',
      select: 'name company'
    });

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await job.countDocuments(JSON.parse(queryStr)); // Changed Job to job

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const jobs = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: jobs.length,
      pagination,
      data: jobs
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllJobs };