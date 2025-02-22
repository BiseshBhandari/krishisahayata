const Tutorial = require('../../model/videoModel');

exports.getallVideos = (req, res) => {
    Tutorial.findAll({
        attributes: ['tutorial_id', 'title', 'description', 'category', 'video_url'],
        order: [['created_at', 'DESC']],
    })
        .then(videos => {
            if (videos.length === 0) {
                return res.status(404).json({ message: 'No videos uploaded' });
            }
            return res.status(200).json({
                message: 'Videos fetched successfully', videos: videos
            });
        })
        .catch(err => {
            console.error('Error fetching videos:', err);
            return res.status(500).json({ message: 'Error fetching videos', error: err.message });
        });
}
