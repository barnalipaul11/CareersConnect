import { handleError } from "../helpers/handleError.js"
import Like from "../models/interviewlike.model.js"

import mongoose from "mongoose";

export const doLike = async (req, res, next) => {
    try {
        const { userid, interviewid } = req.body;

        if (!userid || !interviewid) {
            return res.status(400).json({ message: "userid and interviewid required" });
        }

        // ✅ Check if valid ObjectIds
        if (!mongoose.Types.ObjectId.isValid(userid) || !mongoose.Types.ObjectId.isValid(interviewid)) {
            return res.status(400).json({ message: "Invalid ObjectId format" });
        }

        let like = await Like.findOne({ userid, interviewid });

        if (!like) {
            like = await new Like({ userid, interviewid }).save();
        } else {
            await Like.findByIdAndDelete(like._id);
        }

        const likeCount = await Like.countDocuments({ interviewid });

        res.status(200).json({ likeCount });
    } catch (error) {
        next(handleError(500, error.message));
    }
};


export const likeCount = async (req, res, next) => {
    try {
        const { interviewid } = req.params;
        const likeCount = await Like.countDocuments({ interviewid });
        res.status(200).json({
            likeCount
        })
    } catch (error) {
        next(handleError(500, error.message));
    }
};