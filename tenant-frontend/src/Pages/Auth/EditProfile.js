import React, { useState, useEffect } from 'react';
import { Form, Button,Row,Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Store/auth';
import { IoMdArrowBack } from "react-icons/io";
import appUrl from '../../appUrl';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { LuImagePlus } from "react-icons/lu";

const EditProfile = () => {
    const navigate = useNavigate()
    const { loggedUser, setLoggedUser, isLandlord} = useAuth();
    // const [updateButton,setUpdateButton]= useState(false);
    const appurl = appUrl();

    const [profile, setProfile] = useState({
        username: '',
        profile_image: null,
        email: '',
        mobile_number: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (loggedUser) {
            setProfile({
                username: loggedUser.username,
                profile_image: loggedUser.profile_image,
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
            profile_image: file
        }));
    }


    return (
        <>
            <NotificationContainer />
            <div className='profile'>
                <div className='profile-head mb-4'>
                    <IoMdArrowBack onClick={()=>(isLandlord? navigate("/home/landlord/"):navigate("/home/tenant/"))}/>
                    <h4>View Profile</h4>
                    <p></p>
                </div>

                <Row className='d-flex justify-content-center align-items-center'>
                    <Col lg={3} md={3} className='upload  mb-4'>
                        <div className='profile-image mb-3'>
                            <div className='profile-image' onClick={() => document.getElementById('imageInput').click()}>
                                {profile.profile_image && profile.profile_image instanceof File ? (
                                    <img src={URL.createObjectURL(profile.profile_image)} alt="profile" />
                                ) : (
                                    profile.profile_image ? (
                                        <img src={profile.profile_image} alt="profile" />
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
                        <p> Add Profile Picture</p>
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
            </div>
        </>
    )
}

export default EditProfile;
