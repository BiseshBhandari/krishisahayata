const cloudinary = require('../../config/cloudinary_config');
const Tutorial = require('../../model/videoModel');

exports.uploadVideo = async (req, res) => {
    const { title, description, admin_id } = req.body;

    if (!title || !description || !admin_id) {
        return res.status(400).json({ message: 'Title, description, and admin_id are required' });
    }

    if (!req.files || !req.files.video) {
        return res.status(400).json({ message: 'Video file is required' });
    }

    const videoFile = req.files.video;

    if (videoFile.size > 100 * 1024 * 1024) {
        return res.status(400).json({ message: 'File size exceeds the 100MB limit' });
    }

    try {
        const result = await cloudinary.uploader.upload(videoFile.tempFilePath, {
            resource_type: 'video',
            folder: 'krishi_sahayata_videos'
        });

        const video_url = result.secure_url;

        console.log(videoFile.tempFilePath);

        const newTutorial = await Tutorial.create({
            title,
            description,
            video_url,
            user_ID: admin_id,
        });

        return res.status(201).json({ message: 'Video uploaded successfully', tutorial: newTutorial });
    } catch (error) {
        console.error('Error uploading video to Cloudinary:', error);
        return res.status(500).json({ message: 'Error uploading video', error: error.message });
    }
};
