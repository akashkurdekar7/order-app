import { useEffect, useState } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";

const ProfileEdit = () => {

    const [profile, setProfile] = useState({
        shopName: "",
        personName: "",
        phone: "",
        aadhaar: "",
        location: "",
        image: null
    });
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await API.get("/api/auth/userDetails");
            setProfile({
                shopName: res.data.shopName || "",
                personName: res.data.personName || "",
                phone: res.data.phone || "",
                aadhaar: res.data.aadhaar || "",
                location: res.data.location || "",
                image: res.data.image || null
            });
            if (res.data.image) {
                setPreview(`${import.meta.env.VITE_BASE_URL}${res.data.image}`);
            }
        } catch (error) {
            toast.error("Failed to load profile");
        }
    };

    const handleChange = (e) => {
        if (e.target.name === "image") {
            const file = e.target.files[0];
            setProfile({ ...profile, image: file });
            setPreview(URL.createObjectURL(file));
        } else {
            setProfile({
                ...profile,
                [e.target.name]: e.target.value
            });
        }
    };

    const updateProfile = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("shopName", profile.shopName);
            formData.append("personName", profile.personName);
            formData.append("phone", profile.phone);
            formData.append("location", profile.location);
            if (profile.image instanceof File) {
                formData.append("image", profile.image);
            }

            await API.put("/api/auth/updateProfile", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            toast.success("Profile updated");
        } catch (error) {
            toast.error(error.response?.data?.message || "Update failed");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-lg mx-auto bg-white rounded-xl shadow-sm p-6">
                <h2 className="size30 degular-semibold mb-5">Edit Profile</h2>

                <form onSubmit={updateProfile} className="flex flex-col gap-4">
                    <div className="flex flex-col items-center mb-4">
                        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-md">
                            {preview ? (
                                <img src={preview} alt="Profile Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400 size12 degular-regular">
                                    Image
                                </div>
                            )}
                        </div>
                        <label className="mt-2 cursor-pointer text-indigo-600 hover:text-indigo-800 size16 degular-semibold">
                            Change Photo
                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={handleChange}
                                className="hidden"
                            />
                        </label>
                    </div>

                    <div>
                        <label className="degular-semibold size16">Shop Name</label>
                        <input
                            name="shopName"
                            value={profile.shopName}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2 size18 degular-regular"
                        />
                    </div>

                    <div>
                        <label className="degular-semibold size16">Owner Name</label>
                        <input
                            name="personName"
                            value={profile.personName}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2 size18 degular-regular"
                        />
                    </div>

                    <div>
                        <label className="degular-semibold size16">Phone</label>
                        <input
                            name="phone"
                            value={profile.phone}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2 size18 degular-regular"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="degular-semibold size16">Aadhar Number: </label>
                        <p className="degular-regular size18 text-gray-600">{profile.aadhaar}</p>
                    </div>

                    <div>
                        <label className="degular-semibold size16">Location</label>
                        <textarea
                            name="location"
                            value={profile.location}
                            onChange={handleChange}
                            rows="2"
                            className="w-full border rounded-lg p-2 size18 degular-regular"
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-indigo-600 text-white py-2 rounded-lg size18 degular-semibold hover:bg-indigo-700 mt-2"
                    >
                        Update Profile
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfileEdit;