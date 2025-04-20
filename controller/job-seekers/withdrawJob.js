const application = require("../../model/application");

const withdrawApplication = async (req, res, next) => {
    const application = await application.findById(req.params.applicationId);
  
    if (!application) {
      return next(new ErrorResponse(`No application found with ID ${req.params.applicationId}`, 404));
    }
  
    // Make sure application belongs to user
    if (application.applicant.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized to withdraw this application', 401));
    }
  
    await application.remove();
  
    res.status(200).json({
      success: true,
      data: {}
    });
  };
  
module.exports = {withdrawApplication};