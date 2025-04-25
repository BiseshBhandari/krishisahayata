const path = require('path');
const fs = require('fs');
const { User } = require('../../model/association');


// View Profile
exports.viewProfile = async (req, res) => {
    const { user_id } = req.params;

    try {
        const user = await User.findByPk(user_id, {
            attributes: {
                exclude: ['password_hash', 'reset_Token', 'reset_token_exp']
            }
        });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, message: "User profile retrieved", user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error retrieving profile", error: error.message });
    }
};

// Update Profile
exports.updateProfile = async (req, res) => {
    const { user_id } = req.params;
    const { name, email, location, mobile_number } = req.body;

    try {
        const user = await User.findByPk(user_id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        let profile_image_url = user.profile_image_url;

        if (req.files && req.files.profile_image) {
            const imageFile = req.files.profile_image;

            if (user.profile_image_url) {
                const oldPath = path.join(__dirname, '../../', user.profile_image_url);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }

            const uploadDir = path.join(__dirname, '../../uploads/userPhotos/');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const imageName = `${Date.now()}_${imageFile.name}`;
            const savePath = path.join(uploadDir, imageName);

            await imageFile.mv(savePath);
            profile_image_url = `/uploads/userPhotos/${imageName}`;
        }

        await user.update({
            name: name || user.name,
            email: email || user.email,
            location: location || user.location,
            mobile_number: mobile_number || user.mobile_number,
            profile_image_url
        });

        res.status(200).json({ success: true, message: "Profile updated successfully", user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating profile", error: error.message });
    }
};
