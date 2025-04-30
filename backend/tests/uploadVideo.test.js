const { uploadVideo } = require('../controller/admin_controller/videoFeature');
const Tutorial = require('../model/videoModel');
const cloudinary = require('../config/cloudinary_config');

jest.mock('../model/videoModel', () => ({
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    destroy: jest.fn(),
}));

jest.mock('../config/cloudinary_config', () => ({
    uploader: {
        upload_stream: jest.fn(),
        destroy: jest.fn(),
    },
}));

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

const mockRequest = (params, body, files) => ({
    params: params || {},
    body: body || {},
    files: files || null,
});

describe('uploadVideo Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should return 400 if title, description, or admin_id is missing', async () => {
        const req = mockRequest({ admin_id: '1' }, { category: 'test' }, { video: { size: 10 } });
        const res = mockResponse();

        await uploadVideo(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Title, description, and admin_id are required' });
    });

    test('should return 400 if video file is missing', async () => {
        const req = mockRequest({ admin_id: '1' }, { title: 'Test', description: 'Desc', category: 'test' }, null);
        const res = mockResponse();

        await uploadVideo(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Video file is required' });
    });

    test('should return 400 if video file size exceeds 100MB', async () => {
        const req = mockRequest(
            { admin_id: '1' },
            { title: 'Test', description: 'Desc', category: 'test' },
            { video: { size: 101 * 1024 * 1024, data: Buffer.from('test') } }
        );
        const res = mockResponse();

        await uploadVideo(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'File size exceeds the 100MB limit' });
    });

    test('should return 500 if Cloudinary upload fails', async () => {
        const req = mockRequest(
            { admin_id: '1' },
            { title: 'Test', description: 'Desc', category: 'test' },
            { video: { size: 10 * 1024 * 1024, data: Buffer.from('test') } }
        );
        const res = mockResponse();

        cloudinary.uploader.upload_stream.mockImplementation((options, callback) => {
            callback(new Error('Cloudinary upload failed'), null);
            return { end: jest.fn() };
        });

        await uploadVideo(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Error uploading video',
            error: 'Cloudinary upload failed',
        });
    });

    test('should return 201 and save tutorial if upload is successful', async () => {
        const req = mockRequest(
            { admin_id: '1' },
            { title: 'Test', description: 'Desc', category: 'test' },
            { video: { size: 10 * 1024 * 1024, data: Buffer.from('test') } }
        );
        const res = mockResponse();

        const mockTutorial = {
            tutorial_id: 1,
            title: 'Test',
            description: 'Desc',
            category: 'test',
            video_url: 'https://cloudinary.com/video/test.mp4',
            user_ID: '1',
        };

        cloudinary.uploader.upload_stream.mockImplementation((options, callback) => {
            callback(null, { secure_url: 'https://cloudinary.com/video/test.mp4' });
            return { end: jest.fn() };
        });

        Tutorial.create.mockResolvedValue(mockTutorial);

        await uploadVideo(req, res);

        expect(cloudinary.uploader.upload_stream).toHaveBeenCalled();
        expect(Tutorial.create).toHaveBeenCalledWith({
            title: 'Test',
            description: 'Desc',
            category: 'test',
            video_url: 'https://cloudinary.com/video/test.mp4',
            user_ID: '1',
        });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Video uploaded successfully',
            tutorial: mockTutorial,
        });
    });
});

// // Test Suite for getAdminVideos Controller
// describe('getAdminVideos Controller', () => {
//     beforeEach(() => {
//         jest.clearAllMocks();
//     });

//     test('should return 400 if admin_id is missing', async () => {
//         const req = mockRequest({}, {}, null);
//         const res = mockResponse();

//         await getAdminVideos(req, res);

//         expect(res.status).toHaveBeenCalledWith(400);
//         expect(res.json).toHaveBeenCalledWith({ message: 'Admin not logged in' });
//     });

//     test('should return 404 if no videos are found', async () => {
//         const req = mockRequest({ admin_id: '1' }, {}, null);
//         const res = mockResponse();

//         Tutorial.findAll.mockResolvedValue([]);

//         await getAdminVideos(req, res);

//         expect(Tutorial.findAll).toHaveBeenCalledWith({
//             where: { user_ID: '1' },
//             attributes: ['tutorial_id', 'title', 'category', 'description', 'video_url'],
//             order: [['created_at', 'DESC']],
//         });
//         expect(res.status).toHaveBeenCalledWith(404);
//         expect(res.json).toHaveBeenCalledWith({ message: 'No videos uploaded by admin' });
//     });

//     test('should return 200 and list of videos if found', async () => {
//         const req = mockRequest({ admin_id: '1' }, {}, null);
//         const res = mockResponse();

//         const mockVideos = [
//             {
//                 tutorial_id: 1,
//                 title: 'Test Video',
//                 category: 'test',
//                 description: 'Desc',
//                 video_url: 'https://cloudinary.com/video/test.mp4',
//             },
//         ];

//         Tutorial.findAll.mockResolvedValue(mockVideos);

//         await getAdminVideos(req, res);

//         expect(Tutorial.findAll).toHaveBeenCalledWith({
//             where: { user_ID: '1' },
//             attributes: ['tutorial_id', 'title', 'category', 'description', 'video_url'],
//             order: [['created_at', 'DESC']],
//         });
//         expect(res.status).toHaveBeenCalledWith(200);
//         expect(res.json).toHaveBeenCalledWith({
//             message: 'Videos fetched successfully',
//             videos: mockVideos,
//         });
//     });
// });

// describe('deleteVideo Controller', () => {
//     beforeEach(() => {
//         jest.clearAllMocks();
//     });

//     test('should return 400 if tutorial_id is missing', async () => {
//         const req = mockRequest({}, {}, null);
//         const res = mockResponse();

//         await deleteVideo(req, res);

//         expect(res.status).toHaveBeenCalledWith(400);
//         expect(res.json).toHaveBeenCalledWith({ message: 'Tutorial ID is required' });
//     });

//     test('should return 404 if tutorial is not found', async () => {
//         const req = mockRequest({ tutorial_id: '1' }, {}, null);
//         const res = mockResponse();

//         Tutorial.findOne.mockResolvedValue(null);

//         await deleteVideo(req, res);

//         expect(Tutorial.findOne).toHaveBeenCalledWith({ where: { tutorial_id: '1' } });
//         expect(res.status).toHaveBeenCalledWith(404);
//         expect(res.json).toHaveBeenCalledWith({ message: 'Tutorial not found' });
//     });

//     test('should return 200 and delete video if successful', async () => {
//         const req = mockRequest({ tutorial_id: '1' }, {}, null);
//         const res = mockResponse();

//         Tutorial.findOne.mockResolvedValue({
//             tutorial_id: '1',
//             video_url: 'https://res.cloudinary.com/demo/upload/v123/test.mp4',
//         });

//         cloudinary.uploader.destroy.mockResolvedValue({});
//         Tutorial.destroy.mockResolvedValue(1);

//         await deleteVideo(req, res);

//         expect(Tutorial.findOne).toHaveBeenCalledWith({ where: { tutorial_id: '1' } });
//         expect(cloudinary.uploader.destroy).toHaveBeenCalledWith('test', { resource_type: 'video' });
//         expect(Tutorial.destroy).toHaveBeenCalledWith({ where: { tutorial_id: '1' } });
//         expect(res.status).toHaveBeenCalledWith(200);
//         expect(res.json).toHaveBeenCalledWith({ message: 'Video deleted successfully' });
//     });

//     test('should return 500 if Cloudinary deletion fails', async () => {
//         const req = mockRequest({ tutorial_id: '1' }, {}, null);
//         const res = mockResponse();

//         Tutorial.findOne.mockResolvedValue({
//             tutorial_id: '1',
//             video_url: 'https://res.cloudinary.com/demo/upload/v123/test.mp4',
//         });

//         cloudinary.uploader.destroy.mockRejectedValue(new Error('Cloudinary error'));

//         await deleteVideo(req, res);

//         expect(res.status).toHaveBeenCalledWith(500);
//         expect(res.json).toHaveBeenCalledWith({
//             message: 'Error deleting video',
//             error: 'Cloudinary error',
//         });
//     });

//     test('should return 500 if database deletion fails', async () => {
//         const req = mockRequest({ tutorial_id: '1' }, {}, null);
//         const res = mockResponse();

//         Tutorial.findOne.mockResolvedValue({
//             tutorial_id: '1',
//             video_url: 'https://res.cloudinary.com/demo/upload/v123/test.mp4',
//         });

//         cloudinary.uploader.destroy.mockResolvedValue({});
//         Tutorial.destroy.mockRejectedValue(new Error('Database deletion failed'));

//         await deleteVideo(req, res);

//         expect(res.status).toHaveBeenCalledWith(500);
//         expect(res.json).toHaveBeenCalledWith({
//             message: 'Error deleting video',
//             error: 'Database deletion failed',
//         });
//     });
// }); 