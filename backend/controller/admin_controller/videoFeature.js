const cloudinary = require('../../config/cloudinary_config');
const Tutorial = require('../../model/videoModel');

exports.uploadVideo = (req, res) => {
    const { title, description, category } = req.body;
    const { admin_id } = req.params

    if (!title || !description || !admin_id) {
        return res.status(400).json({ message: 'Title, description, and admin_id are required' });
    }
    if (!req.files || !req.files.video) {
        return res.status(400).json({ message: 'Video file is required' });
    }
    const videoFile = req.files.video;

    console.log(videoFile);

    if (videoFile.size > 100 * 1024 * 1024) {
        return res.status(400).json({ message: 'File size exceeds the 100MB limit' });
    }

    // Upload video to Cloudinary using the Buffer directly
    cloudinary.uploader.upload_stream(
        { resource_type: 'video', folder: 'krishi_sahayata_videos' },
        (error, result) => {
            if (error) {
                console.error('Error uploading video to Cloudinary:', error);
                return res.status(500).json({ message: 'Error uploading video', error: error.message });
            }

            const video_url = result.secure_url;

            // Create new tutorial entry in the database
            Tutorial.create({
                title,
                description,
                category,
                video_url,
                user_ID: admin_id,
            })
                .then(newTutorial => {
                    return res.status(201).json({ message: 'Video uploaded successfully', tutorial: newTutorial });
                })
                .catch(err => {
                    console.error('Error saving tutorial:', err);
                    return res.status(500).json({ message: 'Error saving tutorial', error: err.message });
                });
        }
    ).end(videoFile.data);
};

exports.getAllVideos = (req, res) => {
    const { admin_id } = req.params;

    if (!admin_id) {
        return res.status(400).json({ message: 'Admin not logged in' });
    }

    Tutorial.findAll({
        where: { user_ID: admin_id },
        attributes: ['tutorial_id', 'title', 'description', 'video_url'],
        order: [['created_at', 'DESC']],
    })
        .then(videos => {
            if (videos.length === 0) {
                return res.status(404).json({ message: 'No videos uploaded by admin' });
            }
            return res.status(200).json({
                message: 'Videos fetched successfully', videos
            });
        })
        .catch(err => {
            console.error('Error fetching videos:', err);
            return res.status(500).json({ message: 'Error fetching videos', error: err.message });
        });
};

exports.deleteVideo = async (req, res) => {
    const { tutorial_id } = req.params;

    if (!tutorial_id) {
        return res.status(400).json({ message: 'Tutorial ID is required' });
    }

    try {
        // Finding the tutorial entry in the database
        const tutorial = await Tutorial.findOne({ where: { tutorial_id } });

        if (!tutorial) {
            return res.status(404).json({ message: 'Tutorial not found' });
        }

        const videoUrl = tutorial.video_url;

        // Extracting the public_id from the Cloudinary URL
        const publicIdMatch = videoUrl.match(/upload\/(?:v\d+\/)?(.+)\.\w+$/);
        const publicId = publicIdMatch ? publicIdMatch[1] : null;

        if (!publicId) {
            return res.status(500).json({ message: 'Failed to extract video ID from URL' });
        }

        console.log('Extracted Id:  ', publicId);

        // Deleting video from Cloudinary
        await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });

        // Deleting record from the database
        await Tutorial.destroy({ where: { tutorial_id } });

        return res.status(200).json({ message: 'Video deleted successfully' });
    } catch (error) {
        console.error('Error deleting video:', error);
        return res.status(500).json({ message: 'Error deleting video', error: error.message });
    }
};

