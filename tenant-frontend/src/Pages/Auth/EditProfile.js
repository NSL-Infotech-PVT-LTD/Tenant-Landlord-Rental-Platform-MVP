import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Store/auth';
import { IoMdArrowBack } from "react-icons/io";
import appUrl from '../../appUrl';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LuImagePlus } from "react-icons/lu";

const EditProfile = () => {
    const navigate = useNavigate()
    const { loggedUser, setLoggedUser, isLandlord } = useAuth();
    const [loading, setLoading] = useState(false);
    const appurl = appUrl();
    const [profile, setProfile] = useState({
        username: '',
        profile_photo: null,
        email: '',
        mobile_number: ''
    });

    useEffect(() => {
        if (loggedUser) {
            setProfile({
                username: loggedUser.username,
                profile_photo: loggedUser.profile_photo,
                email: loggedUser.email,
                mobile_number: loggedUser.mobile_number
            });
        }
    }, [loggedUser]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile((prevProfile) => ({
            ...prevProfile,
            [name]: value,
        }));
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setProfile((prevProfile) => ({
            ...prevProfile,
            profile_photo: file
        }));
    }

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const userToken = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('username', profile.username);
            if (profile.profile_photo) {
                formData.append('photos', profile.profile_photo);
            }
            const response = await fetch(`${appurl}/user/auth/edit-profile`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
                body: formData
            });

            const data = await response.json();
            console.log("server data", data);
            if (data.code === 200) {
                toast.success(data.message);
                setLoggedUser({ ...formData }); // Update loggedUser with edited profile data
                console.log("user data", { ...formData });
                setLoading(false);
                window.location.reload()
            } else if (data.status === 404) {
                toast.error(data.message);
                setLoading(false);
            } else {
                toast.error(data.message);
                setLoading(false);
            }
        } catch (error) {
            console.error("Error fetching user data", error);
        }
    };


    return (
        <>
            <ToastContainer />
            <div className='profile'>
                <div className='profile-head mb-4'>
                    <IoMdArrowBack onClick={() => (isLandlord ? navigate("/home/landlord/") : navigate("/home/tenant/"))} />
                    <h4>Edit Profile</h4>
                    <p></p>
                </div>

                <Row className='d-flex justify-content-center align-items-center'>
                    <Col lg={3} md={3} className='upload  mb-4'>
                        <div className='profile-image mb-3'>
                            <div className='profile-image' onClick={() => document.getElementById('imageInput').click()}>
                                {profile.profile_photo && profile.profile_photo instanceof File ? (
                                    <img src={URL.createObjectURL(profile.profile_photo)} alt="profile" />
                                ) : (
                                    profile.profile_photo ? (
                                        <img src={profile.profile_photo} alt="profile" />
                                    ) : (
                                        <LuImagePlus />
                                    )
                                )}
                                <input
                                    type="file"
                                    id="imageInput"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{ display: 'none' }}
                                />
                            </div>
                        </div>

                        {profile.profile_photo ? (
                            <p style={{ color: "red" }} onClick={() => setProfile({ ...profile, profile_photo: null})}>
                                Remove Profile Picture
                            </p>
                        ) : (
                            <p style={{ color: "green" }}>
                                Add Profile Picture
                            </p>
                        )}

                    </Col>
                    <Col lg={9} md={9} >
                        <Form className='address-details mb-3'>
                            <Form.Group className='mb-3' controlId="formFirstName" required>
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    type='text'
                                    name="username"
                                    value={profile.username}
                                    onChange={handleInputChange} />
                            </Form.Group>

                            <Form.Group className="position-relative mb-3" controlId="FormEmail" required>
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email_address"
                                    value={profile.email}
                                    disabled
                                />
                            </Form.Group>

                            <Form.Group className="position-relative mb-5" controlId="FormPhone"
                                required>
                                <Form.Label>Mobile Number</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="phone_number"
                                    value={profile.mobile_number}
                                    disabled
                                />
                            </Form.Group>


                            {/* <div className='addbutton'><Button className='add-btn' type="submit" onClick={updateProfile} disabled={isLoading}>Update</Button>{' '}</div> */}
                        </Form>
                    </Col>
                </Row>

                <div className='d-flex justify-content-center'>
                    <Button className='add-btn' onClick={(e) => handleUpdateProfile(e)} disabled={loading}>
                        {loading ? (
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                className='address-spinner'
                            />
                        ) : (
                            <p>Update Profile</p>
                        )}
                    </Button>
                </div>
            </div>
        </>
    )
}

export default EditProfile;
