import { Job } from "../models/job.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addJobPost = asyncHandler(async (req, res)=> {
    const {company, title, jobType, remoteOffice, description, ...jobDetails} = req.body;
    if(
        [company, title, jobType, remoteOffice, description].some((field)=> !field || field.trim()==="")
    ) throw new ApiError(400, "One or more required fields are missing");

    const job = await Job.create({
        company,
        title,
        jobType,
        remoteOffice,
        description,
        ...jobDetails,
        recruiter: req.user?._id,
    });

    if(!job) throw new ApiError(500, "Error occurred while creating job post.");

    res.status(201).json(
        new ApiResponse(201, "Job post created successfully!", {job})
    )
})

const editJobPost = asyncHandler(async (req, res)=> {
    const jobId = req.params?.jobId;
    const {company, title, jobType, remoteOffice, description, ...jobDetails} = req.body;
    if(
        [company, title, jobType, remoteOffice, description].some((field)=> !field || field.trim()==="")
    ) throw new ApiError(400, "One or more required fields are missing");
    
    const updatedJob = await Job.findByIdAndUpdate(jobId, {
        $set: {
            company,
            title,
            jobType,
            remoteOffice,
            description,
            ...jobDetails,
        }
    }, {
        new: true
    });
    
    if(!updatedJob) throw new ApiError(404, "Job post does not exists.");
    
    res.status(200).json(
        new ApiResponse(200, "Job post updated successfully!", {job: updatedJob})
    )
})

const getJobPost = asyncHandler(async (req, res)=> {
    const jobId = req.params?.jobId;
    const job = await Job.findById(jobId).populate("recruiter", "name");

    if(!job) throw new ApiError(404, "Job post does not exists.");

    res.status(200).json(
        new ApiResponse(200, "Job post fetched successfully!", {job})
    )
})

const getAllJobPost = asyncHandler(async (req, res)=> {
    const title = req.query?.title || "";
    const skills = req.query?.skills?.split(",") || [];

    const filter = {};
    if(skills.length) filter.skillsRequired = {$in: skills};
    
    const jobs = await Job.find({
        title: {$regex: title, $options: "i"},
        ...filter
    }).select("-description -aboutCompany -information -recruiter");

    res.status(200).json(
        new ApiResponse(200, "Jobs fetched successfully!", {jobs})
    )
})

export {
    addJobPost,
    editJobPost,
    getJobPost,
    getAllJobPost,
}